/* ========================================
   Wedding Invitation — Адыбек & Инесса
   Script: Music, Countdown, RSVP, AOS
   ======================================== */

// ---- CONFIG ----
const WEDDING_DATE = '2026-06-20T15:00:00';
const BOT_TOKEN = '8765845180:AAH7i-qSgmI1iz38SXCpzYYCM9qEYjhj7w0';
const CHAT_ID = '-5228772246';

// ---- HELPERS ----
var isMobile = window.innerWidth <= 768;

// ---- INIT ----
document.addEventListener('DOMContentLoaded', function () {
    AOS.init({
        duration: isMobile ? 600 : 900,
        easing: 'ease-out-cubic',
        once: true,
        offset: isMobile ? 50 : 80,
        disable: false
    });

    initCountdown();
    initRSVP();
    initGSAP();
});

// ---- GSAP ANIMATIONS ----
function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax only on desktop — causes jank on mobile
    if (!isMobile) {
        var heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            gsap.to(heroBg, {
                y: 120,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

        document.querySelectorAll('.parallax-img').forEach(function (img) {
            gsap.fromTo(img, { y: -30 }, {
                y: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.closest('.photo-section'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        var finalBg = document.querySelector('.final-bg');
        if (finalBg) {
            gsap.fromTo(finalBg, { y: -60 }, {
                y: 60,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#final',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    }

    // Stagger animations — faster on mobile
    var dur = isMobile ? 0.5 : 0.7;
    var stag = isMobile ? 0.1 : 0.15;
    var startPos = isMobile ? 'top 90%' : 'top 80%';

    // Timeline items
    gsap.fromTo('.timeline-item', {
        opacity: 0, x: isMobile ? -20 : -40
    }, {
        opacity: 1, x: 0,
        duration: dur,
        stagger: stag,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.timeline-list', start: startPos, once: true }
    });

    // Wish cards
    gsap.fromTo('.wish-card', {
        opacity: 0, y: isMobile ? 25 : 40, scale: 0.95
    }, {
        opacity: 1, y: 0, scale: 1,
        duration: dur,
        stagger: isMobile ? 0.12 : 0.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.wishes-grid', start: startPos, once: true }
    });

    // Dresscode cards
    gsap.fromTo('.dresscode-card', {
        opacity: 0, y: isMobile ? 20 : 30
    }, {
        opacity: 1, y: 0,
        duration: dur,
        stagger: stag,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.dresscode-grid', start: startPos, once: true }
    });

    // Color swatches
    gsap.fromTo('.color-swatch', {
        opacity: 0, scale: 0.5
    }, {
        opacity: 1, scale: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.color-palette', start: startPos, once: true }
    });

    // Countdown
    gsap.fromTo('.countdown-item', {
        opacity: 0, y: 20, scale: 0.8
    }, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.countdown', start: startPos, once: true }
    });

    // Coordinator list
    gsap.fromTo('.coordinator-list li', {
        opacity: 0, x: -15
    }, {
        opacity: 1, x: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.coordinator-list', start: startPos, once: true }
    });

    // Form fields
    gsap.fromTo('.form-group', {
        opacity: 0, y: 15
    }, {
        opacity: 1, y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.rsvp-form', start: startPos, once: true }
    });
}

// ---- COUNTDOWN ----
function initCountdown() {
    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');
    var target = new Date(WEDDING_DATE).getTime();

    function update() {
        var now = Date.now();
        var diff = target - now;

        if (diff <= 0) {
            daysEl.textContent = '0';
            hoursEl.textContent = '0';
            minutesEl.textContent = '0';
            secondsEl.textContent = '0';
            return;
        }

        var d = Math.floor(diff / (1000 * 60 * 60 * 24));
        var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var s = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = d;
        hoursEl.textContent = h;
        minutesEl.textContent = m;
        secondsEl.textContent = s;
    }

    update();
    setInterval(update, 1000);
}

// ---- RSVP FORM ----
function initRSVP() {
    var form = document.getElementById('rsvpForm');
    var successMsg = document.getElementById('formSuccess');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = document.getElementById('guestName').value.trim();
        var telegram = document.getElementById('guestTelegram').value.trim();
        var attendance = form.querySelector('input[name="attendance"]:checked');
        var alcoholChecked = form.querySelectorAll('input[name="alcohol"]:checked');

        if (!name || !telegram || !attendance || alcoholChecked.length === 0) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        var alcoholValues = [];
        alcoholChecked.forEach(function (cb) { alcoholValues.push(cb.value); });
        var alcoholStr = alcoholValues.join(', ');

        var now = new Date();
        var dateStr = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU');

        var text = '✨ Новая анкета гостя\n\n'
            + '👤 Имя: ' + name + '\n'
            + '📱 Telegram: ' + telegram + '\n'
            + '✅ Подтверждение присутствия: ' + attendance.value + '\n'
            + '🍷 Алкоголь: ' + alcoholStr + '\n'
            + '📅 Дата отправки: ' + dateStr;

        var submitBtn = form.querySelector('.btn-submit');
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;

        fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            form.style.display = 'none';
            successMsg.style.display = 'block';
        })
        .catch(function (err) {
            alert('Ошибка отправки. Попробуйте позже.');
            submitBtn.textContent = 'Отправить';
            submitBtn.disabled = false;
        });
    });
}
