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

/* Reveal animation */

const revealElements = document.querySelectorAll(
    ".section, .card, .beyond-card"
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

/* Mobile compact accordions and bottom navigation */

const isJapanesePage = document.documentElement.lang === "ja";
const isJapaneseBusinessPage = document.body.classList.contains("ja-business-page");
const mobileMediaQuery = window.matchMedia("(max-width: 768px)");

/* Mobile cases carousel and expertise accordions */

const businessPage = document.body.classList.contains("en-business-page")
    || document.body.classList.contains("ja-business-page");

function setupMobileCasesCarousel() {
    if(!businessPage){
        return;
    }

    const grid = document.querySelector(".cases-section .case-grid");

    if(!grid || grid.dataset.mobileCarouselReady === "true"){
        return;
    }

    const cards = Array.from(grid.querySelectorAll(".case-card"));

    if(!cards.length){
        return;
    }

    grid.dataset.mobileCarouselReady = "true";
    grid.setAttribute("tabindex", "0");
    grid.setAttribute("aria-label", isJapanesePage ? "主なプロダクト実績のカルーセル" : "Selected product cases carousel");

    const status = document.createElement("p");
    status.className = "case-carousel-status";
    status.setAttribute("aria-live", "polite");
    grid.insertAdjacentElement("afterend", status);

    const updateStatus = () => {
        const viewportCenter = grid.scrollLeft + grid.clientWidth / 2;
        let activeIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(cardCenter - viewportCenter);

            if(distance < closestDistance){
                closestDistance = distance;
                activeIndex = index;
            }
        });

        status.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    };

    let ticking = false;

    grid.addEventListener("scroll", () => {
        if(ticking){
            return;
        }

        ticking = true;
        window.requestAnimationFrame(() => {
            updateStatus();
            ticking = false;
        });
    }, { passive:true });

    window.addEventListener("resize", updateStatus);
    updateStatus();
}

function setupMobileExpertiseAccordion() {
    if(!businessPage){
        return;
    }

    const cards = Array.from(document.querySelectorAll("#expertise .expertise-card"));

    cards.forEach((card, index) => {
        if(card.dataset.mobileExpertiseReady === "true"){
            return;
        }

        const visual = card.querySelector(".expertise-visual");
        const heading = card.querySelector("h3");
        const panel = card.querySelector("p");

        if(!visual || !heading || !panel){
            return;
        }

        card.dataset.mobileExpertiseReady = "true";
        card.classList.add("mobile-expertise-accordion");

        const trigger = document.createElement("button");
        const panelId = `expertise-panel-${index + 1}`;
        trigger.type = "button";
        trigger.className = "expertise-accordion-trigger";
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute("aria-controls", panelId);

        const indicator = document.createElement("span");
        indicator.className = "expertise-accordion-indicator";
        indicator.setAttribute("aria-hidden", "true");

        card.insertBefore(trigger, visual);
        trigger.appendChild(visual);
        trigger.appendChild(heading);
        trigger.appendChild(indicator);

        panel.id = panelId;
        panel.classList.add("expertise-accordion-panel");

        trigger.addEventListener("click", () => {
            const isOpen = card.classList.contains("is-open");

            cards.forEach(otherCard => {
                const otherTrigger = otherCard.querySelector(".expertise-accordion-trigger");
                otherCard.classList.remove("is-open");

                if(otherTrigger){
                    otherTrigger.setAttribute("aria-expanded", "false");
                }
            });

            if(!isOpen){
                card.classList.add("is-open");
                trigger.setAttribute("aria-expanded", "true");
            }
        });
    });
}

function setupMobileBusinessSections() {
    if(!mobileMediaQuery.matches){
        return;
    }

    setupMobileCasesCarousel();
    setupMobileExpertiseAccordion();
}

setupMobileBusinessSections();

if(mobileMediaQuery.addEventListener){
    mobileMediaQuery.addEventListener("change", setupMobileBusinessSections);
}else if(mobileMediaQuery.addListener){
    mobileMediaQuery.addListener(setupMobileBusinessSections);
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

    const labels = isJapaneseBusinessPage
        ? [
            ["#value", "私について", "greeting"],
            ["#cases", "実績", "experience"],
            ["#expertise", "専門領域", "expertise"],
            ["#beyond", "ミッション", "home"],
            ["#contact", "連絡先", "contact"]
        ]
        : isJapanesePage
        ? [
            ["#", "ホーム", "home"],
            ["#about", "ご挨拶", "greeting"],
            ["#expertise", "専門領域", "expertise"],
            ["#experience", "経歴", "experience"],
            ["#contact", "連絡先", "contact"]
        ]
        : [
            ["#value", "About", "greeting"],
            ["#cases", "Cases", "experience"],
            ["#expertise", "Expertise", "expertise"],
            ["#beyond", "Mission", "home"],
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
const mobileObservedSections = document.querySelectorAll(
    isJapaneseBusinessPage
        ? ".mobile-hero-image-section, .hero-approved, #value, #cases, #expertise, #beyond, #contact"
        : isJapanesePage
        ? ".mobile-hero-image-section, .hero-approved, #about, #expertise, #experience, #contact"
        : ".mobile-hero-image-section, .hero-approved, #value, #cases, #expertise, #beyond, #contact"
);

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
            setActiveMobileLink((!isJapanesePage || isJapaneseBusinessPage) && id === "home" ? "value" : id);
        }
    });
}, {
    rootMargin:"-42% 0px -50% 0px",
    threshold:0.01
});

mobileObservedSections.forEach(section => {
    mobileNavObserver.observe(section);
});

setActiveMobileLink(isJapaneseBusinessPage ? "value" : isJapanesePage ? "home" : "value");
