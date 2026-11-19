document.getElementById('copyright-year').textContent = new Date().getFullYear();

class ParticleAnimation {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = navigator.hardwareConcurrency < 4 ? 20 : window.innerWidth < 768 ? 40 : 75;
        
        this.resize();
        this.initParticles();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.bottom = '0';
        this.canvas.style.height = `calc(100% - ${document.querySelector('footer').offsetHeight}px)`;
    }

    initParticles() {
        this.particles = Array.from({ length: this.particleCount }, () => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.5 ? '#165DFF' : '#0FC6C2'
        }));
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
            this.ctx.fill();
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            if (window.innerWidth >= 320) {
                this.particles.forEach(other => {
                    const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
                    if (distance < 100) {
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = `${particle.color}${Math.floor((0.1 - distance/1000) * 255).toString(16).padStart(2, '0')}`;
                        this.ctx.lineWidth = 0.2;
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(other.x, other.y);
                        this.ctx.stroke();
                    }
                });
            }
        });
    }

    animate() {
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

class InteractiveManager {
    constructor() {
        this.logoLink = document.getElementById('logoLink');
        this.logoImg = document.getElementById('logoImg');
        this.qqGroupBtn = document.getElementById('qqGroupBtn');
        this.beianLink = document.querySelector('.footer-text .unified-text');

        this.init();
    }

    bindElementEvents(el, type = 'default') {
        if (!el) return;

        const activate = () => el.classList.add('active');
        const deactivate = () => el.classList.remove('active');

        el.addEventListener('touchstart', activate, { passive: true });
        el.addEventListener('touchend', () => {
            deactivate();
            if (type === 'beian') window.open(el.href, '_blank');
        }, { passive: true });
        el.addEventListener('touchcancel', deactivate, { passive: true });

        el.addEventListener('mousedown', activate);
        el.addEventListener('mouseup', deactivate);
        el.addEventListener('mouseleave', deactivate);

        if (type === 'beian') {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(el.href, '_blank');
            });
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.open(el.href, '_blank');
                }
            });
        }
    }

    init() {
        this.bindElementEvents(this.logoLink);
        this.bindElementEvents(this.logoImg);
        this.bindElementEvents(this.qqGroupBtn);
        this.bindElementEvents(this.beianLink, 'beian');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new ParticleAnimation();
    new InteractiveManager();
    
    const elements = document.querySelectorAll('h1, p, .logo-img');
    elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 500 + i * 200);
    });

    window.addEventListener('resize', () => {
        const canvas = document.getElementById('particle-canvas');
        const footer = document.querySelector('footer');
        if (canvas && footer) {
            canvas.style.height = `calc(100% - ${footer.offsetHeight}px)`;
        }
    });
});

window.addEventListener('load', () => {
    setTimeout(() => {
        new InteractiveManager();
    }, 300);
});