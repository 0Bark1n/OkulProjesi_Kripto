let chartInterval; 

// SİSTEMİN BEYNİ: Fiyatları global yapıyoruz ki diğer dosyalar (Al/Sat ve Donut Grafik) okuyabilsin.
window.coins = {
    BTC: {
        data: [64000, 65200, 64800, 66100, 68842],
        lastPrice: 68842,
        isUp: true
    },
    ETH: {
        data: [3300, 3450, 3380, 3520, 3450],
        lastPrice: 3450,
        isUp: true
    }
};

function initChart() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    let currentCoin = localStorage.getItem('last_selected_coin') || 'BTC';

    var options = {
        series: [{ name: 'Fiyat', data: window.coins[currentCoin].data }],
        chart: {
            type: 'area', height: 300,
            animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 1000 } },
            toolbar: { show: false }, zoom: { enabled: false }
        },
        colors: ['#22c55e'],
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.1 } },
        dataLabels: { enabled: false },
        xaxis: { 
            labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false },
            tooltip: { enabled: false } 
        },
        yaxis: { labels: { style: { colors: '#888', fontFamily: 'Montserrat' } } },
        grid: { borderColor: 'rgba(128, 128, 128, 0.1)' },
        
        tooltip: {
            theme: currentTheme,
            x: { show: false },
            y: {
                title: { formatter: function () { return ''; } },
                formatter: function (val) {
                    return "$" + val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
            marker: { show: false }
        }
    };

    var chart = new ApexCharts(document.querySelector("#mainChart"), options);
    chart.render();
    
    const savedCoin = localStorage.getItem('last_selected_coin') || 'BTC';
    const targetBtn = document.querySelector(`.coin-btn[data-coin="${savedCoin}"]`);

    if (targetBtn) {
        // Tüm butonlardan active'i sil, hafızadakine ekle
        document.querySelectorAll('.coin-btn').forEach(b => b.classList.remove('active'));
        targetBtn.classList.add('active');
        
        // Grafiği ve fiyatı hafızadaki coine göre ilk kez ayarla
        let coinData = window.coins[savedCoin];
        chart.updateSeries([{ data: coinData.data }]);
        document.getElementById('displayPrice').innerText = `$${coinData.lastPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
    }

    // Sayfa açılır açılmaz 0 saniye gecikmeyle fiyatları ve UI'ı bir kez güncelle
    setTimeout(() => {
        if(typeof updateData === 'function') {
            updateData(); // İlk veriyi hemen bas
        }
    }, 50); // 50ms sonra çalıştır (Hemen!)

    // Tema değişimi yakalama
    document.addEventListener('themeChanged', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (typeof chart !== 'undefined') chart.updateOptions({ tooltip: { theme: isDark ? 'dark' : 'light' } });
    });

    // Sekme Değiştirme (BTC / ETH)
    document.querySelectorAll('.coin-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.coin-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCoin = btn.getAttribute('data-coin');
            localStorage.setItem('last_selected_coin', currentCoin);
            
            let coinData = window.coins[currentCoin];
            chart.updateSeries([{ data: coinData.data }]);
            document.getElementById('displayPrice').innerText = `$${coinData.lastPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
            
            let themeColor = coinData.isUp ? '#22c55e' : '#ef4444';
            chart.updateOptions({ colors: [themeColor] });
        });
    });

    // --- ARKA PLANDA GERÇEKÇİ GÜNCELLEME FONKSİYONU ---
    function updateData() {
        Object.keys(window.coins).forEach(symbol => {
            let coin = window.coins[symbol];
            let oldVal = coin.lastPrice;
            // %1 ile -%1 arası rastgele fiyat değişimi simülasyonu
            let changeAmount = oldVal * (Math.random() * 0.02 - 0.01);
            let newVal = Math.floor(oldVal + changeAmount);

            coin.data.push(newVal);
            if(coin.data.length > 15) coin.data.shift();
            coin.lastPrice = newVal;
            coin.isUp = newVal >= oldVal;

            // Kartları Güncelle
            const cardPriceEl = document.getElementById(`card-price-${symbol}`);
            const cardChangeEl = document.getElementById(`card-change-${symbol}`);
            if (cardPriceEl) {
                cardPriceEl.innerText = `$${newVal.toLocaleString('tr-TR')}`;
                cardChangeEl.className = coin.isUp ? 'text-success' : 'text-danger';
                cardChangeEl.innerText = `${coin.isUp ? '+' : '-'}${(Math.random() * 2).toFixed(2)}%`;
            }

            // Aktif Olan Ana Grafiği Güncelle
            if (symbol === currentCoin) {
                chart.updateSeries([{ data: coin.data }]);
                chart.updateOptions({ colors: [coin.isUp ? '#22c55e' : '#ef4444'] });
                document.getElementById('displayPrice').innerText = `$${newVal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
                
                const priceChangeEl = document.getElementById('priceChange');
                if (priceChangeEl) {
                    priceChangeEl.innerHTML = `<span class="red-dot"></span> Canlı`;
                    priceChangeEl.className = coin.isUp ? 'live-status text-success' : 'live-status text-danger';
                }
            }
        });

        // --- GERÇEKÇİ PORTFÖY HESAPLAMASI ---
        let btcMiktar = parseFloat(localStorage.getItem('btc_bakiye')) || 0;
        let ethMiktar = parseFloat(localStorage.getItem('eth_bakiye')) || 0;
        
        let anlikBtcDegeri = btcMiktar * window.coins['BTC'].lastPrice;
        let anlikEthDegeri = ethMiktar * window.coins['ETH'].lastPrice;
        let portfoyToplami = anlikBtcDegeri + anlikEthDegeri;

        // Portföyü Ana Ekrana Yazdır
        const totalBalanceEl = document.querySelector('.balance-card h2');
        if (totalBalanceEl) {
            totalBalanceEl.innerHTML = `$${portfoyToplami.toLocaleString('tr-TR', {minimumFractionDigits: 2})} <span>Portföy</span>`;
            localStorage.setItem('portfolio_value', portfoyToplami);
        }

        // --- VARLIKLARIM (DONUT) SEKMESİNE "KENDİNİ GÜNCELLE" SİNYALİ GÖNDER ---
        if (typeof window.updateAssetsPanel === 'function') {
            window.updateAssetsPanel();
        }
    }

    // --- ZAMANLAYICI MANTIĞI ---
    window.setUpdateInterval = function(seconds) {
        if (chartInterval) clearInterval(chartInterval);
        localStorage.setItem('updateFrequency', seconds); 
        chartInterval = setInterval(updateData, seconds * 1000);
    };

    // Ayarlar Menüsü Hız Değişimi
    const intervalInput = document.querySelector('.intbox');
    if (intervalInput) {
        let savedSpeed = localStorage.getItem('updateFrequency') || 5;
        intervalInput.value = savedSpeed;

        intervalInput.addEventListener('change', (e) => {
            let val = parseInt(e.target.value);
            if (val > 0) {
                window.setUpdateInterval(val);
                if(window.addNotification) window.addNotification(`Güncelleme hızı ${val} saniye yapıldı.`);
            }
        });
    }

    // İlk Başlatma
    let initialSpeed = localStorage.getItem('updateFrequency') || 5;
    window.setUpdateInterval(initialSpeed);
}