/**
 * Navigation Manager - KriptoProje
 * Menü geçişlerini yönetir ve yerleşim (layout) buglarını önler.
 */

const initNavigation = () => {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const panels = {
        'dashboard-content': document.getElementById('dashboard-content'),
        'settings-panel': document.getElementById('settings-panel'),
        'contributors-panel': document.getElementById('contributors-panel')
    };

    if (!navLinks.length) return;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('data-target');
            const targetPanel = panels[targetId];

            // Eğer panel bulunamadıysa veya zaten aktifse işlem yapma
            if (!targetPanel || link.classList.contains('active')) return;

            // 1. Tüm panelleri gizle ve aktif sınıfları temizle
            Object.values(panels).forEach(panel => {
                if (panel) {
                    panel.style.display = 'none';
                    panel.classList.remove('tab-content');
                }
            });

            navLinks.forEach(l => l.classList.remove('active'));

            // 2. HEDEF PANELİ AÇ (LAYOUT BUG FIX)
            // Dashboard ise 'grid' (yan yana düzen için), diğerleri 'block' olarak açılır
            if (targetId === 'dashboard-content') {
                // Ekran genişliğine göre (Masaüstü/Mobil) grid veya block ayarı
                const isMobile = window.innerWidth <= 992;
                targetPanel.style.display = isMobile ? 'block' : 'grid';
            } else {
                targetPanel.style.display = 'block';
            }

            // 3. Aktiflik sınıflarını ve animasyonu tetikle
            link.classList.add('active');
            
            // Reflow tetikleyerek animasyonun (fadeIn) çalışmasını sağla
            void targetPanel.offsetWidth; 
            targetPanel.classList.add('tab-content');

            // 4. ÖZEL DURUMLAR: Dashboard grafiğini tazele
            if (targetId === 'dashboard-content') {
                // Panel açıldıktan kısa süre sonra grafiği yeniden boyutlandır
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                    console.log("Dashboard grafiği optimize edildi.");
                }, 100);
            }
            
            // Sayfayı en yukarı taşı (Mobil kullanıcı deneyimi için)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
};