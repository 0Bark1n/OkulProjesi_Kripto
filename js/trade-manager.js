function initTrades() {
    const tradeForm = document.getElementById('tradeForm');
    const historyTableBody = document.querySelector('.history-table tbody');
    const totalBalanceEl = document.querySelector('.balance-card h2');
    const bankBalanceEl = document.getElementById('bank-balance');
    
    // 1. LOCALSTORAGE'DAN VERİLERİ ÇEK VE HATALARI (NaN) TEMİZLE
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let bankBalance = parseFloat(localStorage.getItem('bank_balance'));
    let btcBalance = parseFloat(localStorage.getItem('btc_bakiye'));
    let ethBalance = parseFloat(localStorage.getItem('eth_bakiye'));

    // Eğer eski hatalardan dolayı veriler bozulduysa (NaN olduysa) sıfırla
    if (isNaN(bankBalance)) bankBalance = 10000;
    if (isNaN(btcBalance)) btcBalance = 0;
    if (isNaN(ethBalance)) ethBalance = 0;

    let portfolioValue = 0;

    // --- ARAYÜZÜ GÜNCELLEME ---
    const updateUI = () => {
        // Fiyatları sistemden (window.coins) çek
        let btcPrice = (window.coins && window.coins['BTC']) ? window.coins['BTC'].lastPrice : 69300;
        let ethPrice = (window.coins && window.coins['ETH']) ? window.coins['ETH'].lastPrice : 3400;
        
        portfolioValue = (btcBalance * btcPrice) + (ethBalance * ethPrice);
        
        totalBalanceEl.innerHTML = `$${portfolioValue.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span>Portföy</span>`;
        bankBalanceEl.innerText = `$${bankBalance.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    };

    // --- ADMIN PARA EKLEME ---
    document.getElementById('btn-admin-add').onclick = () => {
        const adminInput = document.getElementById('adminAmount');
        const addAmount = parseFloat(adminInput.value);

        if (!addAmount || addAmount <= 0) {
            window.addNotification("Lütfen geçerli bir miktar girin.", "error");
            return;
        }

        bankBalance += addAmount;
        localStorage.setItem('bank_balance', bankBalance);
        updateUI();
        adminInput.value = '';
        window.addNotification(`Hesaba $${addAmount.toLocaleString('tr-TR')} başarıyla eklendi!`);
        if (typeof window.updateAssetsPanel === 'function') window.updateAssetsPanel(); 
    };

    // --- ALIM / SATIM İŞLEMLERİ (HATASIZ YAPI) ---
    const handleTrade = (type) => {
        const amount = parseFloat(document.getElementById('tradeAmount').value); 
        
        // Seçilen coini alıp BÜYÜK HARFE çeviriyoruz ki hata payı kalmasın
        const assetRaw = document.getElementById('assetSelect').value; 
        const assetUpper = assetRaw.toUpperCase();

        if (!amount || amount <= 0) {
            window.addNotification("Lütfen geçerli bir miktar girin.", "error");
            return;
        }

        // Hangi coin seçildi? (Garantili Kontrol)
        const isBTC = assetUpper.includes('BTC') || assetUpper.includes('BITCOIN');
        const isETH = assetUpper.includes('ETH') || assetUpper.includes('ETHEREUM');

        // Eğer sistem ne alındığını anlamazsa işlemi durdur (Paramız boşa gitmesin)
        if (!isBTC && !isETH) {
            window.addNotification("Geçersiz varlık seçimi!", "error");
            return;
        }

        // Güncel Fiyatı Sistemden Al (HTML'deki yazıdan okumak yerine veriden okuyoruz)
        const coinKey = isBTC ? 'BTC' : 'ETH';
        const currentPrice = (window.coins && window.coins[coinKey]) ? window.coins[coinKey].lastPrice : (isBTC ? 69300 : 3400);

        // Alınacak veya Satılacak Coin Adeti
        const coinAmount = amount / currentPrice;

        if (type === 'Alım') {
            if (amount > bankBalance) {
                window.addNotification("Nakit bakiyeniz yetersiz!", "error");
                return;
            }
            bankBalance -= amount; // Nakitten düş
            
            // Cüzdana ekle
            if (isBTC) btcBalance += coinAmount;
            if (isETH) ethBalance += coinAmount;
            
        } else { // Satış
            let currentCoinBalance = isBTC ? btcBalance : ethBalance;
            let coinValueInUsd = currentCoinBalance * currentPrice;

            if (amount > coinValueInUsd) {
                window.addNotification(`Yeterli ${assetRaw} yok! (Maks: $${coinValueInUsd.toLocaleString('tr-TR', {minimumFractionDigits: 2})})`, "error");
                return;
            }

            // Cüzdandan düş
            if (isBTC) btcBalance -= coinAmount;
            if (isETH) ethBalance -= coinAmount;
            
            bankBalance += amount; // Nakite ekle
        }

        // --- İŞLEM GEÇMİŞİNİ KAYDET ---
        const newTrade = {
            asset: assetRaw, 
            type: type,
            amount: `$${amount.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`, 
            price: `$${currentPrice.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`, 
            date: new Date().toLocaleString('tr-TR')
        };

        transactions.unshift(newTrade);

        // --- HAFIZAYA YAZ ---
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('bank_balance', bankBalance);
        localStorage.setItem('btc_bakiye', btcBalance);
        localStorage.setItem('eth_bakiye', ethBalance);
        
        // Arayüzleri Güncelle
        window.addNotification(`${amount}$ tutarında ${assetRaw} ${type.toLowerCase()} işlemi başarılı!`);
        updateUI();
        document.getElementById('tradeAmount').value = '';
        renderTable();

        // DONUT GRAFİĞİNİ ANINDA TETİKLE
        if (typeof window.updateAssetsPanel === 'function') {
            window.updateAssetsPanel(); 
        }
    };

    // --- TABLOYU EKRANA BASMA ---
    const renderTable = () => {
        // Hem dashboard'da (varsa) hem de yeni panelde yazdırmak için:
        const historyTableBody = document.getElementById('full-history-body'); 
        
        if(!historyTableBody) return;

        if (transactions.length === 0) {
            historyTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px;">Henüz bir işlem yapmadınız.</td></tr>`;
            return;
        }

        historyTableBody.innerHTML = transactions.map(t => `
            <tr class="animate-row">
                <td>${t.asset}</td>
                <td class="${t.type === 'Alım' ? 'text-success' : 'text-danger'}"><strong>${t.type}</strong></td>
                <td>${t.amount}</td>
                <td>${t.price}</td>
                <td>${t.date}</td>
                <td><span class="status completed">Tamamlandı</span></td>
            </tr>
        `).join('');
    };

    document.getElementById('btn-buy').onclick = () => handleTrade('Alım');
    document.getElementById('btn-sell').onclick = () => handleTrade('Sat');
    
    updateUI();
    renderTable();
}