
(() => {
    const SUPABASE_URL = "https://sbwuvdfzeshvoovduboq.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_xgfzuys_8arH-sbc3g6xTA_MMFimzee";

    const authClient = window.supabase.createClient(
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

    window.authClient = authClient;

    async function updateNavbar() {
        const authArea = document.getElementById("auth-area");

        if (!authArea) return;

        const {
            data: { session }
        } = await authClient.auth.getSession();

        if (session?.user) {
            const user = session.user;

            const name =
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email.split("@")[0];

            authArea.innerHTML = `
                <a href="Profile.html" class="profile-button">
                    <span class="profile-icon">👤</span>
                    <span>${name}</span>
                </a>
                <button id="logout-btn" class="login-btn">
                    Log Out
                </button>
            `;

            document
                .getElementById("logout-btn")
                .addEventListener("click", async () => {
                    await authClient.auth.signOut();
                    window.location.href = "index.html";
                });
        }
    }

    updateNavbar();

    authClient.auth.onAuthStateChange(() => {
        updateNavbar();
    });
})();