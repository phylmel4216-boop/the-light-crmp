// ========================================
// THE LIGHT CRMP
// MANAGEMENT AUTHENTICATION
// ========================================

import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ========================================
// SUPABASE
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
// MANAGEMENT LOGIN
// ========================================

const managementLoginForm =
    document.getElementById(
        "managementLoginForm"
    );


if (managementLoginForm) {

    managementLoginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document
                    .getElementById(
                        "managementEmail"
                    )
                    .value
                    .trim();

            const password =
                document
                    .getElementById(
                        "managementPassword"
                    )
                    .value;

            const message =
                document.getElementById(
                    "managementMessage"
                );


            message.textContent =
                "Checking management account...";


            try {

                // ========================================
                // LOGIN
                // ========================================

                const { data, error } =
                    await supabase.auth
                        .signInWithPassword({

                            email: email,

                            password: password

                        });


                if (error) {

                    console.error(
                        "Management login error:",
                        error
                    );

                    message.textContent =
                        error.message;

                    return;
                }


                // ========================================
                // GET PROFILE
                // ========================================

                const { data: profile, error: profileError } =
                    await supabase
                        .from("profiles")
                        .select(
                            "id, username, role"
                        )
                        .eq(
                            "id",
                            data.user.id
                        )
                        .single();


                if (profileError) {

                    console.error(
                        "Profile error:",
                        profileError
                    );

                    await supabase.auth.signOut();

                    message.textContent =
                        "Unable to verify management account.";

                    return;
                }


                // ========================================
                // CHECK MANAGER ROLE
                // ========================================

                if (
                    !profile ||
                    profile.role !== "manager"
                ) {

                    await supabase.auth.signOut();

                    message.textContent =
                        "Access denied. This account is not a management account.";

                    return;
                }


                // ========================================
                // SUCCESS
                // ========================================

                message.textContent =
                    "Management login successful!";


                setTimeout(function () {

                    window.location.href =
                        "./management-dashboard.html";

                }, 700);


            } catch (error) {

                console.error(
                    "Unexpected management error:",
                    error
                );

                message.textContent =
                    "Something went wrong. Please try again.";

            }

        }
    );
}