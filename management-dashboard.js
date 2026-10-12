// ========================================
// THE LIGHT CRMP
// MANAGEMENT DASHBOARD
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
// HTML ELEMENTS
// ========================================

const welcome =
    document.getElementById("managerWelcome");

const logoutButton =
    document.getElementById("logoutButton");


// ========================================
// LOAD MANAGEMENT DASHBOARD
// ========================================

async function loadManagementDashboard() {

    try {

        // ========================================
        // CHECK LOGIN
        // ========================================

        const {
            data: {
                user
            },
            error: userError
        } = await supabase.auth.getUser();


        if (userError || !user) {

            window.location.href =
                "./management.html";

            return;
        }


        // ========================================
        // GET PROFILE
        // ========================================

        const {
            data: profile,
            error: profileError
        } = await supabase
            .from("profiles")
            .select(
                "id, username, role"
            )
            .eq(
                "id",
                user.id
            )
            .single();


        // ========================================
        // PROFILE ERROR
        // ========================================

        if (profileError || !profile) {

            console.error(
                "Profile error:",
                profileError
            );

            await supabase.auth.signOut();

            window.location.href =
                "./management.html";

            return;
        }


        // ========================================
        // CHECK MANAGER
        // ========================================

        if (profile.role !== "manager") {

            await supabase.auth.signOut();

            window.location.href =
                "./management.html";

            return;
        }


        // ========================================
        // SHOW DASHBOARD
        // ========================================

        if (welcome) {

            welcome.innerHTML =
                "<h2>Welcome, " +
                profile.username +
                "</h2>" +

                "<p>Management access confirmed.</p>" +

                "<p>Role: <strong>" +
                profile.role +
                "</strong></p>" +

                "<hr>" +

                "<h3>MANAGEMENT CONTROL PANEL</h3>" +

                "<p>👥 Players</p>" +

                "<p>🏢 Factions</p>" +

                "<p>💼 Jobs</p>" +

                "<p>📜 Rules</p>" +

                "<p>📰 News & Announcements</p>" +

                "<p>📥 Downloads</p>" +

                "<p>⚙️ Website Settings</p>";
        }


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        if (welcome) {

            welcome.textContent =
                "Unable to load management dashboard.";
        }
    }
}


// ========================================
// LOGOUT
// ========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            logoutButton.disabled = true;

            logoutButton.textContent =
                "LOGGING OUT...";


            const {
                error
            } = await supabase.auth.signOut();


            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                logoutButton.disabled = false;

                logoutButton.textContent =
                    "LOGOUT";

                return;
            }


            window.location.href =
                "./management.html";

        }
    );
}


// ========================================
// START
// ========================================

loadManagementDashboard();