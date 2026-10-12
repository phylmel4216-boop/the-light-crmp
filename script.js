// ========================================
// THE LIGHT | CRMP ROLEPLAY
// Main JavaScript
// ========================================


// 1. UPDATE THE COPYRIGHT YEAR

const yearElement = document.getElementById("currentYear");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// 2. SMOOTH SCROLL FOR WEBSITE NAVIGATION

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");

        if (targetId === "#") {
            event.preventDefault();
            return;
        }

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.replaceState(null, "", targetId);
        }
    });
});


// 3. WELCOME MESSAGE IN THE BROWSER CONSOLE

console.log("THE LIGHT CRMP ROLEPLAY website loaded successfully!");