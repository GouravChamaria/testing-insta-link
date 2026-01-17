document.addEventListener('DOMContentLoaded', () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInstagram = ua.indexOf('Instagram') > -1;
    const isFacebook = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1;
    const isAndroid = /android/i.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

    const btn = document.getElementById('launchBtn');
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');

    // Current URL (or fallback to a specific landing page if needed)
    const currentUrl = window.location.href;
    const cleanUrl = currentUrl.replace(/https?:\/\//, '');

    if (isInstagram || isFacebook) {
        // Attempt Native Redirects immediately
        if (isAndroid) {
            // Android Intent Scheme
            // Tries to open Chrome, falls back to browser
            const intentUrl = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
            // Alternative generic browser intent if specific package fails (less common to specific in JS, usually OS handles)
            
            triggerRedirect(intentUrl);
        } else if (isIOS) {
            // iOS Chrome Scheme
            // Tries to open googlechrome:// which triggers system prompt
            const chromeUrl = `googlechromes://${cleanUrl}`;
            
            // Note: iOS is stricter. This might prompt "Open in Chrome?". 
            // If Chrome isn't installed, nothing happens.
            // We can try it, but rely on the button as backup.
            triggerRedirect(chromeUrl);
        }
    }

    // Button Click Handler (Fallback)
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        setLoading(true);

        if (isAndroid) {
             const intentUrl = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
             window.location.href = intentUrl;
        } else if (isIOS) {
            // Force external by opening a new window? 
            // Instagram blocks window.open usually. 
            // Try Chrome Scheme again or standard link.
             const chromeUrl = `googlechromes://${cleanUrl}`;
             window.location.href = chromeUrl;
             
             // Also try standard safari fallback after short delay?
             setTimeout(() => {
                 window.location.href = currentUrl; // Reloads basically, but sometimes triggers logic
             }, 500);
        } else {
            // Desktop or standard
            window.location.href = currentUrl;
        }

        setTimeout(() => setLoading(false), 2000);
    });

    function triggerRedirect(url) {
        // Create a hidden link and click it logic often works better than window.location
        // But for intents, window.location is standard.
        // We'll try a timeout to allow the page to render first.
        setTimeout(() => {
            window.location.href = url;
        }, 500); // 500ms delay to let user see "Redirecting..." if we wanted
    }

    function setLoading(isLoading) {
        if (isLoading) {
            btnText.style.display = 'none';
            loader.style.display = 'block';
        } else {
            btnText.style.display = 'block';
            loader.style.display = 'none';
        }
    }
});
