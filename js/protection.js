/**
 * Grats — UAE Gratuity Calculator
 * Console branding + automatic copyright year.
 *
 * The copyright year is derived at runtime from the visitor's clock, so the
 * footer never needs manual maintenance as the calendar turns over.
 */
(function () {
    "use strict";

    var year = new Date().getFullYear();

    console.log(
        "%c🧮 UAE Gratuity Calculator",
        "color: #007AFF; font-size: 20px; font-weight: bold;"
    );
    console.log(
        "%c© " + year + " Grats by Ramon Logan Jr. All Rights Reserved.",
        "color: #8E8E93; font-size: 12px;"
    );
    console.log(
        "%chttps://grats.ramonloganjr.com",
        "color: #007AFF; font-size: 11px;"
    );

    function applyDynamicYear() {
        var el = document.getElementById("copyright-year");
        if (el) {
            el.textContent = String(year);
        }

        var logo = document.querySelector(".logo-image");
        if (logo) {
            logo.setAttribute("draggable", "false");
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyDynamicYear);
    } else {
        applyDynamicYear();
    }
})();
