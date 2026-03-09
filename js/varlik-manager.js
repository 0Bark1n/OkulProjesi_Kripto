/**
 * Assets Manager - KriptoProje
 * Varlıklarım (Donut Grafik ve Tablo) bölümünü yönetir.
 */

let donutChart;
let assetsUpdateInterval;

// --- 1. GRAFİĞİ İLK KEZ ÇİZDİRME ---
const initDonutChart = () => {
    const donutContainer = document.querySelector("#donutChart");
    if (!donutContainer) return; // Div yoksa hata vermesin diye durduruyoruz

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const textColor = currentTheme === 'dark' ? '#f1f5f9' : '#1e293b';

    const donutOptions = {
        series: [0, 0, 0], // İlk başta sıfır, birazdan güncellenecek
        labels: ['Nakit', 'Bitcoin (BTC)', 'Ethereum (ETH)'],
        chart: {
            type: 'donut',
            height: 350,
            background: 'transparent',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                dynamicAnimation: { speed: 350 }
            }
        },
        colors: ['#818cf8', '#f7931a', '#627eea'], 
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        name: { show: true, color: textColor },
                        value: { 
                            show: true, 
                            color: textColor,
                            formatter: (val) => "$" + val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Toplam Varlık',
                            color: textColor,
                            formatter: function (w) {
                                let total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                return "$" + total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                            }
                        }
                    }
                }
            }
        },
        dataLabels: { enabled: false },
        stroke: { show: false },
        legend: { position: 'bottom', labels: { colors: textColor } },
        tooltip: { theme: currentTheme }
    };

    donutChart = new ApexCharts(donutContainer, donutOptions);
    donutChart.render();
};

// --- 2. VERİLERİ VE GRAFİĞİ CANLI GÜNCELLEME ---
window.updateAssetsPanel = () => {
    // Bakiyeleri localStorage'dan al (Trade-manager ile %100 aynı isimler)
    let nakit = parseFloat(localStorage.getItem('bank_balance')) || 10000;
    let btcMiktar = parseFloat(localStorage.getItem('btc_bakiye')) || 0;
    let ethMiktar = parseFloat(localStorage.getItem('eth_bakiye')) || 0;

    // İŞTE HATAYI ÇÖZEN KISIM: Fiyatları 'BTC' ve 'ETH' olarak çekiyoruz
    let btcFiyat = (window.coins && window.coins['BTC']) ? window.coins['BTC'].lastPrice : 69300;
    let ethFiyat = (window.coins && window.coins['ETH']) ? window.coins['ETH'].lastPrice : 3400;

    let btcDeger = btcMiktar * btcFiyat;
    let ethDeger = ethMiktar * ethFiyat;

    // Grafiği Canlı Güncelle
    if (donutChart) {
        donutChart.updateSeries([nakit, btcDeger, ethDeger]);
    }

    // Tabloyu Canlı Güncelle
    const tbody = document.getElementById('assets-table-body');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td><strong style="color: #818cf8;">Nakit</strong></td>
                <td>-</td>
                <td>$${nakit.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
                <td><strong style="color: #f7931a;">Bitcoin (BTC)</strong></td>
                <td>${btcMiktar.toFixed(4)}</td>
                <td>$${btcDeger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
                <td><strong style="color: #627eea;">Ethereum (ETH)</strong></td>
                <td>${ethMiktar.toFixed(4)}</td>
                <td>$${ethDeger.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `;
    }
};

// --- 3. OTOMATİK DÖNGÜYÜ BAŞLATMA ---
const startAssetsAutoUpdate = () => {
    // Ayarlardaki süreyi al (Varsayılan 5 saniye)
    let updateSeconds = parseInt(localStorage.getItem('updateFrequency')) || 5; 
    
    if (assetsUpdateInterval) {
        clearInterval(assetsUpdateInterval);
    }

    assetsUpdateInterval = setInterval(() => {
        if (typeof window.updateAssetsPanel === 'function') {
            window.updateAssetsPanel();
        }
    }, updateSeconds * 1000);
};

// --- 4. OLAY DİNLEYİCİLERİ (Sayfa Yüklenme, Tema Değişimi) ---
document.addEventListener('DOMContentLoaded', () => {
    initDonutChart();
    
    // Verilerin tam yüklenmesi için 0.5 saniye gecikmeyle ilk güncellemeyi yap
    setTimeout(() => {
        window.updateAssetsPanel(); 
        startAssetsAutoUpdate();    
    }, 500);
});

// Tema değişirse grafiğin yazı renklerini de uyarla
document.addEventListener('themeChanged', () => {
    if (!donutChart) return;
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const textColor = currentTheme === 'dark' ? '#f1f5f9' : '#1e293b';
    
    donutChart.updateOptions({
        tooltip: { theme: currentTheme },
        plotOptions: { pie: { donut: { labels: { name: { color: textColor }, value: { color: textColor }, total: { color: textColor } } } } },
        legend: { labels: { colors: textColor } }
    });
});

// Ayarlar güncellenirse (örneğin 5 saniye yerine 2 saniye seçilirse) sayacı yenile
document.addEventListener('settingsUpdated', () => {
    startAssetsAutoUpdate();
});