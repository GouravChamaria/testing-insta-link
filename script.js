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
            // Android Strategy: Generic Intent
            // This allows the user to choose their browser or uses the default one
            // We removed 'package=com.android.chrome' to allow any browser
            
            const cleanUrl = currentUrl.replace(/^https?:\/\//, '');
            const scheme = currentUrl.startsWith('http:') ? 'http' : 'https';
            
            // Standard Intent to VIEW data. 
            // S.browser_fallback_url ensures that if the intent fails, it stays on the page (or we can redirect)
            // scheme=https usually triggers the browser selection if currently in a webview
            
            const intentUrl = `intent://${cleanUrl}#Intent;scheme=${scheme};action=android.intent.action.VIEW;S.browser_fallback_url=${currentUrl};end`;
            
            // Auto-redirect attempt
            window.location.href = intentUrl;
            
            // Fallback button click - re-trigger the intent
            breakoutBtn.onclick = () => {
                window.location.href = intentUrl;
            };
            
        } else {
            // iOS & Others Strategy
            // Apple blocks automatic redirects to other apps from WebViews usually.
            // We can try valid schemes, but the Overlay instruction is key.
            
            // Try to open in a new window context which sometimes breaks out or prompts
            breakoutBtn.innerHTML = "Open in System Browser";
            
            breakoutBtn.onclick = (e) => {
                e.preventDefault();
                // 1. Try generic window.open (basic attempt)
                window.open(currentUrl, '_system');
                
                // 2. Refresh prompt logic - sometimes reloading helps signal the intent
                // But mainly we rely on the user following the arrow to the menu.
                
                // Optional: Attempt Chrome scheme as a 'nice to have' if they clicked the button
                // but don't force it automatically on load to avoid error dialogs.
                const cleanUrl = currentUrl.replace(/^https?:\/\//, '');
                const chromeScheme = `googlechrome://${cleanUrl}`;
                
                // We utilize a small timeout to try chrome, then fallback
                setTimeout(() => {
                    window.location.href = chromeScheme;
                }, 500);
            };
        }
        
    } else {
        console.log("External Browser Detected");
        // Ensure overlay is hidden
        overlay.classList.remove('visible');
    }
});
