document.addEventListener('DOMContentLoaded', () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInstagram = ua.indexOf('Instagram') > -1;
    const isFacebook = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
    const isAndroid = /android/i.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

    // Elements
    const browserIcon = document.getElementById('browserIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusDescription = document.getElementById('statusDescription');
    const actionArea = document.getElementById('actionArea');
    const uaString = document.getElementById('uaString');

    // Display UA for debugging
    uaString.textContent = ua;

    // Logic
    if (isInstagram || isFacebook) {
        handleInAppBrowser(isAndroid, isIOS);
    } else {
        handleDefaultBrowser();
    }

    function handleInAppBrowser(isAndroid, isIOS) {
        // Warning Icon
        browserIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        `;
        browserIcon.style.background = 'rgba(245, 158, 11, 0.1)';

        statusTitle.textContent = "In-App Browser Detected";
        statusTitle.style.background = "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)";
        statusTitle.style.webkitBackgroundClip = "text";
        statusTitle.style.webkitTextFillColor = "transparent";

        if (isAndroid) {
            statusDescription.textContent = "We detected you are using Instagram's browser. We are attempting to open this in Chrome for a better experience.";
            actionArea.innerHTML = `
                <a href="intent:${window.location.href}#Intent;end" class="btn">
                    Open in Chrome
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
            `;
            // Auto attempt redirect
            setTimeout(() => {
                window.location.href = `intent:${window.location.href}#Intent;end`;
            }, 1000);
        } else if (isIOS) {
            statusDescription.textContent = "You are currently in Instagram's browser. Access to some features might be limited.";
            actionArea.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
                    <div class="tutorial-tip" style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; font-size: 14px;">
                        Input "..." at top right → "Open in Browser"
                    </div>
                    <button class="btn btn-secondary" onclick="location.reload()">
                        Check Again
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                    </button>
                </div>
            `;
        } else {
             // Fallback for other environments
             statusDescription.textContent = "For the best experience, please open this page in your system's default browser.";
        }
    }

    function handleDefaultBrowser() {
        // Success Icon
        browserIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        `;
        browserIcon.style.background = 'rgba(16, 185, 129, 0.1)';

        statusTitle.textContent = "You're All Set!";
        statusTitle.style.background = "linear-gradient(135deg, #10b981 0%, #34d399 100%)";
        statusTitle.style.webkitBackgroundClip = "text";
        statusTitle.style.webkitTextFillColor = "transparent";

        statusDescription.textContent = "Great! You are viewing this page in a standard browser. All features should work perfectly.";

        actionArea.innerHTML = `
            <button class="btn">
                Explore App
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
        `;
    }
});
