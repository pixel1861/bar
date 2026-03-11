
        document.addEventListener('DOMContentLoaded', function() {
            // Переключение темы
            const themeToggle = document.getElementById('themeToggle');
            const body = document.body;

            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                body.classList.add('dark-theme');
                themeToggle.textContent = '☀️';
            } else {
                themeToggle.textContent = '🌙';
            }

            themeToggle.addEventListener('click', () => {
                body.classList.toggle('dark-theme');
                const isDark = body.classList.contains('dark-theme');
                themeToggle.textContent = isDark ? '☀️' : '🌙';
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });

            // Гамбургер меню
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            const navLinks = document.querySelectorAll('.nav-link');

            if (hamburger) {
                hamburger.addEventListener('click', function(e) {
                    e.stopPropagation();
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });
            }

            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (navMenu.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                });
            });

            document.addEventListener('click', (e) => {
                if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target) && navMenu?.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });

            // Обратный таймер до 1 апреля 2026 года
            const targetDate = new Date(2026, 3, 1, 0, 0, 0); // 1 апреля 2026, 00:00

            function updateTimer() {
                const now = new Date();
                const diff = targetDate - now;

                if (diff <= 0) {
                    document.getElementById('days').textContent = '0';
                    document.getElementById('hours').textContent = '0';
                    document.getElementById('minutes').textContent = '0';
                    document.getElementById('seconds').textContent = '0';
                    return;
                }

                const totalSeconds = Math.floor(diff / 1000);
                const days = Math.floor(totalSeconds / 86400);
                const hours = Math.floor((totalSeconds % 86400) / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                document.getElementById('days').textContent = days;
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            }

            updateTimer();
            setInterval(updateTimer, 1000);

            // Модальное окно для экскурсии
            const openTourModal = document.getElementById('openTourModal');
            const tourModal = document.getElementById('tourModal');
            const closeTourModal = document.getElementById('closeTourModal');

            openTourModal.addEventListener('click', function() {
                tourModal.classList.add('active');
                body.style.overflow = 'hidden';
            });

            closeTourModal.addEventListener('click', function() {
                tourModal.classList.remove('active');
                body.style.overflow = '';
            });

            tourModal.addEventListener('click', function(e) {
                if (e.target === tourModal) {
                    tourModal.classList.remove('active');
                    body.style.overflow = '';
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && tourModal.classList.contains('active')) {
                    tourModal.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        });