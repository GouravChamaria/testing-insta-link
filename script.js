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
            // iOS Strategy: Automatic Breakout
            // mimic the Android "popup" behavior by triggering specific schemes
            // 'x-safari-https://' usually triggers a system prompt "Open in Safari?" on newer iOS
            // 'googlechrome://' triggers "Open in Chrome?"
            
            const targetNoPh = currentUrl.replace(/^https?:\/\//, '');
            const safariScheme = `x-safari-https://${targetNoPh}`;
            const chromeScheme = `googlechrome://${targetNoPh}`;
            const firefoxScheme = `firefox://open-url?url=${currentUrl}`;
            
            // 1. Immediate Attempt: x-safari-https
            // This is the cleanest "System Browser" attempt
            window.location.href = safariScheme;
            
            // Button Fallback: Chain attempts
            // We give the user the "Open in System Browser" button which tries Safari first, then generic
            breakoutBtn.innerHTML = "Open in System Browser";
            
            breakoutBtn.onclick = (e) => {
                e.preventDefault();
                
                // Try Safari Scheme again
                window.location.href = safariScheme;
                
                // Fallback sequence if Safari scheme is unsupported/fails (short timeout)
                setTimeout(() => {
                    // Try Chrome
                    window.location.href = chromeScheme;
                }, 500);

                 setTimeout(() => {
                    // Finally standard new window as last resort
                    window.open(currentUrl, '_system');
                }, 1000);
            };
        }
        
    } else {
        console.log("External Browser Detected");
        // Ensure overlay is hidden
        overlay.classList.remove('visible');
    }
});
