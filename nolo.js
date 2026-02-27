const clearLogo = setInterval(() => {
    const splineViewer = document.querySelector('spline-viewer');

    if (!splineViewer) return;

    const shadowRoot = splineViewer.shadowRoot;
    if (shadowRoot) {
        const logo = shadowRoot.querySelector('#logo');
        if (logo) {
            logo.remove();
            clearInterval(clearLogo);
        }
    }
}, 100);