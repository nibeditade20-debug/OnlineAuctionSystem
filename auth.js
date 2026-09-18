
(() => {
    const SUPABASE_URL =
        "https://sbwuvdfzeshvoovduboq.supabase.co";

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

    // Add professional styling
    const style = document.createElement("style");

    style.textContent = `
        .auth-area {
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: Arial, sans-serif;
        }

        .profile-button {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 10px 16px;
            border-radius: 25px;
            background: #f8dce8;
            color: #765468;
            text-decoration: none;
            font-family: Arial, sans-serif;
            font-size: 13px;
            font-weight: 600;
        }

        .profile-button:hover {
            background: #f2c6da;
        }

        .profile-icon {
            font-size: 15px;
        }

        .auth-logout {
            padding: 10px 17px;
            border: none;
            border-radius: 25px;
            background: #b987a2;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
        }

        .auth-logout:hover {
            background: #a66f8d;
        }

        .auth-login,
        .auth-register {
            padding: 10px 17px;
            border-radius: 25px;
            font-family: Arial, sans-serif;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
        }

        .auth-login {
            color: #765468;
            border: 1px solid #e5bfd1;
        }

        .auth-register {
            color: white;
            background: #b987a2;
        }
    `;

    document.head.appendChild(style);

    function getAuthArea() {
        let authArea = document.getElementById("auth-area");

        if (!authArea) {
            const header = document.querySelector("header");

            if (!header) return null;

            authArea = document.createElement("div");
            authArea.id = "auth-area";
            authArea.className = "auth-area";

            header.appendChild(authArea);
        }

        authArea.classList.add("auth-area");

        return authArea;
    }

    async function updateNavbar() {
        const authArea = getAuthArea();

        if (!authArea) return;

        const {
            data: { session }
        } = await authClient.auth.getSession();

        if (session?.user) {
            const user = session.user;

            const name =
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split("@")[0] ||
                "User";

            authArea.innerHTML = `
                <a href="Profile.html" class="profile-button">
                    <span class="profile-icon">👤</span>
                    <span>${name}</span>
                </a>

                <button class="auth-logout" id="logout-btn">
                    Log Out
                </button>
            `;

            document
                .getElementById("logout-btn")
                .addEventListener("click", async () => {
                    const { error } =
                        await authClient.auth.signOut();

                    if (error) {
                        alert(error.message);
                        return;
                    }

                    window.location.href = "index.html";
                });
        } else {
            authArea.innerHTML = `
                <a href="login.html" class="auth-login">
                    Log In
                </a>

                <a href="register.html" class="auth-register">
                    Register
                </a>
            `;
        }
    }

    updateNavbar();

    authClient.auth.onAuthStateChange(() => {
        updateNavbar();
    });
})();