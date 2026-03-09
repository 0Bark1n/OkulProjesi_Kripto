let chartInterval; // Döngüyü kontrol etmek için global değişken

function initChart() {
    const coins = {
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

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    let currentCoin = 'BTC';

    // ApexCharts İlk Kurulum
    var options = {
        series: [{ name: 'Fiyat', data: coins[currentCoin].data }],
        chart: {
            type: 'area',
            height: 300,
            animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 1000 } },
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        colors: ['#22c55e'],
        stroke: { curve: 'smooth', width: 2 },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.1 } },
        dataLabels: { enabled: false },
        xaxis: { 
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: {
                enabled: false // Alttan çıkan o sinir bozucu "6" vs. yazan oku tamamen kapatır
            }
        },
        yaxis: { labels: { style: { colors: '#888', fontFamily: 'Montserrat' } } },
        grid: { borderColor: 'rgba(128, 128, 128, 0.1)' },
        
        // --- YENİ EKLENEN KISIM: TOOLTIP (BİLGİ KUTUSU) AYARLARI ---
        tooltip: {
            theme: currentTheme, // Sitenin temasına otomatik uyum sağlar (Siyahsa siyah, beyazsa beyaz)
            x: {
                show: false // Kutunun üstündeki gereksiz X ekseni numarasını gizler
            },
            y: {
                title: {
                    formatter: function () {
                        return ''; // "Series-1" gibi gereksiz başlıkları siler
                    }
                },
                formatter: function (val) {
                    // Fiyatı sadece şık bir şekilde yazdırır: Örn: $69.300,00
                    return "$" + val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            },
            marker: {
                show: false // Fiyatın yanındaki yeşil/kırmızı yuvarlağı gizler (daha sade durması için)
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#mainChart"), options);
    chart.render();

    // Tema değiştiğinde grafiği anında güncelle
    document.addEventListener('themeChanged', () => {
        // Sitenin o anki temasını kontrol et (dark mı light mı?)
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const isDark = currentTheme === 'dark';

        // Grafiği yeni temaya göre güncelle (chart değişkeninin adının chart olduğunu varsayıyorum)
        if (typeof chart !== 'undefined') {
            chart.updateOptions({
                tooltip: {
                    theme: isDark ? 'dark' : 'light'
                }
            });
        }
    });

    // Sekme Değiştirme (BTC/ETH Butonları)
    document.querySelectorAll('.coin-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.coin-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCoin = btn.getAttribute('data-coin');
            
            chart.updateSeries([{ data: coins[currentCoin].data }]);
            document.getElementById('displayPrice').innerText = `$${coins[currentCoin].lastPrice.toLocaleString()}`;
            
            let themeColor = coins[currentCoin].isUp ? '#22c55e' : '#ef4444';
            chart.updateOptions({ colors: [themeColor] });
        });
    });

    // --- ARKA PLANDA GÜNCELLEME FONKSİYONU ---
    function updateData() {
        let totalChangeForBalance = 0;

        Object.keys(coins).forEach(symbol => {
            let coin = coins[symbol];
            let oldVal = coin.lastPrice;
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
                cardPriceEl.innerText = `$${newVal.toLocaleString()}.00`;
                cardChangeEl.className = coin.isUp ? 'text-success' : 'text-danger';
                cardChangeEl.innerText = `${coin.isUp ? '+' : '-'}${(Math.random() * 2).toFixed(2)}%`;
            }

            // Aktif Grafiği Güncelle
            if (symbol === currentCoin) {
                chart.updateSeries([{ data: coin.data }]);
                let themeColor = coin.isUp ? '#22c55e' : '#ef4444';
                chart.updateOptions({ colors: [themeColor] });
                
                document.getElementById('displayPrice').innerText = `$${newVal.toLocaleString()}`;
                
                const priceChangeEl = document.getElementById('priceChange');
                if (priceChangeEl) {
                    // Kırmızı noktayı koruyarak güncelle
                    priceChangeEl.innerHTML = `<span class="red-dot"></span> Canlı`;
                    priceChangeEl.className = coin.isUp ? 'live-status text-success' : 'live-status text-danger';
                }
                totalChangeForBalance = changeAmount;
            }
        });

        // Portföy Değerini Güncelle
        const totalBalanceEl = document.querySelector('.balance-card h2');
        if (totalBalanceEl) {
            let currentTotal = parseFloat(localStorage.getItem('portfolio_value')) || 0;
            let newTotal = currentTotal + (totalChangeForBalance * 0.1); 
            if(newTotal < 0) newTotal = 0;
            
            totalBalanceEl.innerHTML = `$${newTotal.toLocaleString('tr-TR', {minimumFractionDigits: 2})} <span>Portföy</span>`;
            localStorage.setItem('portfolio_value', newTotal);
        }
    }

    // --- DİNAMİK ZAMANLAYICI MANTIĞI (GÜNCELLENDİ) ---
    window.setUpdateInterval = function(seconds) {
        if (chartInterval) clearInterval(chartInterval);
        
        // Değeri hafızaya kaydet
        localStorage.setItem('update_speed', seconds);
        
        chartInterval = setInterval(updateData, seconds * 1000);
    };

    // Ayarlar menüsündeki intbox'ı bul ve hafızadaki değeri içine yaz
    const intervalInput = document.querySelector('.intbox');
    if (intervalInput) {
        // Sayfa açıldığında hafızadaki saniyeyi kutucuğa yaz
        let savedSpeed = localStorage.getItem('update_speed') || 5;
        intervalInput.value = savedSpeed;

        intervalInput.addEventListener('change', (e) => {
            let val = parseInt(e.target.value);
            if (val > 0) {
                window.setUpdateInterval(val);
                if(window.addNotification) window.addNotification(`Güncelleme hızı ${val} saniye yapıldı.`);
            }
        });
    }

    // Başlangıçta hafızadaki değerle veya varsayılan 5 ile başlat
    let initialSpeed = localStorage.getItem('update_speed') || 5;
    window.setUpdateInterval(initialSpeed);
}