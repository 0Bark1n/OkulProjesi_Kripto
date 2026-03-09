function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    };

    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    setTheme(savedTheme || systemTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
}