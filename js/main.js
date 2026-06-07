/* Mobile Menu */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");

function openMobileMenu() {
    mobileMenu.classList.add("active");
    menuOverlay.classList.add("active");
    menuBtn.classList.add("open");
}

function closeMobileMenu() {
    mobileMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
    menuBtn.classList.remove("open");
}

menuBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = mobileMenu.classList.contains("active");

    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

menuOverlay.addEventListener("click", closeMobileMenu);

const mobileLinks = document.querySelectorAll(".mobile-menu a");

mobileLinks.forEach(link => {
    link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("pageshow", closeMobileMenu);

/* Accordion */

const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
        const content = header.nextElementSibling;

        if(content.style.maxHeight){
            content.style.maxHeight = null;
            header.classList.remove("open");
        }else{
            content.style.maxHeight = content.scrollHeight + "px";
            header.classList.add("open");
        }
    });
});

/* Reveal animation */

const revealElements = document.querySelectorAll(
    ".section, .card, .timeline-item, .education-card, .global-card, .beyond-card"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold:0.12
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

/* Back to top */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if(window.scrollY > 600){
        backToTop.classList.add("show");
    }else{
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
});

/* Active desktop navigation */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".desktop-nav a");

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const id = entry.target.getAttribute("id");

            navLinks.forEach(link => {
                link.classList.remove("active");

                if(link.getAttribute("href") === `#${id}`){
                    link.classList.add("active");
                }
            });
        }
    });
}, {
    rootMargin:"-40% 0px -55% 0px"
});

sections.forEach(section => {
    navObserver.observe(section);
});

/* Contact form via mailto */

const contactForm = document.getElementById("contactForm");

if(contactForm){
contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const pageLang = document.documentElement.lang;

    const subjectText =
        pageLang === "ja"
        ? `ポートフォリオサイトからのお問い合わせ：${name}`
        : `Portfolio Website Contact from ${name}`;

    const subject = encodeURIComponent(subjectText);

    const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:olenalobachova.jp8@gmail.com?subject=${subject}&body=${body}`;
});
}

/* Expertise expandable cards */

const expertiseCards = document.querySelectorAll(".expertise-card");

expertiseCards.forEach(card => {
    const toggle = card.querySelector(".expertise-toggle");
    const body = card.querySelector(".expertise-body");

    if(!toggle || !body){
        return;
    }

    toggle.addEventListener("click", () => {
        const isOpen = card.classList.contains("open");

        if(isOpen){
            card.classList.remove("open");
            body.style.maxHeight = null;
        }else{
            card.classList.add("open");
            body.style.maxHeight = body.scrollHeight + "px";
        }
    });
});

/* Open expertise cards by default on desktop */
if(window.innerWidth > 900){
    expertiseCards.forEach(card => {
        const body = card.querySelector(".expertise-body");
        card.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
    });
}
