
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

            // Калькулятор услуг
            const membershipSelect = document.getElementById('membershipType');
            const durationSelect = document.getElementById('duration');
            const personalCheck = document.getElementById('personal');
            const massageCheck = document.getElementById('massage');
            const poolCheck = document.getElementById('pool');
            const spaCheck = document.getElementById('spa');
            const calculateBtn = document.getElementById('calculateBtn');
            const resetBtn = document.getElementById('resetBtn');
            const priceBreakdown = document.getElementById('priceBreakdown');
            const totalAmountSpan = document.getElementById('totalAmount');
            const resultNote = document.getElementById('resultNote');

            // Базовая стоимость по типу абонемента (в месяц)
            const basePrices = {
                'unlimited': 5900,
                'daytime': 4500,
                'morning': 3900,
                'evening': 4200,
                'weekend': 3200
            };

            // Стоимость дополнительных услуг
            const extraPrices = {
                'personal': 3500,
                'massage': 4800,
                'pool': 2000,
                'spa': 2500
            };

            // Названия для отображения
            const typeNames = {
                'unlimited': 'Безлимит',
                'daytime': 'Оптимальный',
                'morning': 'Утро',
                'evening': 'Вечер',
                'weekend': 'Выходные'
            };

            const extraNames = {
                'personal': 'Персональный тренинг',
                'massage': 'Массаж',
                'pool': 'Бассейн',
                'spa': 'SPA-комплекс'
            };

            // Скидки за длительный срок
            const durationDiscounts = {
                '1': 0,
                '3': 5,
                '6': 10,
                '12': 15
            };

            function calculatePrice() {
                const membership = membershipSelect.value;
                const duration = parseInt(durationSelect.value);
                
                let monthlyBase = basePrices[membership] || 5900;
                
                let monthlyExtras = 0;
                if (personalCheck.checked) monthlyExtras += extraPrices.personal;
                if (massageCheck.checked) monthlyExtras += extraPrices.massage;
                if (poolCheck.checked) monthlyExtras += extraPrices.pool;
                if (spaCheck.checked) monthlyExtras += extraPrices.spa;
                
                let monthlyTotal = monthlyBase + monthlyExtras;
                
                let totalWithoutDiscount = monthlyTotal * duration;
                
                const discountPercent = durationDiscounts[duration.toString()] || 0;
                const discountAmount = totalWithoutDiscount * (discountPercent / 100);
                const totalWithDiscount = totalWithoutDiscount - discountAmount;
                
                let breakdownHTML = `
                    <div class="price-item">
                        <span class="label">Тариф "${typeNames[membership]}"</span>
                        <span class="value">${monthlyBase.toLocaleString()} ₽/мес</span>
                    </div>
                `;
                
                if (personalCheck.checked) {
                    breakdownHTML += `
                        <div class="price-item">
                            <span class="label">+ ${extraNames.personal}</span>
                            <span class="value">+${extraPrices.personal.toLocaleString()} ₽/мес</span>
                        </div>
                    `;
                }
                
                if (massageCheck.checked) {
                    breakdownHTML += `
                        <div class="price-item">
                            <span class="label">+ ${extraNames.massage}</span>
                            <span class="value">+${extraPrices.massage.toLocaleString()} ₽/мес</span>
                        </div>
                    `;
                }
                
                if (poolCheck.checked) {
                    breakdownHTML += `
                        <div class="price-item">
                            <span class="label">+ ${extraNames.pool}</span>
                            <span class="value">+${extraPrices.pool.toLocaleString()} ₽/мес</span>
                        </div>
                    `;
                }
                
                if (spaCheck.checked) {
                    breakdownHTML += `
                        <div class="price-item">
                            <span class="label">+ ${extraNames.spa}</span>
                            <span class="value">+${extraPrices.spa.toLocaleString()} ₽/мес</span>
                        </div>
                    `;
                }
                
                breakdownHTML += `
                    <div class="price-item">
                        <span class="label">Итого в месяц</span>
                        <span class="value">${monthlyTotal.toLocaleString()} ₽</span>
                    </div>
                    <div class="price-item">
                        <span class="label">Срок</span>
                        <span class="value">${duration} мес.</span>
                    </div>
                `;
                
                if (discountPercent > 0) {
                    breakdownHTML += `
                        <div class="price-item">
                            <span class="label">Скидка за срок ${discountPercent}%</span>
                            <span class="value">-${discountAmount.toLocaleString()} ₽</span>
                        </div>
                    `;
                }
                
                priceBreakdown.innerHTML = breakdownHTML;
                totalAmountSpan.textContent = Math.round(totalWithDiscount).toLocaleString() + ' ₽';
                
                if (discountPercent > 0) {
                    resultNote.innerHTML = `* Экономия ${discountAmount.toLocaleString()} ₽ при оплате за ${duration} месяцев`;
                } else {
                    resultNote.innerHTML = '* Цены указаны со скидкой при оплате всего срока';
                }
            }

            function resetCalculator() {
                membershipSelect.value = 'unlimited';
                durationSelect.value = '3';
                personalCheck.checked = false;
                massageCheck.checked = false;
                poolCheck.checked = true;
                spaCheck.checked = false;
                calculatePrice();
            }

            calculateBtn.addEventListener('click', calculatePrice);
            resetBtn.addEventListener('click', function(e) {
                e.preventDefault();
                resetCalculator();
            });

            [membershipSelect, durationSelect, personalCheck, massageCheck, poolCheck, spaCheck].forEach(el => {
                el.addEventListener('change', calculatePrice);
            });

            calculatePrice();
        });
