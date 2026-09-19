
const SUPABASE_URL = "https://hgqrtjuccspzwagntnxj.supabase.co";

const SUPABASE_KEY = "sb_publishable_nLNI7mX50vhJZfz6xf9JaQ_HKw2usMf";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

function getCurrentUserId() {
    const telegramUserId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

 

    return telegramUserId
        ? String(telegramUserId)
        : "guest";
}
// ---------- VISIT TRACKING ----------

async function recordVisit(pageName) {

    const { error } = await supabaseClient
        .from("site_visits")
        .insert({
            page: pageName
        });

    if (error) {
        console.error("Visit tracking error:", error);
    }
}

recordVisit("home");
// ===============================
// XX CREATORHUB APP - COMMENTS FIX 2026
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
// Saves likes permanently to Supabase

document.addEventListener("click", async (event) => {

    const button = event.target.closest(".like-button");

    if (!button) return;

    const post = button.closest(".post");

    if (!post) return;

    const postId = post.dataset.postId;

    if (!postId) return;

    const likesElement =
        post.querySelector(".likes-count");

    if (!likesElement) return;

    const currentlyLiked =
        button.classList.contains("liked");

    // ---------- LIKE ----------

    if (!currentlyLiked) {

        const { error } =
            await supabaseClient
                .from("post_likes")
                .insert({
                    post_id: postId,
                    user_id: getCurrentUserId()
                });

        if (error) {

            // Already liked
            if (error.code === "23505") {

                button.classList.add("liked");
                button.textContent = "♥";

                return;
            }

            console.error(
                "Like insert error:",
                error
            );

            alert(
                "LIKE ERROR: " +
                error.message
            );

            return;
        }

        // Increase post like count
        const currentLikes =
            parseInt(
                likesElement.textContent.replace(/\D/g, "")
            ) || 0;

        const newLikes =
            currentLikes + 1;

        await supabaseClient
            .from("posts")
            .update({
                likes: newLikes
            })
            .eq("id", postId);

        button.classList.add("liked");
        button.textContent = "♥";

        likesElement.textContent =
            newLikes.toLocaleString() +
            " likes";

    }

    // ---------- UNLIKE ----------

    else {

        const { error } =
            await supabaseClient
                .from("post_likes")
                .delete()
                .eq("post_id", postId)
                .eq("user_id", getCurrentUserId());

        if (error) {

            console.error(
                "Unlike error:",
                error
            );

            alert(
                "UNLIKE ERROR: " +
                error.message
            );

            return;
        }

        // Decrease post like count
        const currentLikes =
            parseInt(
                likesElement.textContent.replace(/\D/g, "")
            ) || 0;

        const newLikes =
            Math.max(0, currentLikes - 1);

        await supabaseClient
            .from("posts")
            .update({
                likes: newLikes
            })
            .eq("id", postId);

        button.classList.remove("liked");
        button.textContent = "♡";

        likesElement.textContent =
            newLikes.toLocaleString() +
            " likes";
    }

});

// ---------- SAVE BUTTONS ----------

