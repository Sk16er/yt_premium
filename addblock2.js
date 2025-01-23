// ==UserScript==
// @name         YouTube Premium Free
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Get YouTube Premium in your browser totally free
// @author       Livrädo Sandoval
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        adblocker: true,
        removePopup: false,
        debugMessages: true
    };

    // Initialize script
    init();

    function init() {
        if (config.adblocker) removeAds();
        if (config.removePopup) popupRemover();
        changeTitle();
        changeLogo();
        setupObservers();
    }

    function changeTitle() {
        if (document.title !== "YouTube Premium") {
            document.title = "YouTube Premium";
        }
    }

    function setupObservers() {
        // Monitor for changes in the title and URL
        setupTitleObserver();
        setupUrlObservers();
    }

    function setupTitleObserver() {
        const titleElement = document.querySelector('title');
        if (titleElement) {
            new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.target.nodeName === 'TITLE') {
                        changeTitle();
                    }
                });
            }).observe(titleElement, { childList: true });
        }
    }

    function setupUrlObservers() {
        window.addEventListener('popstate', onLocationChange);
        window.addEventListener('pushstate', onLocationChange);
        window.addEventListener('replacestate', onLocationChange);

        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
        };
    }

    function onLocationChange() {
        changeTitle();
        changeLogo();
    }

    function removeAds() {
        console.log("removeAds()");

        setInterval(() => {
            clearAllPlayers();
            removePageAds();
        }, 500);
    }

    function clearAllPlayers() {
        const videoPlayerElements = document.querySelectorAll('.html5-video-player');
        videoPlayerElements.forEach(videoPlayerElement => {
            const iframes = videoPlayerElement.querySelectorAll('iframe');
            iframes.forEach(iframe => iframe.remove());
        });
    }

    function removePageAds() {
        const style = document.createElement('style');
        style.textContent = `
            ytd-action-companion-ad-renderer,
            ytd-display-ad-renderer,
            ytd-video-masthead-ad-advertiser-info-renderer,
            ytd-video-masthead-ad-primary-video-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-ad-slot-renderer,
            yt-about-this-ad-renderer,
            yt-mealbar-promo-renderer,
            ytd-statement-banner-renderer,
            ytd-ad-slot-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-banner-promo-renderer-background,
            statement-banner-style-type-compact,
            .ytd-video-masthead-ad-v3-renderer,
            div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint,
            div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer,
            div#main-container.style-scope.ytd-promoted-video-renderer,
            div#player-ads.style-scope.ytd-watch-flexy,
            ad-slot-renderer,
            ytm-promoted-sparkles-web-renderer,
            masthead-ad,
            tp-yt-iron-overlay-backdrop,
            #masthead-ad {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    function changeLogo() {
        // Code to change the logo
        const logoElement = document.querySelector("#logo-icon");
        if (logoElement) {
            logoElement.innerHTML = `<svg>...custom SVG content...</svg>`;
        }
    }

    function popupRemover() {
        setInterval(() => {
            const modalOverlay = document.querySelector("tp-yt-iron-overlay-backdrop");
            const popup = document.querySelector(".style-scope ytd-enforcement-message-view-model");
            const popupButton = document.getElementById("dismiss-button");

            if (modalOverlay) modalOverlay.remove();
            if (popup) {
                if (popupButton) popupButton.click();
                popup.remove();
                document.querySelector('video').play();
            }
        }, 1000);
    }

    // Additional functions for quality control, etc., can be modularized similarly
})();
