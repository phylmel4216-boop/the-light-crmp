// ========================================
// THE LIGHT | CRMP ROLEPLAY
// MAIN JAVASCRIPT
// ========================================


// ================= SERVER =================

const serverIP = "188.127.241.74:4400";


// ================= COPYRIGHT =================

const yearElement =
    document.getElementById("currentYear");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


// ================= COPY SERVER IP =================

const copyButton =
    document.getElementById("copyIPButton");

const copyButton2 =
    document.getElementById("copyIPButton2");


function copyServerIP() {

    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(serverIP)
            .then(function () {

                alert(
                    "Server IP copied!\n\n" +
                    serverIP
                );

            })
            .catch(function () {

                alert(
                    "Server IP:\n\n" +
                    serverIP
                );

            });

    } else {

        alert(
            "Server IP:\n\n" +
            serverIP
        );

    }

}


if (copyButton) {

    copyButton.addEventListener(
        "click",
        copyServerIP
    );

}


if (copyButton2) {

    copyButton2.addEventListener(
        "click",
        copyServerIP
    );

}


// ================= SMOOTH NAVIGATION =================

const navigationLinks =
    document.querySelectorAll(
        'a[href^="#"]'
    );


navigationLinks.forEach(function (link) {

    link.addEventListener(
        "click",
        function (event) {

            const targetId =
                this.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {

                return;

            }


            const target =
                document.querySelector(
                    targetId
                );


            if (target) {

                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

});


// ================= CONSOLE =================

console.log(
    "THE LIGHT | CRMP ROLEPLAY loaded successfully."
);

console.log(
    "Server IP: " + serverIP
);