document.addEventListener("click", async (event) => {

    const button = event.target.closest(".save-button");

    if (!button) return;

    const post = button.closest(".post");

    if (!post) return;

 const postId = post.dataset.postId;
    


    if (!postId) {
        alert("Post ID not found");
        return;
    }

    const saved = button.classList.contains("saved");

    button.disabled = true;

    if (!saved) {

        // SAVE POST

        const { error } = await supabaseClient
            .from("saved_posts")
            .insert({
                post_id: postId,
                user_id: getCurrentUserId()
            });

        if (error) {

            console.error("Save error:", error);

            alert("Unable to save post: " + error.message);

            button.disabled = false;
            return;
        }

        button.classList.add("saved");
        button.textContent = "★";

    } else {

        // UNSAVE POST

        const { error } = await supabaseClient
            .from("saved_posts")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", getCurrentUserId());

        if (error) {

            console.error("Unsave error:", error);

            alert("Unable to unsave post: " + error.message);

            button.disabled = false;
            return;
        }

        button.classList.remove("saved");
        button.textContent = "♧";
    }

    button.disabled = false;

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
let currentExclusiveUrl = "";
const modal =
    document.getElementById("unlock-modal");

const closeModal =
    document.getElementById("close-modal");

function openUnlockModal(url) {

    currentExclusiveUrl = url || "";

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

document.addEventListener("click", (event) => {

    const button =
        event.target.closest('[data-action="exclusive"]');

    if (!button) return;

    const post =
        button.closest(".post");

    const url =
        button.dataset.exclusiveUrl ||
        post?.querySelector(".exclusive-button")?.dataset.exclusiveUrl ||
        "";

    openUnlockModal(url);

});

if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeUnlockModal
    );

}


// ---------- CONTINUE BUTTON ----------

const unlockButton =
    document.getElementById("unlock-button");

if (unlockButton) {

    unlockButton.addEventListener("click", async () => {

        try {

            const AdController =
                window.Adsgram.init({
                    blockId: "45602"
                });

            await AdController.show();

// Record successful unlock
const { error: unlockError } = await supabaseClient
    .from("unlock_events")
    .insert({});

if (unlockError) {
    console.error("Unlock tracking error:", unlockError);
}

const loadingScreen =
    document.getElementById("exclusive-loading");
if (loadingScreen) {
    loadingScreen.style.display = "flex";
}

if (currentExclusiveUrl) {

    closeUnlockModal();

    window.location.href = currentExclusiveUrl;

} else {
    alert("No exclusive content link found.");
}


        } catch (error) {

            console.error(
                "AdsGram error:",
                error
            );

            alert(
                "The ad could not be loaded. Please try again."
            );

        }

    });

}


// ---------- SEARCH BUTTON ----------

const searchButton =
    document.querySelector(".search-button");

if (searchButton) {

    searchButton.addEventListener("click", () => {

        const searchModal =
            document.getElementById("search-modal");

        if (searchModal) {

            searchModal.classList.add("open");

            const input =
                document.getElementById(
                    "creator-search-input"
                );

            if (input) {
                input.value = "";

                setTimeout(
                    () => input.focus(),
                    100
                );
            }
        }

    });

}


// ---------- SEARCH MODAL CONTROLS ----------

const searchModal =
    document.getElementById("search-modal");

const closeSearchModal =
    document.getElementById("close-search-modal");

const searchSubmit =
    document.getElementById("creator-search-submit");

const searchInput =
    document.getElementById("creator-search-input");


if (closeSearchModal) {

    closeSearchModal.addEventListener(
        "click",
        () => {

            searchModal.classList.remove("open");

        }
    );

}


if (searchSubmit) {

    searchSubmit.addEventListener(
        "click",
        async () => {

            const term =
                searchInput.value.trim();

            if (!term) return;

            const { data, error } =
                await supabaseClient
                    .from("creators")
                    .select(`
                        id,
                        name,
                        username,
                        photo_url,
                        bio,
                        verified
                    `)
                    .or(
                        `name.ilike.%${term}%,username.ilike.%${term}%`
                    );

            if (error) {

                console.error(
                    "Creator search error:",
                    error
                );

                alert(
                    "Search failed. Please try again."
                );

                return;
            }

            if (!data || data.length === 0) {

                alert(
                    "No creator found for: " + term
                );

                return;
            }

            searchModal.classList.remove("open");

            const creator =
                data[0];

            showPage("creator-profile");

            loadCreatorPosts(
                creator.id
            );

            const nameElement =
                document.getElementById(
                    "creator-profile-name"
                );

            const usernameElement =
                document.getElementById(
                    "creator-profile-username"
                );

            const bioElement =
                document.getElementById(
                    "creator-profile-bio"
                );

            if (nameElement) {
                nameElement.textContent =
                    creator.name || "Creator";
            }

            if (usernameElement) {
                usernameElement.textContent =
                    creator.username || "";
            }

            if (bioElement) {
                bioElement.textContent =
                    creator.bio ||
                    "No bio available.";
            }

        }
    );

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

    const shareUrl =
    "https://t.me/XXCreatorhub_bot?startapp=post_" +
    post.dataset.postId;
    const telegramShareUrl =
        "https://t.me/share/url?url=" +
        encodeURIComponent(shareUrl) +
        "&text=" +
        encodeURIComponent(caption);

    window.location.href = telegramShareUrl;

});

