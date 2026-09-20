
const SUPABASE_URL = "https://sbwuvdfzeshvoovduboq.supabase.co";

// Copy the same Publishable key from seller-dashboard.js
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xgfzuys_8arH-sbc3g6xTA_MMFimzee";

const auctionSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const auctionGrid = document.querySelector(".auction-grid");
const categoryButtons = document.querySelectorAll(".auction-category");

let allProducts = [];

async function loadSellerProducts() {
    const { data, error } = await auctionSupabase
        .from("auctions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Could not load products:", error);
        return;
    }

        allProducts = data || [];

        auctionGrid.innerHTML = "";

        allProducts.forEach(product => {
        const card = createProductCard(product);
        auctionGrid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "auction-card";
    card.dataset.id = product.id;
    card.dataset.category = product.category || "";

    const image = product.image_url
        ? `<img src="${product.image_url}" alt="${product.title}" style="width:100%;height:190px;object-fit:cover;border-radius:20px;">`
        : "✨";

    card.innerHTML = `
        <div class="auction-image">
            ${image}
        </div>

        <div class="auction-tag">
            ${(product.category || "OTHER").toUpperCase()}
        </div>

        <h2>${product.title}</h2>

        <p>${product.description || "A beautiful treasure waiting for its next owner."}</p>

        <div class="auction-bottom">
            <div>
                <span class="bid-label">STARTING PRICE</span>
        <span class="bid-price dynamic-bid-price">
         ₹${Number(product.current_bid || product.starting_price).toLocaleString("en-IN")}
</span>
            </div>

            <a href="collector-bid.html?id=${encodeURIComponent(product.id)}"
   class="bid-button">
  Place Bid

</a>
        </div>
    `;

    return card;
}

categoryButtons.forEach(button => {
    button.addEventListener("click", function () {
        const selectedCategory = this.textContent.trim().toLowerCase();

        categoryButtons.forEach(item => item.classList.remove("active"));
        this.classList.add("active");

        const staticCards = document.querySelectorAll(
            ".auction-grid > .auction-card:not([data-category])"
        );

        const dynamicCards = document.querySelectorAll(
            ".auction-grid > .auction-card[data-category]"
        );

        if (selectedCategory === "all") {
            staticCards.forEach(card => card.style.display = "");
            dynamicCards.forEach(card => card.style.display = "");
            return;
        }

        staticCards.forEach(card => {
            const tag = card.querySelector(".auction-tag");
            const category = tag ? tag.textContent.trim().toLowerCase() : "";

            card.style.display =
                category.includes(selectedCategory) ? "" : "none";
        });

        dynamicCards.forEach(card => {
            const category = card.dataset.category.toLowerCase();

            card.style.display =
                category === selectedCategory ? "" : "none";
        });
    });
});

loadSellerProducts();
async function refreshBidPrices() {
    const { data, error } = await auctionSupabase
        .from("auctions")
        .select("title, current_bid, starting_price");

    if (error || !data) return;

    document.querySelectorAll(".auction-card").forEach(card => {
        const titleElement = card.querySelector("h2");
        const priceElement = card.querySelector(".bid-price");

        if (!titleElement || !priceElement) return;

        const auction = data.find(item =>
            item.title.trim() === titleElement.textContent.trim()
        );

        if (auction) {
            priceElement.textContent =
                "₹" + Number(
                    auction.current_bid || auction.starting_price
                ).toLocaleString("en-IN");
        }
    });
}

setInterval(refreshBidPrices, 3000);
refreshBidPrices();