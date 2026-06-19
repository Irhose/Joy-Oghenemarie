document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Interactive Canvas Background (2D Motion Graphics Physics)
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
    const particleCount = Math.min(40, Math.floor(width / 30));
    const colors = [
        'rgba(0, 240, 255, 0.25)', // Neon Cyan
        'rgba(37, 99, 235, 0.15)',  // Electric Blue
        'rgba(255, 41, 133, 0.12)'  // Accent Pink (sparingly)
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 80 + 20; // larger soft ambient blobs
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.pulseSpeed = Math.random() * 0.005 + 0.002;
            this.pulsePhase = Math.random() * Math.PI;
            this.originalRadius = this.radius;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Soft boundaries check
            if (this.x < -100) this.x = width + 100;
            if (this.x > width + 100) this.x = -100;
            if (this.y < -100) this.y = height + 100;
            if (this.y > height + 100) this.y = -100;

            // Pulsating size animation (liquid motion look)
            this.pulsePhase += this.pulseSpeed;
            this.radius = this.originalRadius + Math.sin(this.pulsePhase) * 15;
        }

        draw() {
            ctx.beginPath();
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            grad.addColorStop(0, this.color);
            grad.addColorStop(1, 'rgba(5, 7, 15, 0)');
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
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
        grad.addColorStop(0.5, 'rgba(255, 41, 133, 0.03)');
        grad.addColorStop(1, 'rgba(5, 7, 15, 0)');
        ctx.fillStyle = grad;
        ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
        ctx.fill();
    }

    function animate() {
        ctx.fillStyle = '#05070f';
        ctx.fillRect(0, 0, width, height);

        // Smooth mouse coords
        if (mouse.targetX !== null) {
            mouse.x += (mouse.targetX - mouse.x) * 0.08;
            mouse.y += (mouse.targetY - mouse.y) * 0.08;
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
    // 4. Portfolio Showcase Modals
    // -------------------------------------------------------------
    const projectData = {
        '1': {
            title: 'Fluid Dynamics',
            tag: 'Liquid Motion',
            desc: 'This project showcases complex custom vector liquid simulation frame-by-frame. Combining organic shapes, morphing elements, and rhythmic physics, this style is ideal for fresh brand statements, loading animations, and dynamic transition elements in promotional videos.',
            img: 'assets/project1.png',
            client: 'Creative Labs Inc.',
            software: 'Adobe After Effects, Illustrator'
        },
        '2': {
            title: 'Rhythm & Type',
            tag: 'Kinetic Typography',
            desc: 'Kinetic typography design exploring letters as physical 3D and 2D components. Characters morph, scale, and bend in lockstep with a custom musical score, illustrating how written text can evoke human emotion and pacing on screen.',
            img: 'assets/project2.png',
            client: 'Vocal Poets Society',
            software: 'After Effects, Premiere Pro, Figma'
        },
        '3': {
            title: 'Stellar Wanderer',
            tag: 'Character Design & Narrative',
            desc: 'A story-driven animated short detailing a traveler exploring neon space ruins. This piece demonstrates character asset rigging, atmospheric vector coloring, parallax backgrounds, and subtle lighting physics to deliver a sci-fi emotional narrative.',
            img: 'assets/project3.png',
            client: 'Cosmic Indie Film Fest',
            software: 'Toon Boom Harmony, After Effects, Photoshop'
        }
    };

    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const projId = item.getAttribute('data-project');
            const data = projectData[projId];
            if (data) {
                modalImg.src = data.img;
                modalTag.textContent = data.tag;
                modalTitle.textContent = data.title;
                modalDesc.textContent = data.desc;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // prevent page scroll
            }
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

    // Close modal on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModalFunc();
        }
    });

    // -------------------------------------------------------------
    // 5. Design Inspiration Widget Interactive Behavior
    // -------------------------------------------------------------
    const inspoData = {
        'liquid': {
            title: 'Liquid Energy',
            tag: 'Liquid Motion Styles',
            desc: 'Perfect for dynamic, energetic branding. Employs fluid simulations, elastic organic transitions, and high-contrast hues to feel alive and fresh.',
            img: 'assets/inspo.png',
            colors: ['#0b0d19', '#00f0ff', '#3b82f6', '#ff2a85']
        },
        'geometric': {
            title: 'Geometric Grid',
            tag: 'Kinetic Typography & Geometry',
            desc: 'Clean, structured, and mathematical. Uses exact alignment, sharp vector loops, rotating coordinates, and grid layouts for tech and corporate presentations.',
            img: 'assets/project2.png',
            colors: ['#05070f', '#00e5ff', '#1d243d', '#ff2985']
        },
        'cosmic': {
            title: 'Cosmic Narrative',
            tag: 'Character & Moodboards',
            desc: 'Dreamy visual storytelling styling. Features stylized characters, galactic glowing spheres, deep rich space backdrops, and low-contrast details.',
            img: 'assets/project3.png',
            colors: ['#090a14', '#0099ff', '#1a337a', '#ff4d94']
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
            // Update active state
            inspoButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const styleType = btn.getAttribute('data-style');
            const data = inspoData[styleType];

            if (data) {
                // Fade out image, swap source, fade back in
                inspoImg.style.opacity = '0.3';
                setTimeout(() => {
                    inspoImg.src = data.img;
                    inspoTag.textContent = data.tag;
                    inspoTitle.textContent = data.title;
                    inspoDesc.textContent = data.desc;
                    
                    // Render color palette swatches
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
        
        // Simple micro-animation transition
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
