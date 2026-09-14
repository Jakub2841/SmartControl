// Navbar behaviour — mobile panel toggle only. No other client-side state.
(() => {
    const toggle = document.getElementById('nav-toggle');
    const panel = document.getElementById('nav-panel');
    const nav = document.querySelector('.nav');

    if (!toggle || !panel || !nav) {
        return;
    }

    const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        panel.dataset.open = String(open);
    };

    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

    toggle.addEventListener('click', () => setOpen(!isOpen()));

    // Clicking anywhere outside the nav closes the panel.
    document.addEventListener('click', (event) => {
        if (nav.contains(event.target)) {
            return;
        }
        setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !isOpen()) {
            return;
        }
        setOpen(false);
        toggle.focus();
    });

    // The panel is only rendered below 768px — drop the open state past that.
    window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
        if (event.matches) {
            setOpen(false);
        }
    });
})();
