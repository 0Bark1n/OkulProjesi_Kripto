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

    if (!allNavLinks.length) return;

    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('data-target');
            const targetPanel = panels[targetId];

            if (!targetPanel) return;

            // 1. TÜM PANELLERİ GİZLE
            Object.values(panels).forEach(panel => {
                if (panel) {
                    panel.style.display = 'none';
                    panel.classList.remove('tab-content');
                }
            });

            // 2. TÜM LİNKLERDEN 'ACTIVE' SINIFINI SİL
            // (Hem yan menüden hem footer'dan siler)
            allNavLinks.forEach(l => l.classList.remove('active'));

            // 3. SEÇİLEN PANELİ GÖSTER
            if (targetId === 'dashboard-content') {
                const isMobile = window.innerWidth <= 992;
                targetPanel.style.display = isMobile ? 'block' : 'grid';
            } else {
                targetPanel.style.display = 'block';
            }

            // 4. AYNI HEDEFE SAHİP TÜM LİNKLERİ AKTİF YAP
            // (Örn: Footer'dan Dashboard'a basarsan, yan menüdeki Dashboard da mor olur)
            document.querySelectorAll(`a[data-target="${targetId}"]`).forEach(l => {
                l.classList.add('active');
            });

            // Animasyonu tetikle ve yukarı kaydır
            void targetPanel.offsetWidth; 
            targetPanel.classList.add('tab-content');
            
            if (targetId === 'dashboard-content' || targetId === 'assets-panel') {
                setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
};