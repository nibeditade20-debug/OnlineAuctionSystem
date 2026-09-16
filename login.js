(() => {

    // ============================================
    // AUCTION AURA - LOGIN
    // Supabase Authentication
    // ============================================

    // Your Supabase project details
   const SUPABASE_URL = "https://sbwuvdfzeshvoovduboq.supabase.co";
    const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xgfzuys_8arH-sbc3g6xTA_MMFimzee";
        

    // ============================================
    // CREATE SUPABASE CLIENT
    // ============================================

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );


    // ============================================
    // LOGIN FORM
    // ============================================

    const loginForm = document.querySelector("form");

    if (loginForm) {

        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();


            // Get email and password
            const emailInput =
                document.querySelector('input[type="email"]');

            const passwordInput =
                document.querySelector('input[type="password"]');


            if (!emailInput || !passwordInput) {
                alert("Email or password field not found.");
                return;
            }


            const email = emailInput.value.trim();
            const password = passwordInput.value;


            // Check empty fields
            if (!email || !password) {
                alert("Please enter your email and password.");
                return;
            }


            // ============================================
            // SIGN IN USING SUPABASE
            // ============================================

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });


            // ============================================
            // ERROR
            // ============================================

            if (error) {

                console.error("Login error:", error);

                alert(error.message);

                return;
            }


            // ============================================
            // SUCCESS
            // ============================================

            if (data && data.user) {

                console.log("Logged in user:", data.user);

                alert("Welcome back to AuctionAura! 💗");

                window.location.href = "index.html";
            }

        });

    }

    // ============================================
// UPDATE NAVBAR WHEN USER IS LOGGED IN
// ============================================

async function updateNavbar() {

    const authArea = document.getElementById("auth-area");

    if (!authArea) return;

    const { data: { session } } =
        await supabaseClient.getSession();

    if (session && session.user) {

        const user = session.user;

        // Get person's name from registration information
        const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email.split("@")[0];

        authArea.innerHTML = `
            <a href="profile.html" class="profile-button">
                <span class="profile-icon">👤</span>
                <span>${name}</span>
            </a>
        `;
    }
}


// Check user when page loads
updateNavbar();


// Update navbar whenever login/logout happens
supabaseClient.auth.onAuthStateChange(() => {
    updateNavbar();
});

})();