const initRealAPI = () => {
        let apiChart;
    let apiDonut;
    let currentApiCoin = 'BTC';
    let currentApiTime = '1D';

    // Binance Zaman Aralıkları
    const getInterval = (time) => {
        switch(time) {
            case '1D': return { interval: '1h', limit: 24 };  // 1 Gün (Saatlik)
            case '1M': return { interval: '1d', limit: 30 };  // 1 Ay (Günlük)
            case '1Y': return { interval: '1w', limit: 52 };  // 1 Yıl (Haftalık)
            case 'ALL': return { interval: '1M', limit: 60 }; // Hepsi (Aylık)
            default: return { interval: '1h', limit: 24 };
        }
    };

    // Binance'den Veri Çekme
    async function fetchBinanceData(coin, time) {
        const { interval, limit } = getInterval(time);
        const url = `https://api.binance.com/api/v3/klines?symbol=${coin}USDT&interval=${interval}&limit=${limit}`;
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            
            let chartData = data.map(d => [d[0], parseFloat(d[4])]); // [Zaman, Kapanış Fiyatı]
            let lastPrice = chartData[chartData.length - 1][1];
            
            document.getElementById('realDisplayPrice').innerText = `$${lastPrice.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            return chartData;
        } catch (err) {
            console.error("API Hatası:", err);
            document.getElementById('realDisplayPrice').innerText = "Bağlantı Hatası!";
            return [];
        }
    }

    // Ana Grafiği Çiz (Line Chart)
    async function renderApiChart() {
        const data = await fetchBinanceData(currentApiCoin, currentApiTime);
        const color = currentApiCoin === 'BTC' ? '#f7931a' : '#627eea';

        const options = {
            series: [{ name: `${currentApiCoin}/USDT`, data: data }],
            chart: { type: 'area', height: 350, toolbar: { show: false }, background: 'transparent' },
            colors: [color],
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } },
            dataLabels: { show: false },
            stroke: { curve: 'smooth', width: 2 },
            xaxis: { type: 'datetime', labels: { style: { colors: '#9ca3af' } } },
            yaxis: { labels: { style: { colors: '#9ca3af' }, formatter: (val) => "$" + val.toLocaleString() } },
            theme: { mode: document.documentElement.getAttribute('data-theme') || 'dark' }
        };

        if (apiChart) {
            apiChart.updateOptions({ colors: [color] });
            apiChart.updateSeries([{ name: `${currentApiCoin}/USDT`, data: data }]);
        } else {
            apiChart = new ApexCharts(document.querySelector("#realApiChart"), options);
            apiChart.render();
        }
    }

    // Donut Grafiği Çiz (Sabit Dominans Verisi)
    function renderApiDonut() {
        const options = {
            series: [52.4, 16.8, 30.8], // Gerçekçi dominans oranları
            labels: ['Bitcoin', 'Ethereum', 'Diğer Altcoinler'],
            chart: { type: 'donut', height: 300, background: 'transparent' },
            colors: ['#f7931a', '#627eea', '#818cf8'],
            stroke: { show: false },
            dataLabels: { enabled: false },
            legend: { position: 'bottom', labels: { colors: '#9ca3af' } },
            plotOptions: { pie: { donut: { size: '75%' } } }
        };

        if (!apiDonut) {
            apiDonut = new ApexCharts(document.querySelector("#realApiDonut"), options);
            apiDonut.render();
        }
    }

    // Tıklama Olayları (Coin Seçimi)
    document.querySelectorAll('.real-coin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.real-coin-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentApiCoin = e.target.getAttribute('data-coin');
            document.getElementById('realDisplayPrice').innerText = "Hesaplanıyor...";
            renderApiChart();
        });
    });

    // Tıklama Olayları (Zaman Seçimi)
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentApiTime = e.target.getAttribute('data-time');
            renderApiChart();
        });
    });

    // İlk Yükleme
    renderApiChart();
    renderApiDonut();
}