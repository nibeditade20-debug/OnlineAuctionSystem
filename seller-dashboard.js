

const SUPABASE_URL = "https://sbwuvdfzeshvoovduboq.supabase.co";

// Keep the same publishable key you already use in your current file.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xgfzuys_8arH-sbc3g6xTA_MMFimzee";

const sellerSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const productForm = document.getElementById("productForm");
const myProducts = document.getElementById("myProducts");

async function getCurrentUser() {
    const {
        data: { user },
        error
    } = await sellerSupabase.auth.getUser();

    if (error) {
        console.error("User check error:", error);
        return null;
    }

    return user;
}

async function loadMyProducts() {
    const user = await getCurrentUser();

    if (!user) {
        myProducts.innerHTML = `
            <div class="listing-placeholder">
                <p>Please sign in to manage your products.</p>
                <a href="login.html">Sign in ♡</a>
            </div>
        `;
        return;
    }

    const { data: products, error } = await sellerSupabase
        .from("auctions")
        .select(
            "id, title, category, starting_price, current_bid, start_time, end_time"
        )
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Could not load products:", error);

        myProducts.innerHTML = `
            <p>Could not load products: ${escapeHtml(error.message)}</p>
        `;

        return;
    }

    if (!products || products.length === 0) {
        myProducts.innerHTML = `
            <div class="listing-placeholder">
                <p>✦ Your listed products will appear here.</p>
                <p>Add your first product to get started.</p>
            </div>
        `;

        return;
    }

    myProducts.innerHTML = products.map(product => `
        <div style="
            border:1px solid #ead1da;
            border-radius:16px;
            padding:16px;
            margin-bottom:14px;
            background:#fffafa;
        ">
            <h4 style="margin:0 0 8px;color:#8e1738;">
                ${escapeHtml(product.title)}
            </h4>

            <p style="margin:5px 0;color:#8b6872;">
                Category: ${escapeHtml(product.category || "Other")}
            </p>

            <p style="margin:5px 0;color:#8b6872;">
                Starting price: ₹${Number(
                    product.starting_price || 0
                ).toLocaleString("en-IN")}
            </p>

            <p style="margin:5px 0;color:#8b6872;">
                Current bid: ₹${Number(
                    product.current_bid || 0
                ).toLocaleString("en-IN")}
            </p>

            <button
                class="delete-product-btn"
                data-id="${product.id}"
                style="
                    margin-top:10px;
                    padding:10px 16px;
                    border:0;
                    border-radius:20px;
                    background:#8e1738;
                    color:white;
                    cursor:pointer;
                "
            >
                Delete Product
            </button>
        </div>
    `).join("");

    document.querySelectorAll(".delete-product-btn").forEach(button => {
        button.addEventListener("click", () => {
            deleteProduct(button.dataset.id);
        });
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function deleteProduct(productId) {
    const user = await getCurrentUser();

    if (!user) {
        alert("Please sign in before deleting a product.");
        window.location.href = "login.html";
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const { error } = await sellerSupabase
        .from("auctions")
        .delete()
        .eq("id", productId)
        .eq("seller_id", user.id);

    if (error) {
        console.error("Delete error:", error);
        alert("Could not delete product: " + error.message);
        return;
    }

    alert("Product deleted successfully! ♡");

    await loadMyProducts();
}

productForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const user = await getCurrentUser();

    if (!user) {
        alert("Please log in before adding a product.");
        window.location.href = "login.html";
        return;
    }

    const productName = document
        .getElementById("productName")
        .value.trim();

    const description = document
        .getElementById("description")
        .value.trim();

    const category = document
        .getElementById("category")
        .value;

    const imageUrl = document
        .getElementById("imageUrl")
        .value.trim();

    const startingPrice = Number(
        document.getElementById("startingPrice").value
    );

    const bidIncrement = Number(
        document.getElementById("bidIncrement").value
    );
    const maxPrice = Number(
    document.getElementById("maxPrice").value
    );

    const startTime = document
        .getElementById("startTime")
        .value;

    const endTime = document
        .getElementById("endTime")
        .value;

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

    if (
    !productName ||
    !category ||
    startingPrice < 0 ||
    bidIncrement <= 0 ||
    maxPrice <= startingPrice
) {
    alert("Maximum price must be greater than starting price.");
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
                max_price: maxPrice,
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

    await loadMyProducts();
});

loadMyProducts();