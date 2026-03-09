const initNavigation = () => {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const panels = {
        'dashboard-content': document.getElementById('dashboard-content'),
        'settings-panel': document.getElementById('settings-panel'),
        'contributors-panel': document.getElementById('contributors-panel')
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('data-target');
            const targetPanel = panels[targetId];

            if (!targetPanel || link.classList.contains('active')) return;

            // 1. Her şeyi temizle ve gizle
            Object.values(panels).forEach(p => {
                if (p) {
                    p.style.display = 'none';
                    p.classList.remove('tab-content');
                }
            });
            navLinks.forEach(l => l.classList.remove('active'));

            // 2. Hedef Paneli Göster (Display ayarını bozmadan)
            // Dashboard ise flex (gap'leri korumak için), değilse block yap
            targetPanel.style.display = (targetId === 'dashboard-content') ? 'grid' : 'block';
            
            // 3. Aktiflik sınıflarını ve animasyonu ekle
            link.classList.add('active');
            void targetPanel.offsetWidth; // Force Reflow
            targetPanel.classList.add('tab-content');

            // 4. Özel Durumlar (Dashboard grafiği)
            if (targetId === 'dashboard-content') {
                setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
            }
        });
    });
};