// ===============================
// COMMENTS PANEL
// ===============================

let currentCommentPostId = null;

const commentsPanel =
    document.getElementById("comments-panel");

const commentsList =
    document.getElementById("comments-list");

const commentInput =
    document.getElementById("comment-input");

const submitComment =
    document.getElementById("submit-comment");

const closeComments =
    document.getElementById("close-comments");


// ---------- OPEN COMMENTS ----------

document.addEventListener("click", async (event) => {

    const button =
        event.target.closest(".comment-button");

    if (!button) return;

    const post =
        button.closest(".post");

    if (!post) return;

    currentCommentPostId =
        post.dataset.postId;

    if (!currentCommentPostId) return;


    // Open panel

    commentsPanel.classList.add("show");

    document.body.style.overflow = "hidden";


    // Show loading

    commentsList.innerHTML = `
        <p class="comments-empty">
            Loading comments...
        </p>
    `;


    // Load comments

    await loadComments(currentCommentPostId);

});


// ---------- LOAD COMMENTS ----------

async function loadComments(postId) {

    const { data, error } =
        await supabaseClient
            .from("comments")
            .select("id, comment, created_at")
            .eq("post_id", postId)
            .order("created_at", {
                ascending: true
            });


    if (error) {

        console.error(
            "Comments error:",
            error
        );

        commentsList.innerHTML = `
            <p class="comments-empty">
                Unable to load comments.
            </p>
        `;

        return;
    }


    if (!data || data.length === 0) {

        commentsList.innerHTML = `
            <p class="comments-empty">
                No comments yet.<br>
                Be the first to comment!
            </p>
        `;

        return;
    }


    commentsList.innerHTML =
        data.map(comment => {
const commentTime =
    new Date(comment.created_at).toLocaleString();

return `
    <div class="comment-item">
        <div class="comment-body">
            <strong class="comment-username">
                User
            </strong>

            <p>
                ${escapeComment(comment.comment)}
            </p>

            <small class="comment-time">
                ${commentTime}
            </small>
        </div>
    </div>
`;
        }).join("");


    // Scroll to newest comment

    commentsList.scrollTop =
        commentsList.scrollHeight;
}


// ---------- SEND COMMENT ----------

if (submitComment) {

    submitComment.addEventListener(
        "click",
        async () => {

            const text =
                commentInput.value.trim();


            if (!text) return;


            if (!currentCommentPostId) return;


            submitComment.disabled = true;


            const { error } =
                await supabaseClient
                    .from("comments")
                    .insert([
                        {
                            post_id:
                                currentCommentPostId,

                            comment:
                                text
                        }
                    ]);


            if (error) {

                console.error(
                    "Comment insert error:",
                    error
                );

                alert(
                    "Unable to post comment: " +
                    error.message
                );

                submitComment.disabled = false;

                return;
            }


            // Clear input

            commentInput.value = "";


            // Reload comments

            await loadComments(
                currentCommentPostId
            );


            submitComment.disabled = false;

        }
    );

}


// ---------- ENTER TO SEND ----------

if (commentInput) {

    commentInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                submitComment.click();

            }

        }
    );

}


// ---------- CLOSE COMMENTS ----------

if (closeComments) {

    closeComments.addEventListener(
        "click",
        () => {

            commentsPanel.classList.remove(
                "show"
            );

            document.body.style.overflow = "";

            currentCommentPostId = null;

        }
    );

}


