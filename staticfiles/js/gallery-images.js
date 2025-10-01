document.addEventListener("DOMContentLoaded", function () {
    const photos = document.querySelectorAll(".gallery-photo");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("lightbox-close");

    photos.forEach(photo => {
        photo.addEventListener("click", () => {
            lightboxImg.src = photo.src;
            lightbox.style.display = "flex"; // Show overlay
        });
    });

    closeBtn.addEventListener("click", () => {
        lightbox.style.display = "none";
        lightboxImg.src = "";
    });

    // Close when clicking outside image
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
            lightboxImg.src = "";
        }
    });
});
