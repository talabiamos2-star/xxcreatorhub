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

// Works for posts loaded dynamically from Supabase
document.addEventListener("click", (event) => {

    const button = event.target.closest(".like-button");

    if (!button) return;

    const post = button.closest(".post");

    if (!post) return;

    const likesElement =
        post.querySelector(".likes-count");

    if (!likesElement) return;

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

// ---------- SAVE BUTTONS ----------

// Works for posts loaded dynamically from Supabase
document.addEventListener("click", (event) => {

    const button = event.target.closest(".save-button");

    if (!button) return;

    const saved =
        button.classList.toggle("saved");

    if (saved) {

        button.textContent = "★";

    } else {

        button.textContent = "♧";

    }

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
// ---------- SHARE BUTTONS ----------

// Works for posts loaded dynamically from Supabase
document.addEventListener("click", (event) => {

    const button = event.target.closest(".share-button");

    if (!button) return;

    const post = button.closest(".post");

    if (!post) return;

    const caption =
        post.querySelector(".caption")?.textContent.trim() ||
        "Check out this creator post!";

    const shareUrl = window.location.href;

    const telegramShareUrl =
        "https://t.me/share/url?url=" +
        encodeURIComponent(shareUrl) +
        "&text=" +
        encodeURIComponent(caption);

    window.open(
        telegramShareUrl,
        "_blank"
    );

});
// ---------- COMMENT BUTTONS ----------

// Works for posts loaded dynamically from Supabase
document.addEventListener("click", (event) => {

    const button = event.target.closest(".comment-button");

    if (!button) return;

    const post = button.closest(".post");

    if (!post) return;

    const caption =
        post.querySelector(".caption")?.textContent.trim() ||
        "This post";

    alert(
        "Comments for: " + caption
    );

});
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
// ===============================
// SUPABASE POSTS
// ===============================

async function loadPosts() {
    const postsContainer = document.getElementById("posts-container");

    if (!postsContainer) return;

    const { data, error } = await supabaseClient
        .from("posts")
        .select(`
            id,
            created_at,
            creator_id,
            image_url,
            caption,
            likes,
            exclusive_url,
            creators (
                id,
                name,
                username,
                photo_url,
                bio,
                verified
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Supabase posts error:", error);

        postsContainer.innerHTML = `
            <div class="empty-page">
                <div class="empty-icon">⚠️</div>
                <h2>Unable to load posts</h2>
                <p>Please try again later.</p>
            </div>
        `;

        return;
    }

    if (!data || data.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-page">
                <div class="empty-icon">✨</div>
                <h2>No posts yet</h2>
                <p>New creator posts will appear here.</p>
            </div>
        `;

        return;
    }

    postsContainer.innerHTML = data.map(post => {

        const creator = post.creators || {};

        const name = creator.name || "Creator";
        const username = creator.username || "";
        const photo = creator.photo_url || "";
        const likes = Number(post.likes || 0).toLocaleString();
        const caption = post.caption || "";
        
        return `
            <article class="post">

                <div class="post-header">

                    <div class="avatar">
                        ${photo
                            ? `<img src="${photo}" alt="${name}">`
                            : name.charAt(0).toUpperCase()
                        }
                    </div>

                    <div class="creator-details">

                        <strong>
                            ${name}${creator.verified ? " ✓" : ""}
                        </strong>

                        <small>
                            ${username}
                        </small>

                    </div>

                    <button class="more-button">
                        •••
                    </button>

                </div>

                <div class="post-image">
                    ${post.image_url
                        ? `<img src="${post.image_url}" alt="${caption}">`
                        : "CREATOR PHOTO"
                    }
                </div>

                <div class="post-actions">

                    <button class="like-button" aria-label="Like">
                        ♡
                    </button>

                    <button class="comment-button" aria-label="Comments">
    💬
</button>

                    <button class="share-button" aria-label="Share">
                        ↗
                    </button>

                    <button class="save-button" aria-label="Save">
                        ♧
                    </button>

                </div>

                <div class="post-content">

                    <strong class="likes-count">
                        ${likes} likes
                    </strong>

                    <p class="caption">
                        ${caption}
                    </p>

                    <small class="post-time">
                        ${new Date(post.created_at).toLocaleDateString()}
                    </small>

                    <button
                        class="exclusive-button"
                        data-action="exclusive"
                        data-exclusive-url="${post.exclusive_url || ""}"
                    >
                        🔒 See Exclusive Content
                    </button>

                </div>

            </article>
        `;
    }).join("");
}


// Load posts when the app starts
document.addEventListener("DOMContentLoaded", loadPosts);
// ---------- REFRESH POSTS ----------

const refreshPostsButton =
    document.getElementById("refresh-posts");

if (refreshPostsButton) {

    refreshPostsButton.addEventListener("click", async () => {

        refreshPostsButton.textContent = "⟳";

        await loadPosts();

        refreshPostsButton.textContent = "↻";

    });

}
