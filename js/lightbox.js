function initLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    const wrapper = document.getElementById('lightbox-wrapper');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxText = document.getElementById('lightbox-text');
    const closeBtn = document.querySelector('.lightbox-close');
    const logos = document.querySelectorAll('.contributor-card .user-logo');

    let currentThumbnail = null;

    // Güvenlik: Eğer resimler veya lightbox yoksa kodu durdur, hata verdirtme
    if (!lightbox || logos.length === 0) return; 

    logos.forEach(logo => {
        logo.addEventListener('click', () => {
            currentThumbnail = logo;

            // İsim ve Öğrenci Numarasını bul
            const card = logo.closest('.contributor-card');
            const name = card ? card.querySelector('h4').innerText : 'Geliştirici';
            const studentId = card ? card.querySelector('span').innerText : ''; // ID'yi çektik

            // 1. Tıklanan resmin TAM koordinatlarını al
            const rect = logo.getBoundingClientRect();

            // 2. Lightbox'ı görünmez şekilde o resmin üstüne oturt
            wrapper.style.transition = 'none'; // Zıplama olmasın diye animasyonu anlık kapat
            wrapper.style.top = `${rect.top}px`;
            wrapper.style.left = `${rect.left}px`;
            wrapper.style.width = `${rect.width}px`;
            wrapper.style.height = `${rect.height}px`;
            wrapper.style.transform = 'translate(0, 0)'; 
                    
            lightboxImg.src = logo.src;
            
            // YENİ: innerText yerine innerHTML kullanıp iki satır yapıyoruz ve ID'ye class veriyoruz
            lightboxText.innerHTML = `${name}<br><span class="lightbox-id">${studentId}</span>`;
            
            lightbox.style.display = 'block';

            // 3. Tarayıcıya zorla çizdirip animasyonu başlat
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    wrapper.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.3, 1.1)';
                    lightbox.classList.add('active-bg');
                    lightbox.classList.add('expanded');
                });
            });
        });
    });

    // Kapatma Fonksiyonu (Resmi Kendi Yuvasına Geri Gönderir)
    const closeLightbox = () => {
        if (!currentThumbnail) return;
                
        // Aşağı inmiş olabiliriz, yeni koordinatları al
        const rect = currentThumbnail.getBoundingClientRect();
                
        wrapper.style.top = `${rect.top}px`;
        wrapper.style.left = `${rect.left}px`;
        wrapper.style.width = `${rect.width}px`;
        wrapper.style.height = `${rect.height}px`;
        wrapper.style.transform = 'translate(0, 0)';

        lightbox.classList.remove('expanded');
        lightbox.classList.remove('active-bg');

        setTimeout(() => {
            lightbox.style.display = 'none';
            currentThumbnail = null;
        }, 500); 
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}