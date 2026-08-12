const revealTargets = document.querySelectorAll(".feature, .mini-card, .hero-image");

revealTargets.forEach((element) => {
  element.setAttribute("data-reveal", "");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px"
  }
);

revealTargets.forEach((element) => observer.observe(element));

const featureVideos = document.querySelectorAll(".feature video");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const videoVisibility = new Map();

const resetVideo = (video) => {
  video.pause();
  if (video.currentTime !== 0) {
    video.currentTime = 0;
  }
};

const updateActiveVideo = () => {
  let activeVideo = null;
  let activeRatio = 0.2;

  if (!prefersReducedMotion.matches && !document.hidden) {
    videoVisibility.forEach((ratio, video) => {
      if (ratio > activeRatio) {
        activeVideo = video;
        activeRatio = ratio;
      }
    });
  }

  featureVideos.forEach((video) => {
    if (video === activeVideo) {
      video.play().catch(() => {
        resetVideo(video);
      });
    } else {
      resetVideo(video);
    }
  });
};

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      videoVisibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
    });

    updateActiveVideo();
  },
  {
    threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
    rootMargin: "80px 0px"
  }
);

featureVideos.forEach((video) => {
  videoVisibility.set(video, 0);
  resetVideo(video);
  videoObserver.observe(video);
});

prefersReducedMotion.addEventListener("change", updateActiveVideo);
document.addEventListener("visibilitychange", updateActiveVideo);

const lightbox = document.getElementById("image-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");
const featureImages = document.querySelectorAll(".feature .card img");

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");
  lightboxImage.removeAttribute("alt");
  document.body.classList.remove("lightbox-open");
};

featureImages.forEach((image) => {
  image.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) {
      return;
    }

    lightboxImage.setAttribute("src", image.currentSrc || image.src);
    lightboxImage.setAttribute("alt", image.alt);
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.getAttribute("aria-hidden") === "false") {
    closeLightbox();
  }
});
