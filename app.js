const SUPABASE_URL = "https://hgqrtjuccspzwagntnxj.supabase.co";

const SUPABASE_KEY = "sb_publishable_nLNI7mX50vhJZfz6xf9JaQ_HKw2usMf";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ===============================
// XX CREATORHUB APP
// ===============================


// ---------- PAGE NAVIGATION ----------

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".nav-button");
const pageButtons = document.querySelectorAll("[data-page]");

function showPage(pageName) {

    pages.forEach((page) => {
        page.classList.remove("active-page");
    });

    const selectedPage =
        document.getElementById(`${pageName}-page`);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    navButtons.forEach((button) => {
        button.classList.remove("active");

        if (button.dataset.page === pageName) {
            button.classList.add("active");
        }
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


pageButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const pageName = button.dataset.page;

        if (pageName) {
            showPage(pageName);
        }

    });

});


// ---------- LIKE BUTTONS ----------

const likeButtons =
    document.querySelectorAll(".like-button");

likeButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const post = button.closest(".post");

        const likesElement =
            post.querySelector(".likes-count");

        const currentlyLiked =
            button.classList.contains("liked");

        let currentLikes =
            parseInt(
                likesElement.textContent.replace(/\D/g, "")
            ) || 0;


        if (!currentlyLiked) {

            button.classList.add("liked");

            button.textContent = "♥";

            currentLikes++;

        } else {

            button.classList.remove("liked");

            button.textContent = "♡";

            currentLikes--;

        }


        likesElement.textContent =
            currentLikes.toLocaleString() + " likes";

    });

});


// ---------- SAVE BUTTONS ----------

const saveButtons =
    document.querySelectorAll(".save-button");

saveButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const saved =
            button.classList.toggle("saved");

        if (saved) {

            button.textContent = "★";

        } else {

            button.textContent = "♧";

        }

    });

});


// ---------- FILTER BUTTONS ----------

const filters =
    document.querySelectorAll(".filter");

filters.forEach((filter) => {

    filter.addEventListener("click", () => {

        filters.forEach((item) => {
            item.classList.remove("active");
        });

        filter.classList.add("active");

    });

});


// ---------- EXCLUSIVE CONTENT MODAL ----------

const modal =
    document.getElementById("unlock-modal");

const closeModal =
    document.getElementById("close-modal");

const unlockButtons =
    document.querySelectorAll(
        '[data-action="exclusive"]'
    );


function openUnlockModal() {

    if (modal) {
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
    }

}


function closeUnlockModal() {

    if (modal) {
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }

}


unlockButtons.forEach((button) => {

    button.addEventListener("click", () => {
        openUnlockModal();
    });

});


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeUnlockModal
    );

}


// Close modal when tapping outside it

if (modal) {

    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            closeUnlockModal();
        }

    });

}


// ---------- CONTINUE BUTTON ----------

const unlockButton =
    document.getElementById("unlock-button");

if (unlockButton) {

    unlockButton.addEventListener("click", () => {

        alert(
            "AdsGram will be connected here."
        );

    });

}


// ---------- SEARCH BUTTON ----------

const searchButton =
    document.querySelector(".search-button");

if (searchButton) {

    searchButton.addEventListener("click", () => {

        alert(
            "Creator search will be added here."
        );

    });

}


// ---------- TELEGRAM MINI APP ----------

// Telegram provides this object when the
// website is opened inside Telegram.

if (window.Telegram &&
    window.Telegram.WebApp) {

    const tg =
        window.Telegram.WebApp;

    tg.ready();

    tg.expand();

}


// ---------- START ----------

showPage("home");