// ---------- ESCAPE COMMENT HTML ----------

function escapeComment(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

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
// ---------- OPENING ADSGRAM AD ----------

(async function showOpeningAd() {

    try {

        const AdController = window.Adsgram.init({
            blockId: "45602"
        });

        await AdController.show();

        console.log("Opening ad completed.");

    } catch (error) {

        console.error("Opening AdsGram error:", error);

    }

})();

// ---------- START ----------

showPage("home");
async function loadRandomHomeCreator() {

    const { data, error } = await supabaseClient
        .from("posts")
        .select(`
            id,
            creator_id,
            image_url,
            creators (
                id,
                name,
                username,
                verified
            )
        `)
        .not("image_url", "is", null);

    if (error) {
        console.error("Random home post error:", error);
        return;
    }

    if (!data || data.length === 0) return;

    const post =
        data[Math.floor(Math.random() * data.length)];

    const creator = post.creators || {};

    const creatorCard =
        document.querySelector(".creator-card");

    if (!creatorCard) return;

    const imagePlaceholder =
        creatorCard.querySelector(".image-placeholder");

    const creatorName =
        creatorCard.querySelector(".creator-info h2");

    const creatorUsername =
        creatorCard.querySelector(".creator-info p");

    const verified =
        creatorCard.querySelector(".verified");

    const exclusiveButton =
        creatorCard.querySelector(".watch-button");

    if (imagePlaceholder) {

        imagePlaceholder.innerHTML = "";

        const img = document.createElement("img");

        img.src = post.image_url;

        img.alt =
            creator.name || "Creator";

        imagePlaceholder.appendChild(img);
    }

    if (creatorName) {
        creatorName.textContent =
            creator.name || "Creator";
    }

    if (creatorUsername) {
        creatorUsername.textContent =
            creator.username || "";
    }

    if (verified) {
        verified.style.display =
            creator.verified ? "block" : "none";
    }

    if (exclusiveButton) {
        exclusiveButton.dataset.exclusiveUrl =
            `exclusive.html?creator=${post.creator_id}`;
    }
}

async function loadSharedHomePost() {
console.log(
    "START PARAM:",
    window.Telegram?.WebApp?.initDataUnsafe?.start_param,
    new URLSearchParams(window.location.search)
        .get("tgWebAppStartParam")
);
    const startParam =
        window.Telegram?.WebApp?.initDataUnsafe?.start_param;

    if (!startParam || !startParam.startsWith("post_")) {
        loadRandomHomeCreator();
        return;
    }

    const postId =
        startParam.replace("post_", "");

    const { data: post, error } =
        await supabaseClient
            .from("posts")
            .select(`
                id,
                creator_id,
                image_url,
                creators (
                    id,
                    name,
                    username,
                    verified
                )
            `)
            .eq("id", postId)
            .single();

    if (error || !post) {
        console.error(
            "Shared post loading error:",
            error
        );

        loadRandomHomeCreator();
        return;
    }

    const creator =
        post.creators || {};

    const creatorCard =
        document.querySelector(".creator-card");

    if (!creatorCard) return;

    const imagePlaceholder =
        creatorCard.querySelector(".image-placeholder");

    const creatorName =
        creatorCard.querySelector(".creator-info h2");

    const creatorUsername =
        creatorCard.querySelector(".creator-info p");

    const verified =
        creatorCard.querySelector(".verified");

    const exclusiveButton =
        creatorCard.querySelector(".watch-button");

    if (imagePlaceholder) {

        imagePlaceholder.innerHTML = "";

        const img =
            document.createElement("img");

        img.src = post.image_url;

        img.alt =
            creator.name || "Creator";

        imagePlaceholder.appendChild(img);
    }

    if (creatorName) {
        creatorName.textContent =
            creator.name || "Creator";
    }

    if (creatorUsername) {
        creatorUsername.textContent =
            creator.username || "";
    }

    if (verified) {
        verified.style.display =
            creator.verified
                ? "block"
                : "none";
    }

    if (exclusiveButton) {
        exclusiveButton.dataset.exclusiveUrl =
            `exclusive.html?creator=${post.creator_id}`;
    }
}

loadSharedHomePost();


// ---------- HOME DISCOVER PREVIEW ----------

async function loadHomeDiscoverPreview() {

    const container =
        document.getElementById("home-discover-posts");

    if (!container) return;

    const { data, error } = await supabaseClient
        .from("posts")
        .select(`
            id,
            image_url,
            caption,
            creator_id,
            creators (
                name,
                username,
                photo_url,
                verified
            )
        `)
        .order("created_at", {
            ascending: false
        })
        .limit(2);

    if (error) {
        console.error(
            "Home discover preview error:",
            error
        );
        container.innerHTML = "";
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML =
            "<p>No posts yet.</p>";
        return;
    }

    container.innerHTML = data.map(post => {

        const creator =
            post.creators || {};

        return `
            <article
    class="home-preview-post"
    data-page="discover"
    onclick="showPage('discover')"
>

                <div class="home-preview-image">
                    ${
                        post.image_url
                            ? `<img
                                src="${post.image_url}"
                                alt="${post.caption || "Creator post"}"
                              >`
                            : "CREATOR PHOTO"
                    }
                </div>

                <div class="home-preview-info">

                    <strong>
                        ${creator.name || "Creator"}
                    </strong>

                    <span>
                        ${creator.username || ""}
                    </span>

                </div>

            </article>
        `;

    }).join("");

}

loadHomeDiscoverPreview();
// ===============================
// SUPABASE POSTS
// ===============================

async function loadPosts(isRefresh = false) {
    const postsContainer = document.getElementById("posts-container");

    if (!postsContainer) return;
    const { data: savedPosts, error: savedPostsError } =
    await supabaseClient
        .from("saved_posts")
        .select("post_id")
        .eq("user_id", "guest");
    const { data: likedPosts, error: likedPostsError } =
    await supabaseClient
        .from("post_likes")
        .select("post_id")
        .eq("user_id", getCurrentUserId());
    const likedPostIds = new Set(
    (likedPosts || []).map(
        item => String(item.post_id)
    )
);

if (savedPostsError) {
    console.error("Saved posts error:", savedPostsError);
   
}

const savedPostIds = new Set(
    (savedPosts || []).map(item => String(item.post_id))
);

    
    console.log("Saved posts:", savedPosts);
console.log("Saved post IDs:", savedPostIds);
    
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
    if (isRefresh && data) {
    data.sort(() => Math.random() - 0.5);
            }
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
            
<article class="post" data-post-id="${post.id}">
                <div class="post-header">

                    <div
    class="avatar creator-click"
    data-creator-id="${creator.id}"
>
    ${photo
        ? `<img src="${photo}" alt="${name}">`
        : name.charAt(0).toUpperCase()
    }
</div>

                    <div
    class="creator-details creator-click"
    data-creator-id="${creator.id}"
>

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

                    <button
    class="like-button ${likedPostIds.has(String(post.id)) ? "liked" : ""}"
    aria-label="Like"
>
    ${likedPostIds.has(String(post.id)) ? "♥" : "♡"}
</button>
                    <button class="comment-button" aria-label="Comments">
    💬
</button>

                    <button class="share-button" aria-label="Share">
                        ↗
                    </button>

                    <button
    class="save-button ${savedPostIds.has(String(post.id)) ? "saved" : ""}"
    aria-label="Save"
>
    ${savedPostIds.has(String(post.id)) ? "★" : "♧"}
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
                        data-exclusive-url="exclusive.html?creator=${post.creator_id}"
                    >
                        🔒 See Exclusive Content
                    </button>

                </div>

            </article>
        `;
    }).join("");
}
// ---------- LOAD SAVED POSTS ----------

async function loadSavedPosts() {

    const container =
        document.getElementById("saved-posts-container");

    if (!container) return;

    const { data: savedPosts, error } =
        await supabaseClient
            .from("saved_posts")
            .select("post_id")
            .eq("user_id", getCurrentUserId());

    if (error) {

        console.error(
            "Saved posts loading error:",
            error
        );

        return;
    }

    if (!savedPosts || savedPosts.length === 0) {

        container.innerHTML = `
            <div class="empty-page">

                <div class="empty-icon">
                    ♡
                </div>

                <h2>
                    No saved posts
                </h2>

                <p>
                    Posts you save will appear here.
                </p>

            </div>
        `;

        return;
    }

    const savedIds =
        savedPosts.map(item => item.post_id);

    const { data: posts, error: postsError } =
        await supabaseClient
            .from("posts")
            .select(`
                id,
                created_at,
                image_url,
                caption,
                likes,
                creator_id,
                creators (
                    id,
                    name,
                    username,
                    photo_url,
                    verified
                )
            `)
            .in("id", savedIds)
            .order("created_at", {
                ascending: false
            });

    if (postsError) {

        console.error(
            "Saved post details error:",
            postsError
        );

        return;
    }

    container.innerHTML =
        posts.map(post => {

            const creator =
                post.creators || {};

            return `
                <article
                    class="post"
                    data-post-id="${post.id}"
                >

                    <div class="post-header">

                        <div class="avatar">
                            ${
                                creator.photo_url
                                    ? `<img
                                        src="${creator.photo_url}"
                                        alt="${creator.name || "Creator"}"
                                      >`
                                    : (creator.name || "C")
                                        .charAt(0)
                                        .toUpperCase()
                            }
                        </div>

                        <div class="creator-details">

                            <strong>
                                ${creator.name || "Creator"}
                                ${creator.verified ? " ✓" : ""}
                            </strong>

                            <small>
                                ${creator.username || ""}
                            </small>

                        </div>

                    </div>

                    <div class="post-image">

                        ${
                            post.image_url
                                ? `<img
                                    src="${post.image_url}"
                                    alt="${post.caption || "Saved post"}"
                                  >`
                                : "CREATOR PHOTO"
                        }

                    </div>

                    <div class="post-content">

                        <strong class="likes-count">
                            ${Number(post.likes || 0).toLocaleString()} likes
                        </strong>

                        <p class="caption">
                            ${post.caption || ""}
                        </p>

                        <small class="post-time">
                            ${new Date(
                                post.created_at
                            ).toLocaleDateString()}
                        </small>

                    </div>

                </article>
            `;

        }).join("");
}
// ---------- PROFILE STATS ----------

async function loadProfileStats() {

    const { count, error } = await supabaseClient
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", getCurrentUserId());

    if (error) {
        console.error("Profile liked count error:", error);
        return;
    }

    const likedCount =
        document.getElementById("profile-liked-count");

    if (likedCount) {
        likedCount.textContent = count || 0;
    }
}

// Load posts when the app starts
document.addEventListener("DOMContentLoaded", loadPosts);
document.addEventListener(
    "DOMContentLoaded",
    loadSavedPosts
);
// ---------- REFRESH POSTS ----------

const refreshPostsButton =
    document.getElementById("refresh-posts");

if (refreshPostsButton) {

    refreshPostsButton.addEventListener("click", async () => {

        refreshPostsButton.textContent = "↻";

        await loadPosts(true);

        refreshPostsButton.textContent = "↻";

    });

}
// ===============================
// CREATOR PROFILE CLICK
// ===============================

document.addEventListener("click", async (event) => {

    const creatorElement =
        event.target.closest(".creator-click");

    if (!creatorElement) return;

    const creatorId =
        creatorElement.dataset.creatorId;

    if (!creatorId) return;

    showPage("creator-profile");
    loadCreatorPosts(creatorId);

    // Load creator information
    const { data: creator, error } =
        await supabaseClient
            .from("creators")
            .select(`
                id,
                name,
                username,
                photo_url,
                bio,
                verified
            `)
            .eq("id", creatorId)
            .single();

    if (error) {

        console.error(
            "Creator profile error:",
            error
        );

        return;
    }

    if (!creator) return;

    // Creator name
    document.getElementById(
        "creator-profile-name"
    ).textContent =
        creator.name || "Creator";


    // Username
    document.getElementById(
        "creator-profile-username"
    ).textContent =
        creator.username || "";


    // Bio
    document.getElementById(
        "creator-profile-bio"
    ).textContent =
        creator.bio || "No bio available.";


    // Verified
    const verified =
        document.getElementById(
            "creator-profile-verified"
        );

    if (creator.verified) {

        verified.style.display =
            "inline-block";

    } else {

        verified.style.display =
            "none";

    }


    // Profile photo
    const avatar =
        document.getElementById(
            "creator-profile-avatar"
        );

    if (creator.photo_url) {

        avatar.innerHTML = `
            <img
                src="${creator.photo_url}"
                alt="${creator.name || "Creator"}"
            >
        `;

    } else {

        avatar.textContent =
            (creator.name || "C")
                .charAt(0)
                .toUpperCase();

    }

});
// ===============================
// LOAD CREATOR POSTS
// ===============================

async function loadCreatorPosts(creatorId) {

    const container =
        document.getElementById("creator-posts-container");

    if (!container) return;

    container.innerHTML = `
        <div class="empty-page">
            <div class="empty-icon">✨</div>
            <h2>Loading posts...</h2>
            <p>Please wait.</p>
        </div>
    `;


    const { data, error } =
        await supabaseClient
            .from("posts")
            .select(`
                id,
                created_at,
                image_url,
                caption,
                likes,
                exclusive_url
            `)
            .eq("creator_id", creatorId)
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(
            "Creator posts error:",
            error
        );

        container.innerHTML = `
            <div class="empty-page">
                <div class="empty-icon">⚠️</div>
                <h2>Unable to load posts</h2>
                <p>Please try again later.</p>
            </div>
        `;

        return;
    }


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-page">
                <div class="empty-icon">✨</div>
                <h2>No posts yet</h2>
                <p>This creator hasn't posted anything yet.</p>
            </div>
        `;

        return;
    }


    container.innerHTML = data.map(post => {

        return `
            <article class="post">

                <div class="post-image">

                    ${post.image_url
                        ? `<img
                            src="${post.image_url}"
                            alt="${post.caption || "Creator post"}"
                        >`
                        : "CREATOR PHOTO"
                    }

                </div>


                <div class="post-actions">

                    <button
                        class="like-button"
                        aria-label="Like"
                    >
                        ♡
                    </button>

                    <button
                        class="comment-button"
                        aria-label="Comments"
                    >
                        💬
                    </button>

                    <button
                        class="share-button"
                        aria-label="Share"
                    >
                        ↗
                    </button>

                    <button
                        class="save-button"
                        aria-label="Save"
                    >
                        ♧
                    </button>

                </div>


                <div class="post-content">

                    <strong class="likes-count">
                        ${Number(post.likes || 0).toLocaleString()} likes
                    </strong>

                    <p class="caption">
                        ${post.caption || ""}
                    </p>

                    <small class="post-time">
                        ${new Date(
                            post.created_at
                        ).toLocaleDateString()}
                    </small>

                </div>

            </article>
        `;

    }).join("");


    // Update profile stats

    const postCount =
        document.getElementById(
            "creator-post-count"
        );

    if (postCount) {
        postCount.textContent = data.length;
    }


    const totalLikes =
        data.reduce(
            (total, post) =>
                total + Number(post.likes || 0),
            0
        );

    const likesElement =
        document.getElementById(
            "creator-total-likes"
        );

    if (likesElement) {
        likesElement.textContent =
            totalLikes.toLocaleString();
    }

        }
document
    .getElementById("back-to-discover")
    ?.addEventListener("click", () => {

        showPage("discover");

    });
loadProfileStats();
