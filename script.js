// Utility to detect if we are in an In-App Browser (Instagram, FB, etc.)
function isInAppBrowser() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    // Instagram specific check, but we can add others like FBAN, FBAV (Facebook)
    return (ua.indexOf("Instagram") > -1) || (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
}

function getMobileOS() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(ua)) {
        return "Android";
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        return "iOS";
    }
    return "unknown";
}

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById('iab-overlay');
    const breakoutBtn = document.getElementById('breakout-btn');
    const currentUrl = window.location.href;

    // Check if we are in an In-App Browser
    if (isInAppBrowser()) {
        console.log("IAB Detected");
        
        // Show the overlay immediately
        overlay.classList.add('visible');

        const os = getMobileOS();

        if (os === "Android") {
            // Android Strategy: Intent Scheme
            // chrome://view-http-date/ is one way, but intent:// is more standard
            // We want to open chrome with the current URL
            
            // Format: intent://<url>#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=<url>;end
            // We strip the https:// from the start for the intent host part if needed, 
            // but standard intent scheme usually takes the full url as path or encoded.
            
            // Simpler Intent approach for "Open in ANY browser":
            // intent:<url>#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end
            
            // cleaning the protocol for the host part isn't strictly necessary if we use full structure
            // But let's use the robust method:
            
            const cleanUrl = currentUrl.replace(/^https?:\/\//, '');
            const scheme = currentUrl.startsWith('http:') ? 'http' : 'https';
            
            // This intent tries to open in Chrome specifically, falling back to default browser
            const intentUrl = `intent://${cleanUrl}#Intent;scheme=${scheme};package=com.android.chrome;end`;
            
            // Generalized Browser Intent (if specific package fails or we want user choice)
            // const intentUrlGeneral = `intent://${cleanUrl}#Intent;scheme=${scheme};action=android.intent.action.VIEW;end`;

            // Auto-redirect attempt
            window.location.href = intentUrl;
            
            // Fallback button click
            breakoutBtn.onclick = () => {
                window.location.href = intentUrl;
            };
            
        } else if (os === "iOS") {
            // iOS Strategy: 
            // Apple blocks most automatic redirects. 
            // googlechrome:// is a known scheme.
            
            const cleanUrl = currentUrl.replace(/^https?:\/\//, '');
            const chromeScheme = `googlechrome://${cleanUrl}`;
            const safariScheme = `x-safari-${currentUrl}`; // Sometimes works for basic shortcuts
            
            // We can Try to redirect to chrome if installed
            // But usually this fails silently or prompts.
            // Best UX is to tell them to use the menu, but we can attach a "Try Open" button
            
            breakoutBtn.innerHTML = "Open in Chrome (if installed)";
            breakoutBtn.onclick = () => {
                window.location.href = chromeScheme;
            };
            
        } else {
            // Generic fallback
            breakoutBtn.onclick = () => {
                window.open(currentUrl, '_system');
            };
        }
        
    } else {
        console.log("External Browser Detected");
        // Ensure overlay is hidden
        overlay.classList.remove('visible');
    }
});
