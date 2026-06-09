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

/* Mobile compact accordions and bottom navigation */

const isJapanesePage = document.documentElement.lang === "ja";
const mobileMediaQuery = window.matchMedia("(max-width: 768px)");

function makeToggleButton(label) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mobile-card-toggle";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", label);
    button.innerHTML = '<span aria-hidden="true"></span>';
    return button;
}

function ensureMobileToggle(card, heading, label) {
    if(!card || !heading || card.querySelector(".mobile-card-toggle")){
        return;
    }

    const toggle = makeToggleButton(label);
    heading.appendChild(toggle);
    card.classList.add("mobile-collapsible");

    const toggleCard = () => {
        const isOpen = card.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    };

    toggle.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        toggleCard();
    });

    heading.addEventListener("click", event => {
        if(!mobileMediaQuery.matches || event.target.closest("a")){
            return;
        }

        event.preventDefault();
        toggleCard();
    });
}

document.querySelectorAll(".about-block").forEach(card => {
    const heading = card.querySelector(".about-heading");
    card.classList.add("mobile-collapsible", "mobile-readmore-card");

    if(!card.querySelector(".mobile-readmore")){
        const openLabel = isJapanesePage ? "続きを読む" : "Read more";
        const closeLabel = isJapanesePage ? "閉じる" : "Close";
        const readMore = document.createElement("button");
        readMore.type = "button";
        readMore.className = "mobile-readmore";
        readMore.setAttribute("aria-expanded", "false");
        readMore.textContent = openLabel;
        readMore.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();

            const isOpen = card.classList.toggle("is-open");
            readMore.setAttribute("aria-expanded", String(isOpen));
            readMore.textContent = isOpen ? closeLabel : openLabel;
        });
        card.appendChild(readMore);
    }
});

document.querySelectorAll(".timeline-card").forEach(card => {
    const heading = card.querySelector(".timeline-heading");
    const title = heading?.querySelector("h3")?.textContent?.trim() || "";
    ensureMobileToggle(card, heading, title);
});

document.querySelectorAll(".skill-group").forEach(card => {
    const heading = card.querySelector("h3");
    const title = heading?.textContent?.trim() || "";
    ensureMobileToggle(card, heading, title);
});

document.querySelectorAll(".education-card-continuous").forEach(card => {
    card.classList.add("is-open", "mobile-always-open");
});

document.querySelectorAll(".timeline-card").forEach(card => {
    if(card.querySelector(".mobile-timeline-period")){
        return;
    }

    const item = card.closest(".timeline-item");
    const date = item?.querySelector(".timeline-date")?.textContent?.replace(/\s+/g, " ").trim();

    if(date){
        const period = document.createElement("p");
        period.className = "mobile-timeline-period";
        period.textContent = date;
        card.insertBefore(period, card.firstChild);
    }
});

const languageCard = document.querySelector(".global-card");
const languageItems = languageCard ? languageCard.querySelectorAll("li") : [];

function updateMobileLanguageLabels() {
    languageItems.forEach(item => {
        if(!item.dataset.fullLabel){
            item.dataset.fullLabel = item.textContent.trim();
        }

        if(mobileMediaQuery.matches){
            item.textContent = item.dataset.fullLabel
                .replace(/（.*?）/g, "")
                .replace(/\s+—\s+.*$/g, "")
                .trim();
        }else{
            item.textContent = item.dataset.fullLabel;
        }
    });
}

updateMobileLanguageLabels();

if(mobileMediaQuery.addEventListener){
    mobileMediaQuery.addEventListener("change", updateMobileLanguageLabels);
}else if(mobileMediaQuery.addListener){
    mobileMediaQuery.addListener(updateMobileLanguageLabels);
}

document.querySelectorAll(".hero-hotspot-contact").forEach(link => {
    link.addEventListener("click", event => {
        if(!mobileMediaQuery.matches){
            return;
        }

        const target = document.querySelector("#contact");

        if(!target){
            return;
        }

        event.preventDefault();
        target.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });

        if(window.history && window.history.pushState){
            window.history.pushState(null, "", "#contact");
        }else{
            window.location.hash = "contact";
        }
    });
});

function createMobileBottomNav() {
    if(document.querySelector(".mobile-bottom-nav")){
        return;
    }

    const labels = isJapanesePage
        ? [
            ["#", "ホーム", "home"],
            ["#about", "ご挨拶", "greeting"],
            ["#expertise", "専門領域", "expertise"],
            ["#experience", "経歴", "experience"],
            ["#contact", "連絡先", "contact"]
        ]
        : [
            ["#", "Home", "home"],
            ["#about", "Profile", "greeting"],
            ["#expertise", "Expertise", "expertise"],
            ["#experience", "Experience", "experience"],
            ["#contact", "Contact", "contact"]
        ];

    const nav = document.createElement("nav");
    nav.className = "mobile-bottom-nav";
    nav.setAttribute("aria-label", isJapanesePage ? "モバイルナビゲーション" : "Mobile navigation");

    labels.forEach(([href, text, iconName]) => {
        const link = document.createElement("a");
        link.href = href;
        link.dataset.iconInactive = `assets/icons/nav/${iconName}_inactive.svg`;
        link.dataset.iconActive = `assets/icons/nav/${iconName}_active.svg`;
        link.innerHTML = `<span class="mobile-bottom-icon" aria-hidden="true"><img src="${link.dataset.iconInactive}" alt=""></span><span>${text}</span>`;
        nav.appendChild(link);
    });

    document.body.appendChild(nav);
}

createMobileBottomNav();

const mobileBottomLinks = document.querySelectorAll(".mobile-bottom-nav a");
const mobileObservedSections = document.querySelectorAll(".mobile-hero-image-section, .hero-approved, #about, #expertise, #experience, #contact");

function setActiveMobileLink(id) {
    mobileBottomLinks.forEach(link => {
        const target = link.getAttribute("href");
        const isHome = id === "home" && target === "#";
        const isActive = isHome || target === `#${id}`;
        const icon = link.querySelector(".mobile-bottom-icon img");

        link.classList.toggle("active", isActive);

        if(icon){
            icon.src = isActive ? link.dataset.iconActive : link.dataset.iconInactive;
        }
    });
}

const mobileNavObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const id = entry.target.id || "home";
            setActiveMobileLink(id);
        }
    });
}, {
    rootMargin:"-42% 0px -50% 0px",
    threshold:0.01
});

mobileObservedSections.forEach(section => {
    mobileNavObserver.observe(section);
});

setActiveMobileLink("home");
