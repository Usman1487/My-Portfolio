
// ─── Cursor ───────────────────────────────────────────────
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .project-row, .service-card, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});


// ─── Loader ───────────────────────────────────────────────
const loader = document.getElementById('loader');
const loaderNum = document.getElementById('loader-num');
const loaderName = document.querySelector('.loader-name');
const loaderLines = document.querySelectorAll('.loader-line');

let count = 0;
const interval = setInterval(() => {
    count += Math.floor(Math.random() * 12) + 3;
    if (count >= 100) {
        count = 100;
        clearInterval(interval);
        setTimeout(hideLoader, 300);
    }
    loaderNum.textContent = count;
}, 60);

setTimeout(() => {
    loaderLines.forEach(l => l.classList.add('grow'));
    loaderName.classList.add('show');
}, 200);

function hideLoader() {
    loader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    loader.style.opacity = '0';
    loader.style.transform = 'translateY(-100%)';
    setTimeout(() => {
        loader.style.display = 'none';
        revealHero();
    }, 700);
}

function revealHero() {
    document.querySelector('.hero-eyebrow').classList.add('visible');
    setTimeout(() => document.querySelector('.hero-title').classList.add('visible'), 200);
    setTimeout(() => document.querySelector('.hero-sub').classList.add('visible'), 400);
    setTimeout(() => document.querySelector('.hero-actions').classList.add('visible'), 600);
    setTimeout(() => document.querySelector('.hero-scroll-indicator').classList.add('visible'), 800);
    setTimeout(() => {
        const stats = document.querySelector('.hero-stats');
        if (stats) stats.classList.add('visible');
    }, 800);
}


// ─── Nav scroll effect ────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});


// ─── Mobile menu ─────────────────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const spans = burger.querySelectorAll('span');
    if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.transform = '';
    }
});

mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        const spans = burger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.transform = '';
    });
});


// ─── Scroll reveal ────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

reveals.forEach(el => observer.observe(el));


// ─── GSAP ScrollTrigger animations ───────────────────────
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Section headers
    gsap.utils.toArray('.section-header').forEach(el => {
        gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });

    // About image parallax
    gsap.to('.about-image-frame img', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
        }
    });

    // Project rows stagger
    gsap.utils.toArray('.project-row').forEach((row, i) => {
        gsap.from(row, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 85%' }
        });
    });

    // Service cards stagger
    gsap.from('.service-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.services-grid', start: 'top 80%' }
    });

    // Testimonials
    gsap.from('.testimonial-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%' }
    });

    // Footer headline
    gsap.from('.footer-headline', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-cta-block', start: 'top 80%' }
    });

    // Stat numbers count up
    const statNums = document.querySelectorAll('.stat-num');
    statNums.forEach(stat => {
        const text = stat.textContent;
        const num = parseInt(text);
        const suffix = text.replace(num, '');
        stat.textContent = '0' + suffix;

        ScrollTrigger.create({
            trigger: '#hero',
            start: 'top top',
            onEnter: () => {
                gsap.to({ val: 0 }, {
                    val: num,
                    duration: 2,
                    ease: 'power2.out',
                    delay: 1.5,
                    onUpdate: function () {
                        stat.textContent = Math.ceil(this.targets()[0].val) + suffix;
                    }
                });
            },
            once: true
        });
    });
}
