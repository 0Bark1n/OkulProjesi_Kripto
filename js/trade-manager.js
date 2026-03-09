function initTrades() {
    const tradeForm = document.getElementById('tradeForm');
    const historyTableBody = document.querySelector('.history-table tbody');
    const totalBalanceEl = document.querySelector('.balance-card h2');
    const bankBalanceEl = document.getElementById('bank-balance');
    
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let portfolioValue = parseFloat(localStorage.getItem('portfolio_value')) || 0;
    let bankBalance = parseFloat(localStorage.getItem('bank_balance')) || 10000;

    const updateUI = () => {
        totalBalanceEl.innerHTML = `$${portfolioValue.toLocaleString('tr-TR', {minimumFractionDigits: 2})} <span>Portföy</span>`;
        bankBalanceEl.innerText = `$${bankBalance.toLocaleString('tr-TR', {minimumFractionDigits: 2})}`;
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
        window.addNotification(`Hesaba $${addAmount.toLocaleString()} başarıyla eklendi!`);
    };

    const handleTrade = (type) => {
        const amount = parseFloat(document.getElementById('tradeAmount').value);
        const asset = document.getElementById('assetSelect').value;

        if (!amount || amount <= 0) {
            window.addNotification("Lütfen geçerli bir miktar girin.", "error");
            return;
        }

        if (type === 'Alım') {
            if (amount > bankBalance) {
                window.addNotification("Banka bakiyesi yetersiz!", "error");
                return;
            }
            bankBalance -= amount;
            portfolioValue += amount;
        } else {
            if (amount > portfolioValue) {
                window.addNotification("Portföyde yeterli varlık yok!", "error");
                return;
            }
            portfolioValue -= amount;
            bankBalance += amount;
        }

        const newTrade = {
            asset: asset, type: type,
            amount: `$${amount.toLocaleString()}`,
            price: document.getElementById('displayPrice').innerText,
            date: new Date().toLocaleString('tr-TR')
        };

        transactions.unshift(newTrade);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        localStorage.setItem('portfolio_value', portfolioValue);
        localStorage.setItem('bank_balance', bankBalance);
        
        window.addNotification(`${amount}$ tutarında ${asset} ${type.toLowerCase()} işlemi başarılı!`);
        updateUI();
        document.getElementById('tradeAmount').value = '';
        renderTable();
    };

    const renderTable = () => {
        if(!historyTableBody) return;
        historyTableBody.innerHTML = transactions.map(t => `
            <tr class="animate-row">
                <td>${t.asset}</td>
                <td class="${t.type === 'Alım' ? 'text-success' : 'text-danger'}">${t.type}</td>
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