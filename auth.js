// ========================================
// THE LIGHT CRMP
// SUPABASE PLAYER AUTHENTICATION
// ========================================

import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ========================================
// SUPABASE CONFIGURATION
// ========================================

const SUPABASE_URL =
    "https://mepfggtjvuenkhtknojz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_xmt_xMOhEGhmq6Yw9oBnsg_1wujHnVq";


const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ========================================
// REGISTER PLAYER
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

            message.textContent = "";


            if (
                username.length < 3 ||
                username.length > 24
            ) {

                message.textContent =
                    "Username must be between 3 and 24 characters.";

                return;
            }


            if (password.length < 6) {

                message.textContent =
                    "Password must contain at least 6 characters.";

                return;
            }


            message.textContent =
                "Creating your account...";


            try {

                const { data, error } =
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

                    console.error(
                        "Registration error:",
                        error
                    );

                    message.textContent =
                        error.message;

                    return;
                }


                console.log(
                    "Registration successful:",
                    data
                );


                message.textContent =
                    "Registration successful! Check your email to confirm your account.";

                registerForm.reset();


            } catch (error) {

                console.error(
                    "Unexpected registration error:",
                    error
                );

                message.textContent =
                    "Something went wrong. Please try again.";

            }

        }
    );
}


// ========================================
// LOGIN PLAYER
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


            try {

                const { data, error } =
                    await supabase.auth.signInWithPassword({

                        email: email,

                        password: password

                    });


                if (error) {

                    console.error(
                        "Login error:",
                        error
                    );

                    message.textContent =
                        error.message;

                    return;
                }


                console.log(
                    "Login successful:",
                    data
                );


                message.textContent =
                    "Login successful!";


                setTimeout(function () {

                    window.location.href =
                        "./index.html";

                }, 800);


            } catch (error) {

                console.error(
                    "Unexpected login error:",
                    error
                );

                message.textContent =
                    "Something went wrong. Please try again.";

            }

        }
    );
}