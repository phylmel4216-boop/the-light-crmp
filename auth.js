// ========================================
// THE LIGHT CRMP
// SUPABASE AUTHENTICATION
// ========================================

import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
    "https://mepfggtjvuenkhtknojz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "YOUR_PUBLISHABLE_KEY_HERE";

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ========================================
// REGISTER
// ========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const username =
                document
                    .getElementById("registerUsername")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("registerPassword")
                    .value;

            const message =
                document.getElementById(
                    "registerMessage"
                );

            message.textContent =
                "Creating your account...";

            const { error } =
                await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            username: username
                        }
                    }
                });

            if (error) {

                message.textContent =
                    error.message;

                return;
            }

            message.textContent =
                "Registration successful! Check your email to confirm your account.";

            registerForm.reset();
        }
    );
}


// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;

            const message =
                document.getElementById(
                    "loginMessage"
                );

            message.textContent =
                "Logging in...";

            const { error } =
                await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {

                message.textContent =
                    error.message;

                return;
            }

            message.textContent =
                "Login successful!";

            setTimeout(function () {
                window.location.href =
                    "./index.html";
            }, 800);
        }
    );
}