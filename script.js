const siteConfig = {
    appName: "Reselio",
    appStoreUrl: "",
    contactEmail: "reselio@reselio.app",
    heroShot: {
        label: "Hero screen",
        title: "Wklej główny screen aplikacji",
        description: "Najlepiej ekran magazynu albo podsumowania z widoczną kolorystyką i strukturą kart.",
        src: ""
    },
    screenshots: [
        {
            label: "Screen 01",
            title: "Magazyn",
            description: "Tu najlepiej wchodzi widok listy z filtrami statusów, wyszukiwarką i kartami partii.",
            src: ""
        },
        {
            label: "Screen 02",
            title: "Sprzedaż",
            description: "Pokaż historię transakcji, archiwum albo szczegóły sprzedaży z kosztami i wynikiem.",
            src: ""
        },
        {
            label: "Screen 03",
            title: "Podsumowanie",
            description: "To miejsce na ekran z obrotem, zyskiem netto i najlepszymi kategoriami lub rzeczami.",
            src: ""
        },
        {
            label: "Screen 04",
            title: "Ustawienia, pomoc i backup",
            description: "Dobry slot na ustawienia, backup, FAQ lub sekcję Reselio Premium i subskrypcji.",
            src: ""
        }
    ],
    faqs: [
        {
            question: "Czy Reselio działa bez konta i bez logowania?",
            answer: "Tak. To aplikacja local-first, nastawiona na pracę bez zakładania konta. Jej celem jest szybkie ogarnianie własnych zakupów pod odsprzedaż, a nie budowanie kolejnej warstwy administracji."
        },
        {
            question: "Czy mogę zapisywać kilka sztuk tego samego zakupu?",
            answer: "Tak. Jedna pozycja może oznaczać partię kilku sztuk. Dzięki temu możesz wystawić, sprzedać albo wyrzucić tylko wybraną część partii, zamiast traktować wszystko jako jeden nierozdzielny wpis."
        },
        {
            question: "Czy aplikacja liczy realny wynik sprzedaży?",
            answer: "Tak. Reselio zestawia przychód ze sprzedaży z kosztem zakupu przypisanych sztuk i dodatkowymi kosztami, takimi jak wysyłka czy prowizja. Dzięki temu wynik nie kończy się na samej cenie sprzedaży."
        },
        {
            question: "Czy dane da się zabezpieczyć i odzyskać?",
            answer: "Tak. Aplikacja obsługuje pełną kopię zapasową i przywracanie danych razem ze zdjęciami i ustawieniami. Dodatkowo można włączyć blokadę aplikacji biometrią lub kodem urządzenia."
        }
    ]
};

function createPlaceholderMarkup(shot) {
    return `
        <div class="shot-placeholder">
            <div class="placeholder-card">
                <span>${shot.label}</span>
                <strong>${shot.title}</strong>
                <p>${shot.description}</p>
            </div>
        </div>
    `;
}

function createImageMarkup(shot, variantClass = "shot-image") {
    return `
        <div class="${variantClass}" style="background-image: url('${shot.src}');">
            <div class="shot-overlay">${shot.title}</div>
        </div>
    `;
}

function renderHeroShot() {
    const heroRoot = document.querySelector("#hero-shot");
    if (!heroRoot) {
        return;
    }

    if (siteConfig.heroShot.src) {
        heroRoot.innerHTML = createImageMarkup(siteConfig.heroShot, "hero-image");
        return;
    }

    heroRoot.innerHTML = `
        <div class="hero-placeholder">
            <div class="placeholder-card">
                <span>${siteConfig.heroShot.label}</span>
                <strong>${siteConfig.heroShot.title}</strong>
                <p>${siteConfig.heroShot.description}</p>
            </div>
        </div>
    `;
}

function renderScreenshots() {
    const container = document.querySelector("#screens-grid");
    if (!container) {
        return;
    }

    container.innerHTML = siteConfig.screenshots.map((shot) => `
        <article class="shot-card reveal">
            <div class="shot-frame">
                ${shot.src ? createImageMarkup(shot) : createPlaceholderMarkup(shot)}
            </div>
            <div class="shot-copy">
                <span>${shot.label}</span>
                <h3>${shot.title}</h3>
                <p>${shot.description}</p>
            </div>
        </article>
    `).join("");
}

function renderFaqs() {
    const container = document.querySelector("#faq-list");
    if (!container) {
        return;
    }

    container.innerHTML = siteConfig.faqs.map((item, index) => `
        <article class="faq-item reveal ${index === 0 ? "is-open" : ""}">
            <button class="faq-question" type="button" aria-expanded="${index === 0 ? "true" : "false"}">
                <span>${item.question}</span>
                <span>+</span>
            </button>
            <div class="faq-answer">
                <p>${item.answer}</p>
            </div>
        </article>
    `).join("");

    container.querySelectorAll(".faq-question").forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest(".faq-item");
            const isOpen = item.classList.contains("is-open");

            container.querySelectorAll(".faq-item").forEach((faqItem) => {
                faqItem.classList.remove("is-open");
                faqItem.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                item.classList.add("is-open");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });
}

function updatePrimaryCtas() {
    const href = siteConfig.appStoreUrl
        ? siteConfig.appStoreUrl
        : `mailto:${siteConfig.contactEmail}?subject=Reselio%20-%20chce%20dostep`;

    const label = siteConfig.appStoreUrl ? "Pobierz z App Store" : "Poproś o dostęp";
    const meta = siteConfig.appStoreUrl
        ? "Dostępne na iPhone’a. Kliknięcie prowadzi bezpośrednio do App Store."
        : "Do czasu podpięcia App Store CTA prowadzi na mail kontaktowy, żeby można było zgłosić chęć dostępu.";

    document.querySelectorAll(".js-primary-cta").forEach((link) => {
        link.setAttribute("href", href);
        link.textContent = label;

        if (siteConfig.appStoreUrl) {
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noreferrer noopener");
        } else {
            link.removeAttribute("target");
            link.removeAttribute("rel");
        }
    });

    const metaNode = document.querySelector(".js-cta-meta");
    if (metaNode) {
        metaNode.textContent = meta;
    }
}

function observeRevealElements() {
    const revealElements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.16
        }
    );

    revealElements.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
        observer.observe(element);
    });
}

function updateYear() {
    const yearNode = document.querySelector("#year");
    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }
}

renderHeroShot();
renderScreenshots();
renderFaqs();
updatePrimaryCtas();
observeRevealElements();
updateYear();
