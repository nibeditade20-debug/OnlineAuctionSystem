
document.addEventListener("DOMContentLoaded", () => {
    // Remove login and register buttons
    document.querySelector(".nav-buttons")?.remove();

    const cards = document.querySelectorAll(".makeup-card");

    cards.forEach((card, index) => {
        const priceElement = card.querySelector(".price");
        const startingPrice = Number(
            priceElement.textContent.replace(/[^\d]/g, "")
        );

       let currentBid = startingPrice;

function updateCurrentBid() {
    const bidElements = card.querySelectorAll(
        ".makeup-current-bid, .current-bid"
    );

    bidElements.forEach(element => {
        element.innerHTML = `Current bid: ₹${currentBid.toLocaleString("en-IN")}`;
    });
}

        const controls = document.createElement("div");
        controls.className = "makeup-bid-controls";

        controls.innerHTML = `
          

            <button class="makeup-place-bid">
                Place Bid ♡
            </button>
        `;

        card.appendChild(controls);

        controls.querySelector(".makeup-place-bid")
            .addEventListener("click", () => {
                showDevilAnimation(() => {
                    openBidMonitor(card, currentBid, (newBid) => {
                        currentBid = newBid;

                        controls.querySelector("span").textContent =
                            currentBid.toLocaleString("en-IN");

                        showThanksAnimation();
                    });
                });
            });
    });
});

function showDevilAnimation(callback) {
    const overlay = document.createElement("div");
    overlay.className = "devil-overlay";

    overlay.innerHTML = `
        <p>POWERED BY</p>
        <h1>DEVIL WEARS PRADA</h1>
        <span>THE MAKEUP AUCTION</span>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.remove();
        callback();
    }, 5000);
}

function openBidMonitor(card, currentBid, onBid) {
    const modal = document.createElement("div");
    modal.className = "bid-monitor-modal";

    modal.innerHTML = `
        <div class="bid-monitor-box">
            <button class="close-monitor">×</button>

            <p class="monitor-label">VINTAGE BEAUTY AUCTION</p>
            <h2>${card.querySelector("h2").textContent}</h2>

            <p>Current bid</p>
            <h3>₹${currentBid.toLocaleString("en-IN")}</h3>

            <label>Enter your bid amount (₹)</label>
            <input type="number" min="${currentBid + 1}"
                   placeholder="Enter any amount">

            <button class="confirm-bid">
                Confirm Bid ♡
            </button>

            <p class="bid-error"></p>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".close-monitor").onclick = () => {
        modal.remove();
    };

    modal.querySelector(".confirm-bid").onclick = () => {
        const input = modal.querySelector("input");
        const newBid = Number(input.value);
        const error = modal.querySelector(".bid-error");

        if (!newBid || newBid <= currentBid) {
            error.textContent =
                "Your bid must be higher than the current bid.";
            return;
        }

        onBid(newBid);

// Update every Current bid text on this card
card.querySelectorAll("*").forEach(element => {
    if (
        element.children.length === 0 &&
        element.textContent.trim().startsWith("Current bid:")
    ) {
        element.textContent =
            `Current bid: ₹${newBid.toLocaleString("en-IN")}`;
    }
});

card.dataset.currentBid = newBid;
modal.remove();
    };
}

function showThanksAnimation() {
    const celebration = document.createElement("div");
    celebration.className = "thanks-animation";
    celebration.innerHTML = `
        <h1>THANKS, DEVIL ♡</h1>
        <div class="falling-items">
            💄 👠 💋 👜 ♡ 💄 👠 💋
        </div>
    `;

    document.body.appendChild(celebration);

    setTimeout(() => {
        celebration.remove();
    }, 5000);
}