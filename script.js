document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Interactive Canvas Background (Soft Ambient Light Motion)
    // -------------------------------------------------------------
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(25, Math.floor(width / 50));
    const colors = [
        'rgba(155, 48, 86, 0.05)',   // Deep Berry Pink Tint
        'rgba(253, 242, 248, 0.6)',  // Soft Rose wash
        'rgba(241, 245, 249, 0.7)'   // Gentle Slate wash
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 120 + 40; // larger soft ambient blobs
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.pulseSpeed = Math.random() * 0.003 + 0.001;
            this.pulsePhase = Math.random() * Math.PI;
            this.originalRadius = this.radius;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Soft boundaries check
            if (this.x < -150) this.x = width + 150;
            if (this.x > width + 150) this.x = -150;
            if (this.y < -150) this.y = height + 150;
            if (this.y > height + 150) this.y = -150;

            // Pulsating size animation (liquid motion look)
            this.pulsePhase += this.pulseSpeed;
            this.radius = this.originalRadius + Math.sin(this.pulsePhase) * 20;
        }

        draw() {
            ctx.beginPath();
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            grad.addColorStop(0, this.color);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grad;
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Interactive mouse tracker
    let mouse = { x: null, y: null, targetX: null, targetY: null };
    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    function drawInteractiveLines() {
        if (mouse.x === null) return;
        ctx.beginPath();
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
        grad.addColorStop(0, 'rgba(155, 48, 86, 0.04)');
        grad.addColorStop(0.5, 'rgba(253, 242, 248, 0.02)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.arc(mouse.x, mouse.y, 200, 0, Math.PI * 2);
        ctx.fill();
    }

    function animate() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Smooth mouse coords
        if (mouse.targetX !== null) {
            if (mouse.x === null) {
                mouse.x = mouse.targetX;
                mouse.y = mouse.targetY;
            } else {
                mouse.x += (mouse.targetX - mouse.x) * 0.08;
                mouse.y += (mouse.targetY - mouse.y) * 0.08;
            }
        }

        drawInteractiveLines();

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();

    // -------------------------------------------------------------
    // 2. Navigation Header Effects
    // -------------------------------------------------------------
    const header = document.querySelector('.glass-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // -------------------------------------------------------------
    // 3. Scroll Reveal Animations
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // -------------------------------------------------------------
    // 4. Modal Activation & Project Details
    // -------------------------------------------------------------
    const projectData = {
        '1': {
            title: '5 Loaves and 2 Fishes',
            tag: 'Illustrations • Editing • Book Layout Design',
            desc: 'A wellness-focused devotional project. Designed with illustrations acting as a tool for art therapy, providing readers with a gentle, calming environment for mental rest and emotional recovery. The design aligns visual imagery directly with devotional content for holistic engagement.',
            img: 'assets/five_loaves_two_fishes.jpg',
            client: 'Devotional Series Author',
            impact: 'Devotional Wellness & Graphic Therapy'
        },
        '2': {
            title: 'Becoming a Love Letter',
            tag: 'Book Design • Illustrations • Editing • Self Publishing',
            desc: 'A complete custom self-publishing venture bridging vector illustrations, layouts, page pagination, and poetry. Built to express a cohesive flow where words and custom margins enhance the emotional rhythm of the story.',
            img: 'assets/becoming_love_letter_cover.jpg',
            client: 'Joy Oghenemarie Publications',
            impact: 'Integrated Poetry & Visual Design'
        },
        '3': {
            title: 'Eninla',
            tag: 'Book Consultation • Book Cover Design • Editing • Layout Design',
            desc: 'An inspiring title translating a dramatic narrative path from darkness to light. Focuses on premium cover styling, layout margins, typography, and editing to maximize audience conversion. (Scheduled for publication soon.)',
            img: 'assets/eninla_cover.jpg',
            client: 'Mary Light Victor',
            impact: 'Premium Literary Art Direction'
        }
    };

    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    // Click trigger on Book cards
    document.querySelectorAll('.book-card').forEach(item => {
        item.addEventListener('click', () => {
            const bookId = item.getAttribute('data-book');
            const data = projectData[bookId];
            if (data) {
                modalImg.src = data.img;
                modalTag.textContent = data.tag;
                modalTitle.textContent = data.title;
                modalDesc.textContent = data.desc;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Click trigger on Gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgUrl = item.getAttribute('data-img-src');
            const title = item.getAttribute('data-title');
            const subtitle = item.getAttribute('data-sub');
            
            modalImg.src = imgUrl;
            modalTag.textContent = 'Gallery Item';
            modalTitle.textContent = title;
            modalDesc.textContent = subtitle;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModalFunc = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModalFunc);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModalFunc();
        }
    });

    // -------------------------------------------------------------
    // 5. Design Inspiration Widget Interactive Behavior
    // -------------------------------------------------------------
    const inspoData = {
        'berry': {
            title: 'Berry Pink Comfort',
            tag: 'Becoming a Love Letter Style',
            desc: 'Uses soft pink flowers, cute hearts, and clean serif text. Prompts readers to enter a warm, calming space.',
            img: 'assets/becoming_love_letter_cover.jpg',
            colors: ['#ffffff', '#9B3056', '#fdf2f8', '#f87171']
        },
        'gold': {
            title: 'Earthy Devotional',
            tag: '5 Loaves & 2 Fishes Style',
            desc: 'Warm cream, organic beige, and illustrative pen textures. Highlights wellness, healing, and structured mindfulness layouts.',
            img: 'assets/five_loaves_two_fishes.jpg',
            colors: ['#fefcbf', '#d97706', '#fcf8f2', '#78350f']
        },
        'black': {
            title: 'Bold Contrast',
            tag: 'Eninla Styling',
            desc: 'Dramatic solid blacks, glowing whites, and striking focus points. Represents transformation, courage, and cinematic narrative strength.',
            img: 'assets/eninla_cover.jpg',
            colors: ['#000000', '#ffffff', '#e2e8f0', '#9B3056']
        }
    };

    const inspoButtons = document.querySelectorAll('.inspo-btn');
    const inspoImg = document.getElementById('inspo-img');
    const inspoTag = document.getElementById('inspo-tag');
    const inspoTitle = document.getElementById('inspo-title');
    const inspoDesc = document.getElementById('inspo-desc');
    const paletteDisplay = document.querySelector('.palette-display');

    inspoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            inspoButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const styleType = btn.getAttribute('data-style');
            const data = inspoData[styleType];

            if (data) {
                inspoImg.style.opacity = '0.3';
                setTimeout(() => {
                    inspoImg.src = data.img;
                    inspoTag.textContent = data.tag;
                    inspoTitle.textContent = data.title;
                    inspoDesc.textContent = data.desc;
                    
                    paletteDisplay.innerHTML = '';
                    data.colors.forEach(col => {
                        const swatch = document.createElement('span');
                        swatch.className = 'color-swatch';
                        swatch.style.backgroundColor = col;
                        swatch.title = col;
                        paletteDisplay.appendChild(swatch);
                    });

                    inspoImg.style.opacity = '1';
                }, 200);
            }
        });
    });

    // -------------------------------------------------------------
    // 6. Contact Form Submission Handling
    // -------------------------------------------------------------
    const form = document.getElementById('collaborate-form');
    const successMsg = document.getElementById('success-msg');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        form.style.opacity = '0';
        setTimeout(() => {
            form.style.display = 'none';
            successMsg.style.display = 'flex';
            successMsg.style.opacity = '0';
            setTimeout(() => {
                successMsg.style.transition = 'opacity 0.6s ease';
                successMsg.style.opacity = '1';
            }, 50);
        }, 400);
    });
});
