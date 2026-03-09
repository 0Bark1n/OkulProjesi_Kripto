/**
 * Navigation Manager - KriptoProje
 * Menü geçişlerini yönetir ve yerleşim (layout) buglarını önler.
 */

const initNavigation = () => {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    // 1. BURAYA YENİ PANELİ EKLİYORUZ
    const panels = {
        'dashboard-content': document.getElementById('dashboard-content'),
        'history-panel': document.getElementById('history-panel'), // YENİ PANEL
        'assets-panel': document.getElementById('assets-panel'), // BURA EKLENDİ
        'settings-panel': document.getElementById('settings-panel'),
        'contributors-panel': document.getElementById('contributors-panel')
    };

    if (!navLinks.length) return;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('data-target');
            const targetPanel = panels[targetId];

            if (!targetPanel || link.classList.contains('active')) return;

            // Panelleri gizle
            Object.values(panels).forEach(panel => {
                if (panel) {
                    panel.style.display = 'none';
                    panel.classList.remove('tab-content');
                }
            });

            navLinks.forEach(l => l.classList.remove('active'));

            // HEDEF PANELİ AÇ
            if (targetId === 'dashboard-content') {
                const isMobile = window.innerWidth <= 992;
                targetPanel.style.display = isMobile ? 'block' : 'grid';
            } else {
                targetPanel.style.display = 'block';
            }

            link.classList.add('active');
            void targetPanel.offsetWidth; 
            targetPanel.classList.add('tab-content');

            // 2. BURAYA DA 'assets-panel' İÇİN GRAFİK YENİLEME EKLİYORUZ
            if (targetId === 'dashboard-content' || targetId === 'assets-panel') {
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 100); // Gizli sekmeden çıkan ApexCharts grafiklerinin bozuk çizilmesini önler
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
};