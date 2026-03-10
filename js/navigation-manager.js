/**
 * Navigation Manager - KriptoProje
 * Menü geçişlerini yönetir ve yerleşim (layout) buglarını önler.
 */

const initNavigation = () => {
    // Sitenin neresinde olursa olsun data-target niteliği olan tüm linkleri seç
    const allNavLinks = document.querySelectorAll('a[data-target]');
    
    const panels = {
        'dashboard-content': document.getElementById('dashboard-content'),
        'assets-panel': document.getElementById('assets-panel'),
        'history-panel': document.getElementById('history-panel'),
        'settings-panel': document.getElementById('settings-panel'),
        'contributors-panel': document.getElementById('contributors-panel')
    };

    // --- 1. AKORDEON MENÜ YÖNETİCİSİ (Hatalar Giderildi) ---
    const menuGroups = document.querySelectorAll('.menu-group');
    const menuToggles = document.querySelectorAll('.menu-toggle');

    if (menuToggles.length > 0) {
        menuToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault(); // Butonun varsayılan davranışını iptal et
                
                const parentGroup = toggle.closest('.menu-group');
                if (!parentGroup) return;

                const isOpen = parentGroup.classList.contains('open');
                
                // Önce bütün menüleri kapat
                menuGroups.forEach(group => group.classList.remove('open'));
                
                // Eğer tıkladığımız menü kapalıysa, şimdi aç
                if (!isOpen) {
                    parentGroup.classList.add('open');
                }
            });
        });
    }

    if (!allNavLinks.length) return;

    // --- 2. SAYFA (PANEL) GEÇİŞ YÖNETİCİSİ ---
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('data-target');
            const targetPanel = panels[targetId];

            if (!targetPanel) return;

            // Panelleri Gizle
            Object.values(panels).forEach(panel => {
                if (panel) {
                    panel.style.display = 'none';
                    panel.classList.remove('tab-content');
                }
            });

            // Aktif Sınıfını Sil
            allNavLinks.forEach(l => l.classList.remove('active'));

            // Seçilen Paneli Göster
            if (targetId === 'dashboard-content') {
                const isMobile = window.innerWidth <= 992;
                targetPanel.style.display = isMobile ? 'block' : 'grid';
            } else {
                targetPanel.style.display = 'block';
            }

            // Aktif Sınıfını Ekle
            document.querySelectorAll(`a[data-target="${targetId}"]`).forEach(l => {
                l.classList.add('active');
            });

            // Animasyon ve Scroll
            void targetPanel.offsetWidth; 
            targetPanel.classList.add('tab-content');
            
            if (targetId === 'dashboard-content' || targetId === 'assets-panel') {
                setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
};