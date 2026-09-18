
const SUPABASE_URL = "https://sbwuvdfzeshvoovduboq.supabase.co";

// Copy your existing Publishable key from login.js
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xgfzuys_8arH-sbc3g6xTA_MMFimzee";

const sellerSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const productForm = document.getElementById("productForm");

productForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const {
        data: { user }
    } = await sellerSupabase.auth.getUser();

    if (!user) {
        alert("Please log in before adding a product.");
        window.location.href = "login.html";
        return;
    }

    const productName = document.getElementById("productName").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const imageUrl = document.getElementById("imageUrl").value;
    const startingPrice = Number(document.getElementById("startingPrice").value);
    const bidIncrement = Number(document.getElementById("bidIncrement").value);
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    const startDate = new Date(startTime);
const endDate = new Date(endTime);

if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    alert("Please select valid auction start and end times.");
    return;
}

if (endDate <= startDate) {
    alert("Auction end time must be after the start time.");
    return;
}
    

    const { error } = await sellerSupabase
        .from("auctions")
        .insert([
            {
                seller_id: user.id,
                title: productName,
                description: description,
                category: category,
                image_url: imageUrl || null,
                starting_price: startingPrice,
                current_bid: startingPrice,
                bid_increment: bidIncrement,
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
                status: "scheduled"
            }
        ]);

    if (error) {
        console.error("Product upload error:", error);
        alert("Could not add product: " + error.message);
        return;
    }

    alert("Product added successfully! ♡");
    productForm.reset();
});