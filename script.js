document.addEventListener("DOMContentLoaded", () => {
    const progress = document.querySelector(".scroll-progress");
    const revealEls = document.querySelectorAll(".reveal");
    const anchors = document.querySelectorAll('a[href^="#"]');
    const topbar = document.querySelector(".topbar");
    const navLinks = [...document.querySelectorAll(".topnav a, .footer-links a, .mobile-tab-item")];
    const copyButton = document.querySelector("[data-copy-email]");
    const sections = [...document.querySelectorAll("section[id]")];
    const yearEls = document.querySelectorAll("[data-year]");
    const mobileTabNav = document.querySelector(".mobile-tab-nav");

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

    const getTopbarOffset = () => {
        if (!topbar) return 80;
        const rect = topbar.getBoundingClientRect();
        return Math.max(rect.height, 70);
    };

    const setProgress = () => {
        if (!progress) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? scrollTop / docHeight : 0;
        progress.style.transform = `scaleX(${clamp(pct, 0, 1)})`;
    };

    const setActiveSection = (id) => {
        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (!href || !href.startsWith("#")) return;
            const isActive = href === `#${id}`;
            link.classList.toggle("active", isActive);
        });
    };

    // Smooth page reveals on scroll
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -5% 0px",
        }
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    // Active Section Observer
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible && visible.target && visible.target.id) {
                setActiveSection(visible.target.id);
            }
        },
        {
            threshold: [0.15, 0.3, 0.5],
            rootMargin: "-25% 0px -50% 0px",
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    const scrollToTarget = (target) => {
        const offset = getTopbarOffset();
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset - 10;
        window.scrollTo({ top: targetTop, behavior: "smooth" });
    };

    anchors.forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const href = anchor.getAttribute("href");
            if (!href || !href.startsWith("#")) return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            scrollToTarget(target);
            history.replaceState(null, "", href);
        });
    });

    window.addEventListener("scroll", () => {
        setProgress();
    }, { passive: true });

    window.addEventListener("resize", () => {
        setProgress();
    }, { passive: true });

    // Slide in the Mobile Bottom Tab Bar 500ms after load
    if (mobileTabNav) {
        setTimeout(() => {
            mobileTabNav.classList.add("visible");
        }, 500);
    }

    // Email clipboard copy
    if (copyButton) {
        copyButton.addEventListener("click", async (event) => {
            const email = copyButton.getAttribute("data-copy-email");
            if (!email) return;

            event.preventDefault();

            try {
                await navigator.clipboard.writeText(email);
                const oldText = copyButton.textContent;
                copyButton.textContent = "Copied to Clipboard";
                copyButton.style.background = "#27C93F";
                copyButton.style.borderColor = "#27C93F";
                copyButton.style.color = "#FFF";
                
                setTimeout(() => {
                    copyButton.textContent = oldText;
                    copyButton.style.background = "";
                    copyButton.style.borderColor = "";
                    copyButton.style.color = "";
                }, 2000);
            } catch {
                window.location.href = `mailto:${email}`;
            }
        });
    }

    // Copyright Dynamic Year
    yearEls.forEach((el) => {
        el.textContent = String(new Date().getFullYear());
    });

    // Auto-scroll on initial load if hash is present
    const initialHash = window.location.hash;
    if (initialHash) {
        const target = document.querySelector(initialHash);
        if (target) {
            setTimeout(() => scrollToTarget(target), 150);
        }
    }

    setProgress();

    // Active bottom-tab binding on manual clicks
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#")) {
                setActiveSection(href.slice(1));
            }
        });
    });

    window.addEventListener("hashchange", () => {
        const id = window.location.hash.replace("#", "");
        if (id) setActiveSection(id);
    });


    // ==========================================
    // HIGH-FIDELITY MACOS TERMINAL TYPING ENGINE
    // ==========================================
    const termContainer = document.getElementById("term-typing");
    let hasTyped = false;

    if (termContainer) {
        const scrollObserver = new MutationObserver(() => {
            termContainer.scrollTop = termContainer.scrollHeight;
        });
        scrollObserver.observe(termContainer, { childList: true, subtree: true, characterData: true });
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const typeWord = async (element, text, speed = 65) => {
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await delay(speed + (Math.random() * 30 - 15));
        }
    };

    const typeTerminalSequence = async () => {
        if (hasTyped || !termContainer) return;
        hasTyped = true;

        // Clear default markup
        termContainer.innerHTML = "";

        // Cursor utility
        const createCursor = () => {
            const cursor = document.createElement("span");
            cursor.className = "term-cursor";
            return cursor;
        };

        // Command 1: Initialize profile environment
        const line1 = document.createElement("div");
        line1.className = "type-line";
        line1.innerHTML = `<span class="terminal-user">root@krishna</span> <span class="terminal-dir">~</span> <span class="terminal-prompt">$ </span><span class="cmd"></span>`;
        termContainer.appendChild(line1);
        
        const cmdSpan1 = line1.querySelector(".cmd");
        const cursor1 = createCursor();
        cmdSpan1.appendChild(cursor1);
        
        await delay(800);
        cursor1.remove();
        await typeWord(cmdSpan1, "./initialize_profile.sh");
        cmdSpan1.appendChild(cursor1);
        await delay(500);
        cursor1.remove();

        // Output 1
        const out1 = document.createElement("div");
        out1.className = "output";
        out1.innerHTML = `> Initiating growth_consultant.log...<br/>> Loading real numbers & distribution metrics...`;
        termContainer.appendChild(out1);
        await delay(600);

        // Command 2: Load results
        const line2 = document.createElement("div");
        line2.className = "type-line";
        line2.innerHTML = `<span class="terminal-user">root@krishna</span> <span class="terminal-dir">~</span> <span class="terminal-prompt">$ </span><span class="cmd"></span>`;
        termContainer.appendChild(line2);

        const cmdSpan2 = line2.querySelector(".cmd");
        const cursor2 = createCursor();
        cmdSpan2.appendChild(cursor2);

        await delay(600);
        cursor2.remove();
        await typeWord(cmdSpan2, "cat stats.log");
        cmdSpan2.appendChild(cursor2);
        await delay(400);
        cursor2.remove();

        // Output 2 (Logs list)
        const out2 = document.createElement("div");
        out2.className = "output";
        termContainer.appendChild(out2);

        const logs = [
            "[INFO] System initialized at age 16. Restarted at 17.",
            "[INFO] Fluff completely bypassed. Focus active.",
            "<span class='success'>[OK] Brand deal negotiations successfully optimized</span>",
            "<span class='success'>[OK] Ritik Oberoi 2.0 deals closed (Sellerpic, VoiceGenie)</span>",
            "<span class='success'>[OK] Sourced VoiceGenie AI (~$65) & Novi AI (~$90) for Tech Umee</span>",
            "<span class='success'>[OK] VoiceGenie AI UGC experiment: ~200K+ organic views ($200 budget)</span>",
            "<span class='success'>[OK] silkk.app built and structured for handoff</span>"
        ];

        for (let j = 0; j < logs.length; j++) {
            const logLine = document.createElement("div");
            logLine.innerHTML = logs[j];
            out2.appendChild(logLine);
            await delay(250);
        }

        // Final Prompt Line with active cursor
        const line3 = document.createElement("div");
        line3.className = "type-line";
        line3.innerHTML = `<span class="terminal-user">root@krishna</span> <span class="terminal-dir">~</span> <span class="terminal-prompt">$ </span><span class="cmd"></span>`;
        termContainer.appendChild(line3);
        const cmdSpan3 = line3.querySelector(".cmd");
        cmdSpan3.appendChild(createCursor());
    };

    // Trigger typing when scrolled in
    const termObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            typeTerminalSequence();
            termObserver.disconnect();
        }
    }, { threshold: 0.35 });

    const terminalEl = document.querySelector(".terminal");
    if (terminalEl) termObserver.observe(terminalEl);


    // ==========================================
    // DESKTOP NATIVE MAGNETIC BUTTON EFFECT
    // ==========================================
    const isMobile = () => window.innerWidth <= 768;

    if (!isMobile()) {
        const buttons = document.querySelectorAll(".btn, .topbar-link");
    }
});