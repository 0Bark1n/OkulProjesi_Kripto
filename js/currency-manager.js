const initCurrency = () => {
    const amountInput = document.getElementById('currency-amount');
    const fromSelect = document.getElementById('currency-from');
    const toSelect = document.getElementById('currency-to');
    const swapBtn = document.getElementById('swap-currency');
    const resultText = document.getElementById('currency-result-text');
    const rateText = document.getElementById('currency-rate-text');
    const popularList = document.getElementById('popular-rates-list');
    const updateInfoText = document.getElementById('api-update-info'); // YENİ: Güncelleme yazısı

    let rates = {};
    let autoUpdateTimer = null; // YENİ: Otomatik güncelleme sayacı

    const popularCurrencies = [
        { code: 'USD', flag: '🇺🇸' },
        { code: 'EUR', flag: '🇪🇺' },
        { code: 'GBP', flag: '🇬🇧' },
        { code: 'JPY', flag: '🇯🇵' },
        { code: 'CHF', flag: '🇨🇭' },
        { code: 'AED', flag: '🇦🇪' }
    ];

    // 1. API'den Verileri Çek
    async function fetchCurrencies() {
        try {
            const res = await fetch('https://open.er-api.com/v6/latest/USD');
            const data = await res.json();
            rates = data.rates;
            
            if (rates) {
                // Eğer kutular boşsa doldur (Sadece ilk açılışta çalışır, seçimini bozmaz)
                if (fromSelect.options.length === 0) populateSelects(Object.keys(rates));
                
                calculate(); 
                populatePopularRates(); 
                handleUpdateTimes(data.time_last_update_unix, data.time_next_update_unix); // YENİ: Saatleri hesapla
            }
        } catch (err) {
            console.error("Döviz API Hatası:", err);
            resultText.innerText = "API Hatası!";
            rateText.innerText = "Bağlantı kurulamadı.";
        }
    }

    // 2. Güncelleme Saatlerini Hesapla ve Sayacı Kur (YENİ EKLENDİ)
    function handleUpdateTimes(lastUnix, nextUnix) {
        // Unix zamanını normal saate çevir
        const lastDate = new Date(lastUnix * 1000);
        const nextDate = new Date(nextUnix * 1000);
        
        const formatOptions = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        const lastStr = lastDate.toLocaleDateString('tr-TR', formatOptions);
        const nextStr = nextDate.toLocaleDateString('tr-TR', formatOptions);

        if(updateInfoText) {
            updateInfoText.innerHTML = `<i class="fas fa-sync-alt"></i> Son Güncelleme: <b>${lastStr}</b> | Sonraki: <b>${nextStr}</b>`;
        }

        // Bir sonraki güncellemeye ne kadar kaldığını hesapla (Milisaniye cinsinden)
        const now = Date.now();
        let timeUntilNext = (nextUnix * 1000) - now;
        
        if (timeUntilNext < 0) timeUntilNext = 60000; // Eğer zaman çoktan geçmişse 1 dakika sonra tekrar dene

        // Eski sayacı temizle ve yenisini kur
        if (autoUpdateTimer) clearTimeout(autoUpdateTimer);
        autoUpdateTimer = setTimeout(() => {
            fetchCurrencies(); // Vakti gelince kendi kendini günceller!
            console.log("Kurlar otomatik olarak güncellendi.");
        }, timeUntilNext);
    }

    // 3. Select Kutularını Doldur
    function populateSelects(currencies) {
        const html = currencies.map(c => `<option value="${c}">${c}</option>`).join('');
        fromSelect.innerHTML = html;
        toSelect.innerHTML = html;
        fromSelect.value = 'TRY'; 
        toSelect.value = 'USD';
    }

    // 4. Çeviri Hesaplaması
    function calculate() {
        const amount = parseFloat(amountInput.value);
        const from = fromSelect.value;
        const to = toSelect.value;

        if (isNaN(amount) || !rates[from] || !rates[to]) return;

        const rate = rates[to] / rates[from];
        const result = amount * rate;

        resultText.innerText = `${result.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${to}`;
        rateText.innerText = `1 ${from} = ${rate.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${to}`;
    }

    // 5. Sağ Taraftaki (Popüler) Listeyi Doldur ve Tıklama Ekle
    function populatePopularRates() {
        if (!rates['TRY']) return; 
        
        let html = '';
        popularCurrencies.forEach(currency => {
            if(rates[currency.code]) {
                const toTry = rates['TRY'] / rates[currency.code];
                // YENİ: Div'e clickable-rate class'ı ve data-code özelliği ekledik
                html += `
                    <div class="rate-item clickable-rate" data-code="${currency.code}">
                        <span>${currency.flag} ${currency.code}</span>
                        <b>₺${toTry.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
                    </div>
                `;
            }
        });
        popularList.innerHTML = html;

        // YENİ: Listeden birine tıklayınca çalışacak kod
        document.querySelectorAll('.clickable-rate').forEach(item => {
            item.addEventListener('click', (e) => {
                const clickedCode = e.currentTarget.getAttribute('data-code');
                
                // Miktara dokunma! Sadece Kimden'i TRY, Kime'yi tıklanan Kur yap.
                fromSelect.value = 'TRY';
                toSelect.value = clickedCode;
                calculate(); // Hesabı yenile
            });
        });
    }

    // 6. Olay Dinleyicileri
    if (amountInput && fromSelect && toSelect) {
        amountInput.addEventListener('input', calculate);
        fromSelect.addEventListener('change', calculate);
        toSelect.addEventListener('change', calculate);

        swapBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const temp = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = temp;
            calculate(); 
        });

        fetchCurrencies(); // Sistemi başlat
    }
}