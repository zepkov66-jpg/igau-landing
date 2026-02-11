// DOM elements
const consultBtn = document.getElementById('consultBtn');
const mainCtaBtn = document.getElementById('mainCtaBtn');
const programsBtn = document.getElementById('programsBtn');
const consultationModal = document.getElementById('consultationModal');
const modalClose = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');
const consultForm = document.getElementById('consultForm');
const successToast = document.getElementById('successToast');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
const currentTimeElement = document.getElementById('currentTime');
const currentDateElement = document.getElementById('currentDate');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const nextOpening = document.getElementById('nextOpening');
const backToTopButton = document.querySelector('.back-to-top');
const scrollProgress = document.querySelector('.scroll-progress');

// Initialize date and time
function updateDateTime() {
    const now = new Date();
    
    // Format time
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}`;
    
    // Format date
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('ru-RU', options);
    
    // Update status
    updateStatus(now);
    
    // Update next opening
    updateNextOpening(now);
}

function updateStatus(now) {
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Check if it's working hours (Mon-Fri 9:00-18:00)
    const isWeekday = day >= 1 && day <= 5;
    const isWorkingHours = (hour > 9 || (hour === 9 && minute >= 0)) && hour < 18;
    
    if (isWeekday && isWorkingHours) {
        statusDot.style.backgroundColor = '#0e9f6e';
        statusText.textContent = 'Сейчас открыто';
    } else {
        statusDot.style.backgroundColor = '#f05252';
        statusText.textContent = 'Сейчас закрыто';
    }
}

function updateNextOpening(now) {
    const day = now.getDay();
    const hour = now.getHours();
    
    let nextDay, nextTime;
    
    if (day === 0 || day === 6) {
        // Weekend, next opening is Monday 9:00
        const daysUntilMonday = day === 0 ? 1 : 6;
        nextDay = 'Понедельник';
        nextTime = '09:00';
    } else if (hour < 9) {
        // Before opening today
        nextDay = getDayName(day);
        nextTime = '09:00';
    } else if (hour >= 18) {
        // After closing today
        if (day === 5) {
            // Friday evening, next opening is Monday
            nextDay = 'Понедельник';
            nextTime = '09:00';
        } else {
            nextDay = getDayName(day + 1);
            nextTime = '09:00';
        }
    } else {
        // Currently open
        nextDay = 'Сегодня';
        nextTime = '18:00 (закрытие)';
    }
    
    nextOpening.textContent = `${nextDay}, ${nextTime}`;
}

function getDayName(dayIndex) {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[dayIndex];
}

// Modal functions
function openModal() {
    consultationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    consultationModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showToast() {
    successToast.classList.add('active');
    
    setTimeout(() => {
        successToast.classList.remove('active');
    }, 5000);
}

// Form submission via mailto
function handleFormSubmit(e, formType) {
    e.preventDefault();
    
    // Get form data
    const form = e.target;
    let emailBody = '';
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.name && input.value && input.type !== 'hidden') {
            let fieldName = '';
            
            // Convert field name to readable format
            switch(input.name) {
                case 'name':
                    fieldName = 'Имя';
                    break;
                case 'phone':
                    fieldName = 'Телефон';
                    break;
                case 'email':
                    fieldName = 'Email';
                    break;
                case 'message':
                    fieldName = 'Сообщение';
                    break;
                case 'program':
                    fieldName = 'Программа обучения';
                    break;
                default:
                    fieldName = input.name;
            }
            
            emailBody += `${fieldName}: ${input.value}\n`;
        }
    });
    
    // Add request type and date
    const requestType = formType === 'consult' ? 'Запись на консультацию' : 'Вопрос с сайта';
    emailBody += `\nТип заявки: ${requestType}`;
    emailBody += `\nДата отправки: ${new Date().toLocaleString('ru-RU')}`;
    
    // Get subject
    const subjectInput = form.querySelector('input[name="_subject"]');
    const subject = subjectInput ? subjectInput.value : 'Заявка с сайта ИГАУ';
    
    // Encode for URL
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(emailBody);
    
    // Create mailto link
    const mailtoLink = `mailto:cepkova64@mail.ru?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showSuccessMessage(requestType);
    
    // Reset form after 1 second
    setTimeout(() => {
        form.reset();
        
        // Close modal if it's consultation form
        if (formType === 'consult') {
            closeModal();
        }
    }, 1000);
    
    // Log for debugging
    console.log('Заявка отправлена:', {
        type: requestType,
        subject: subject,
        email: 'cepkova64@mail.ru'
    });
    
    // Track in analytics if set up
    if (typeof ym !== 'undefined') {
        ym(XXXXXX, 'reachGoal', 'form_submission', { form_type: formType });
    }
}

// Updated success message function
function showSuccessMessage(requestType) {
    const toastTitle = successToast.querySelector('.toast-text h4');
    const toastMessage = successToast.querySelector('.toast-text p');
    
    toastTitle.textContent = 'Заявка отправлена!';
    toastMessage.textContent = `Мы свяжемся с вами в течение рабочего дня. Вы также можете связаться с нами по телефону 8 (914) 840-20-20 или в Telegram.`;
    
    successToast.classList.add('active');
    
    setTimeout(() => {
        successToast.classList.remove('active');
    }, 7000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Track active section for navigation highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinksElements = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinksElements.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Enhance buttons with interactive effects
function enhanceButtons() {
    // Remove pulse animation on hover
    consultBtn.addEventListener('mouseenter', () => {
        consultBtn.classList.remove('pulse-button');
    });
    
    // Add click effects to all buttons
    document.querySelectorAll('.btn, .cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            // Remove ripple element after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Track button click
            trackButtonClick(this.textContent.trim() || 'Кнопка');
        });
    });
    
    // Add hover effects for cards
    document.querySelectorAll('.advantage, .contact-card, .schedule-card, .floating-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Track button clicks for analytics
function trackButtonClick(buttonName) {
    console.log(`Клик по кнопке: ${buttonName}`);
    
    // Send to Yandex.Metrica if available
    if (typeof ym !== 'undefined') {
        ym(XXXXXX, 'reachGoal', 'button_click', { button_name: buttonName });
    }
    
    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'button',
            'event_label': buttonName
        });
    }
}

// Initialize scroll progress indicator
function initScrollProgress() {
    window.addEventListener('scroll', () => {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - winHeight;
        const scrolled = (window.scrollY / docHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

// Initialize back to top button
function initBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Event listeners
consultBtn.addEventListener('click', openModal);
mainCtaBtn.addEventListener('click', openModal);
programsBtn.addEventListener('click', () => {
    window.scrollTo({
        top: document.getElementById('about').offsetTop - 80,
        behavior: 'smooth'
    });
});

modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside
consultationModal.addEventListener('click', (e) => {
    if (e.target === consultationModal) {
        closeModal();
    }
});

// Form submit handlers
contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contact'));
consultForm.addEventListener('submit', (e) => handleFormSubmit(e, 'consult'));

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = 'var(--shadow-lg)';
    } else {
        header.style.boxShadow = 'var(--shadow)';
    }
    
    // Update active nav link
    updateActiveNavLink();
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date and time
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
    
    // Initialize interactive features
    enhanceButtons();
    initScrollProgress();
    initBackToTop();
    updateActiveNavLink();
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
