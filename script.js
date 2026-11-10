document.addEventListener("DOMContentLoaded", () => {
    const langButtons = document.querySelectorAll(".lang-bar .lang-btn");

    // --- 1. SITE-WIDE MEMORY READER ---
    // Check URL parameters first (?lang=es), then try localStorage, fallback to default "en"
    const urlParams = new URLSearchParams(window.location.search);
    let activeLang = urlParams.get("lang");

    if (!activeLang) {
        try {
            activeLang = localStorage.getItem("seawaySmilesLang");
        } catch (e) {
            // LocalStorage blocked by folder security
        }
    }
    
    // Default fallback if no memory is found
    if (!activeLang || (activeLang !== "en" && activeLang !== "es")) {
        activeLang = "en";
    }

    // Initialize the page instantly to the saved language layout
    setLanguageState(activeLang);

    // --- 2. CLICK INTERACTION ENGINE ---
    langButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            // Extract the chosen code from the button link (e.g., "#es" -> "es")
            const hrefAttr = btn.getAttribute("href");
            const targetLang = hrefAttr.includes('#') ? hrefAttr.split('#')[1] : "en";

            // Safely store the choice in the browser locker
            try {
                localStorage.setItem("seawaySmilesLang", targetLang);
            } catch (err) {
                // LocalStorage blocked
            }

            // Transform the active page layout immediately
            setLanguageState(targetLang);
        });
    });

    // --- 3. RENDERING ENGINE ---
    function setLanguageState(langCode) {
        if (langCode === "es") {
            document.body.classList.add("show-es");
        } else {
            document.body.classList.remove("show-es");
        }

        // Move the '.active' highlight class to the selected flag button
        langButtons.forEach(btn => {
            const hrefAttr = btn.getAttribute("href");
            const btnLang = hrefAttr.includes('#') ? hrefAttr.split('#')[1] : "en";
            
            if (btnLang === langCode) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
        
        // Pass the language preference down to all navigation links automatically
        applyPreferenceToNavLinks(langCode);
    }

    // --- 4. NAVIGATION SYNC ENGINE ---
    // Rewrites menu links to include the active language parameter
    function applyPreferenceToNavLinks(langCode) {
        const navLinks = document.querySelectorAll("footer nav a, .footer-nav a, .site-footer nav a");
        
        navLinks.forEach(link => {
            const currentHref = link.getAttribute("href");
            if (!currentHref) return;

            // Strip out any old language variables from the link path
            const cleanUrl = currentHref.split('?')[0];

            // Append the fresh active choice parameter (e.g., 'about.html?lang=es')
            link.setAttribute("href", `${cleanUrl}?lang=${langCode}`);
        });
    }
});
