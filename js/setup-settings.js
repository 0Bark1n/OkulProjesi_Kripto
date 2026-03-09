const setupSettings = () => {
    // Seçiciler
    const notifCheck = document.querySelector('.setting-item input[type="checkbox"]');
    const intervalInput = document.querySelector('.intbox');
    const resetBtn = document.getElementById('btn-reset-data');

    // 1. HAFIZADAN YÜKLE (Initial Setup)
    const loadSettings = () => {
        // Bildirim Ayarı
        const savedNotif = localStorage.getItem('notif_enabled');
        if (notifCheck && savedNotif !== null) {
            notifCheck.checked = (savedNotif === 'true');
        }

        // Güncelleme Hızı (Zaten chart-manager'da var ama garantileyelim)
        const savedSpeed = localStorage.getItem('update_speed');
        if (intervalInput && savedSpeed) {
            intervalInput.value = savedSpeed;
        }
    };

    // 2. OLAY DİNLEYİCİLERİ (Event Listeners)
    
    // Bildirim Checkbox Değişimi
    if (notifCheck) {
        notifCheck.addEventListener('change', (e) => {
            const status = e.target.checked;
            localStorage.setItem('notif_enabled', status);
            const msg = status ? "Bildirimler açıldı" : "Bildirimler kapatıldı";
            if(window.addNotification) window.addNotification(msg);
        });
    }

    // Güncelleme Hızı Değişimi
    if (intervalInput) {
        intervalInput.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            if (val > 0) {
                // Global chart fonksiyonunu tetikle
                if (window.setUpdateInterval) {
                    window.setUpdateInterval(val);
                }
            }
        });
    }

    // Sıfırlama Butonu
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const check = confirm("Tüm verileriniz ve ayarlarınız silinecek. Emin misiniz?");
            if (check) {
                localStorage.clear();
                if(window.addNotification) window.addNotification("Veriler sıfırlandı!", "error");
                setTimeout(() => window.location.reload(), 500);
            }
        });
    }

    // Başlat
    loadSettings();
};