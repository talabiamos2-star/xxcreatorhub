// ===============================
// XX CREATORHUB - APP JAVASCRIPT
// ===============================

// Like buttons
const likeButtons = document.querySelectorAll(".post-actions button");

likeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const isLiked = button.classList.toggle("liked");

        if (isLiked) {
            button.textContent = "♥";
            button.style.color = "#ff4f8b";
        } else {
            button.textContent = "♡";
            button.style.color = "#ffffff";
        }
    });
});


// Featured content button
const watchButton = document.querySelector(".watch-button");

if (watchButton) {
    watchButton.addEventListener("click", () => {
        alert("Exclusive content will open here.");
    });
}


// Exclusive content buttons
const exclusiveButtons =
    document.querySelectorAll(".exclusive-button");

exclusiveButtons.forEach((button) => {
    button.addEventListener("click", () => {
        alert("Exclusive content will open here.");
    });
});


// Bottom navigation
const navButtons =
    document.querySelectorAll(".bottom-nav button");

navButtons.forEach((button) => {

    button.addEventListener("click", () => {

        navButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        const label =
            button.querySelector("small")?.textContent;

        if (label === "Discover") {
            document
                .querySelector(".discover")
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        }

        if (label === "Home") {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

    });

});
