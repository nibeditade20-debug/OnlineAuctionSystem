console.log("REGISTER JS IS WORKING");

// ==========================================
// AUCTION AURA - REGISTRATION
// ==========================================

const SUPABASE_URL = "https://sbwuvdfzeshvoovduboQ.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xgfzuys_8arH-sbc3g6xTA_MMFimzee";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ==========================================
// REGISTRATION FORM
// ==========================================

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check passwords
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }


    // Create account
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: name
            }
        }
    });


    // Registration failed
    if (error) {
        alert("Registration failed: " + error.message);
        return;
    }


    // Registration successful
    alert(
        "Account created successfully! 💗 " +
        "Please check your email to confirm your account."
    );

    window.location.href = "login.html";

});