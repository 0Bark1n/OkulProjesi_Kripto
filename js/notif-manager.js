function initNotifications() {
    const toastContainer = document.getElementById('toast-container');
    const notifBtn = document.getElementById('notif-btn');
    const notifBadge = document.getElementById('notif-badge');
    const notifPanel = document.getElementById('notif-panel');
    const notifList = document.getElementById('notif-list');
    const clearBtn = document.getElementById('clear-notifs');
    const badge = document.getElementById('notif-badge');

    // Hafızadan bildirimleri çek
    let notifications = JSON.parse(localStorage.getItem('user_notifs')) || [];

    // Paneli ve Badge'i (kırmızı nokta) güncelleme fonksiyonu
    const saveAndRender = () => {
        localStorage.setItem('user_notifs', JSON.stringify(notifications));
        
        if (notifications.length === 0) {
            notifList.innerHTML = '<div class="notif-item" style="opacity: 0.5; text-align: center;">Bildirim bulunmuyor.</div>';
            badge.style.display = 'none';
        } else {
            notifList.innerHTML = notifications.map(n => `<div class="notif-item">${n}</div>`).join('');
            badge.style.display = 'block';
        }
    };
    // --- BİLDİRİM SESİ AYARI ---
    // Projende 'assets' klasörünün içine kısa bir bildirim sesi (notif.mp3) koyman gerekiyor.
    const notifSound = new Audio('assets/notif.mp3');
    notifSound.volume = 0.5; // Ses seviyesi (0.0 ile 1.0 arası)

    const playNotifSound = () => {
        // Ayarlardan sesin durumunu oku
        const isSoundEnabled = localStorage.getItem('notif_enabled');
        
        // Eğer kullanıcı ayarlardan tiki kaldırdıysa (false yaptıysa) hiçbir şey yapma, çık.
        if (isSoundEnabled === 'false') return;

        // Eğer açıksa veya henüz ayar yapılmadıysa (varsayılan açıktır) sesi çal
        notifSound.currentTime = 0; // Sesi başa sar (peş peşe gelirse kesilmesin diye)
        notifSound.play().catch(err => console.log("Tarayıcı otomatik ses çalmayı engelledi:", err));
    };

    // Anlık Bildirim (Toast) ve Geçmişe Ekleme Fonksiyonu
    window.addNotification = (message, type = 'success') => {
        // 1. Toast Mesajı Oluştur (Sağ üstte fırlayan kutu)
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'error' ? 'error' : ''}`;
        toast.innerText = message;
        
        if (toastContainer) {
            playNotifSound();
            toastContainer.appendChild(toast);
            // 3 saniye sonra ekrandan sil
            setTimeout(() => {
                toast.style.animation = 'fadeOut 0.5s forwards';
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        }

        // 2. Geçmişe Ekle
        const now = new Date();
        const time = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        notifications.unshift(`[${time}] ${message}`);

        // Son 10 bildirimi tut, fazlasını sil
        if (notifications.length > 10) {
            notifications.pop();
        }

        saveAndRender();
    };

    // Çan ikonuna basınca paneli aç/kapat
    notifBtn.onclick = (e) => {
        e.stopPropagation();
        notifPanel.classList.toggle('active');
        notifBadge.style.display = 'none';
        notifBadge.innerText = '';
    };

    // Panel açıkken dışarıya tıklandığında paneli kapat
    document.addEventListener('click', (e) => {
        if (!notifPanel.contains(e.target) && e.target !== notifBtn) {
            notifPanel.classList.remove('active');
        }
    });

    // Temizle butonu fonksiyonu
    clearBtn.onclick = (e) => {
        e.stopPropagation();
        notifications = [];
        saveAndRender();
    };

    // Sayfa açıldığında ilk yüklemeyi yap
    saveAndRender();
}