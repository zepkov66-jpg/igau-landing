// DOM elements
const consultBtn = document.getElementById('consultBtn');
const programsBtn = document.getElementById('programsBtn');
const consultationModal = document.getElementById('consultationModal');
const modalClose = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');
const consultForm = document.getElementById('consultForm');
const successToast = document.getElementById('successToast');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
const currentTime = document.getElementById('currentTime');
const currentDate = document.getElementById('currentDate');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const nextOpening = document.getElementById('nextOpening');

// Initialize date and time
function updateDateTime() {
    const now = new Date();
    
    // Format time
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    currentTime.textContent = `${hours}:${minutes}`;
    
    // Format date
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    currentDate.textContent = now.toLocaleDateString('ru-RU', options);
    
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

// Form submission
function handleFormSubmit(e, formType) {
    e.preventDefault();
    
    // Get form data
    let formData = {};
    if (formType === 'contact') {
        formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            type: 'contact'
        };
    } else if (formType === 'consult') {
        formData = {
            name: document.getElementById('consultName').value,
            phone: document.getElementById('consultPhone').value,
            program: document.getElementById('consultProgram').value,
            type: 'consultation'
        };
    }
    
    // Here you would send the data to your server
    // For now, we'll just log it and show success message
    console.log('Form submitted:', formData);
    
    // Send data to analytics (if configured)
    if (typeof ym !== 'undefined') {
        ym(XXXXXX, 'reachGoal', 'form_submission'); // Replace XXXXXX with your Yandex.Metrica ID
    }
    
    // Send data to Facebook Pixel (if configured)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
    
    // Show success message
    showToast();
    
    // Reset form
    e.target.reset();
    
    // Close modal if it was the consultation form
    if (formType === 'consult') {
        closeModal();
    }
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
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Event listeners
consultBtn.addEventListener('click', openModal);
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

contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contact'));
consultForm.addEventListener('submit', (e) => handleFormSubmit(e, 'consult'));

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = 'white';
        navLinks.style.padding = '2rem';
        navLinks.style.boxShadow = 'var(--shadow-lg)';
        navLinks.style.gap = '1.5rem';
    } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        navLinks.style.display = 'none';
    }
});

// Initialize
updateDateTime();
setInterval(updateDateTime, 60000); // Update every minute

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        navLinks.style.display = 'none';
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
});