const pageSize = 9;

function createMotionItems(count, type, folder, prefix) {
  return Array.from({ length: count }, (_, index) => {
    const id = String(index + 1).padStart(2, "0");
    return {
      src: `assets/${folder}/${prefix}-${id}.mp4`,
      title: `${type} ${id}`,
      type,
    };
  });
}

const motionSets = {
  virtual: createMotionItems(24, "Virtual", "motion", "virtual"),
  animation: createMotionItems(9, "Animation", "Animation", "animation"),
};

const designSets = {
  product: Array.from({ length: 27 }, (_, index) => {
    const group = 27 - index;
    return {
      src: `assets/product/${group}-2.webp`,
      hoverSrc: `assets/product/${group}-1.webp`,
      title: `Product ${group}`,
      type: "Product",
    };
  }),
  graphic: Array.from({ length: 29 }, (_, index) => {
    const id = String(index + 1).padStart(2, "0");
    return {
      src: `assets/graphic/graphic-${id}.webp`,
      title: `Graphic ${id}`,
      type: "Graphic",
    };
  }),
};

const aiCards = Array.from({ length: 10 }, (_, index) => {
  const id = String(index + 1).padStart(2, "0");
  return {
    src: `assets/ai/ai-card-${id}.webp`,
    title: `AI Card ${id}`,
    type: "AI Static",
  };
});

const aiVideos = Array.from({ length: 3 }, (_, index) => {
  const id = String(index + 1).padStart(2, "0");
  return {
    src: `assets/ai/ai-video-${id}.mp4`,
    title: `AI Video ${id}`,
    type: "AI Motion",
  };
}).concat([
  {
    src: "assets/ai/享食尚remotion_01-2_男配音.mp4",
    title: "Remotion Video",
    type: "Remotion",
  },
]);

const ai3dItems = [
  {
    src: "assets/ai/算圖.webp",
    title: "AI 3D Image",
    type: "3D",
  },
];
const state = {
  motionPage: 0,
  motionTab: "virtual",
  designPage: 0,
  designTab: "graphic",
  aiTab: "3d",
};

function createImageCard(item) {
  const hoverImage = item.hoverSrc ? `<img class="hover-image" src="${item.hoverSrc}" alt="${item.title} 甇?" loading="lazy" />` : "";

  return `
    <article class="media-card${item.hoverSrc ? " flip-image" : ""}">
      <div class="media-frame">
        <img class="base-image" src="${item.src}" alt="${item.title}" loading="lazy" />
        ${hoverImage}
      </div>
    </article>
  `;
}

function createDraggableImageCard(item) {
  return `
    <article class="media-card pan-card">
      <div class="media-frame">
        <img class="pan-image" src="${item.src}" alt="${item.title}" loading="lazy" draggable="false" />
        <span class="pan-hint">??亦?</span>
      </div>
    </article>
  `;
}

function createVideoCard(item) {
  return `
    <article class="media-card hover-video">
      <div class="media-frame">
        <video src="${item.src}" muted loop playsinline preload="metadata"></video>
      </div>
    </article>
  `;
}

function paginate(items, page) {
  const start = page * pageSize;
  return items.slice(start, start + pageSize);
}

function renderMotion() {
  const grid = document.querySelector("#motionGrid");
  const pageLabel = document.querySelector("#motionPage");
  const items = motionSets[state.motionTab];
  const pageTotal = Math.ceil(items.length / pageSize);

  state.motionPage = Math.max(0, Math.min(state.motionPage, pageTotal - 1));
  grid.innerHTML = paginate(items, state.motionPage).map(createVideoCard).join("");
  pageLabel.textContent = `${state.motionPage + 1} / ${pageTotal}`;
  bindHoverVideos(grid);
  animateCards(grid);
}

function renderDesign() {
  const grid = document.querySelector("#designGrid");
  const pageLabel = document.querySelector("#designPage");
  const items = designSets[state.designTab];
  const pageTotal = Math.ceil(items.length / pageSize);

  state.designPage = Math.max(0, Math.min(state.designPage, pageTotal - 1));
  grid.classList.toggle("is-product", state.designTab === "product");
  grid.classList.toggle("is-graphic", state.designTab === "graphic");
  grid.innerHTML = paginate(items, state.designPage).map(createImageCard).join("");
  pageLabel.textContent = `${state.designPage + 1} / ${pageTotal}`;
  animateCards(grid);
}

function renderAi() {
  const grid = document.querySelector("#aiGrid");
  grid.className = "";

  if (state.aiTab === "3d") {
    grid.classList.add("gallery-grid", "ai-3d-grid");
    grid.innerHTML = ai3dItems.map(createDraggableImageCard).join("");
    bindDraggableImages(grid);
  }

  if (state.aiTab === "static") {
    grid.classList.add("gallery-grid", "ai-card-grid");
    grid.innerHTML = aiCards.map(createImageCard).join("");
  }

  if (state.aiTab === "motion") {
    grid.classList.add("ai-video-row");
    grid.innerHTML = aiVideos.map(createVideoCard).join("");
    bindHoverVideos(grid);
  }

  animateCards(grid);
}

function bindDraggableImages(scope = document) {
  scope.querySelectorAll(".pan-card").forEach((card) => {
    const image = card.querySelector(".pan-image");
    const scale = 1.35;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;

    function updateBounds() {
      const frame = card.querySelector(".media-frame");
      const frameRect = frame.getBoundingClientRect();
      const imageRatio = image.naturalWidth / image.naturalHeight;
      const frameRatio = frameRect.width / frameRect.height;
      let renderedWidth = frameRect.width;
      let renderedHeight = frameRect.height;

      if (imageRatio > frameRatio) {
        renderedWidth = frameRect.height * imageRatio;
      } else {
        renderedHeight = frameRect.width / imageRatio;
      }

      const overflowX = Math.max(0, (renderedWidth * scale - frameRect.width) / 2);
      const overflowY = Math.max(0, (renderedHeight * scale - frameRect.height) / 2);

      minX = -overflowX;
      maxX = overflowX;
      minY = -overflowY;
      maxY = overflowY;
      currentX = Math.max(minX, Math.min(maxX, currentX));
      currentY = Math.max(minY, Math.min(maxY, currentY));
    }

    function applyTransform() {
      image.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    }

    image.addEventListener("load", () => {
      updateBounds();
      applyTransform();
    });
    if (image.complete) {
      updateBounds();
      applyTransform();
    }

    card.addEventListener("pointerdown", (event) => {
      updateBounds();
      isDragging = true;
      startX = event.clientX - currentX;
      startY = event.clientY - currentY;
      card.classList.add("is-dragging");
      card.setPointerCapture(event.pointerId);
    });

    card.addEventListener("pointermove", (event) => {
      if (!isDragging) {
        return;
      }

      currentX = Math.max(minX, Math.min(maxX, event.clientX - startX));
      currentY = Math.max(minY, Math.min(maxY, event.clientY - startY));
      applyTransform();
    });

    card.addEventListener("pointerup", (event) => {
      isDragging = false;
      card.classList.remove("is-dragging");
      card.releasePointerCapture(event.pointerId);
    });

    card.addEventListener("pointerleave", () => {
      isDragging = false;
      card.classList.remove("is-dragging");
    });

    window.addEventListener("resize", () => {
      updateBounds();
      applyTransform();
    });
  });
}

function bindHoverVideos(scope = document) {
  scope.querySelectorAll(".hover-video video").forEach((video) => {
    const showPreviewFrame = () => {
      if (video.readyState > 0 && video.currentTime === 0) {
        video.currentTime = 0.08;
      }
    };

    video.addEventListener("loadedmetadata", showPreviewFrame, { once: true });
    video.addEventListener("loadeddata", showPreviewFrame, { once: true });

    const playVideo = () => {
      video.play().catch(() => {});
    };

    const stopVideo = () => {
      video.pause();
      video.currentTime = 0.08;
    };

    video.addEventListener("mouseenter", playVideo);
    video.addEventListener("mouseleave", stopVideo);
    video.addEventListener("focus", playVideo);
    video.addEventListener("blur", stopVideo);
  });
}

function animateCards(scope) {
  if (!window.gsap) {
    return;
  }

  gsap.fromTo(
    scope.querySelectorAll(".media-card"),
    { autoAlpha: 0, y: 18 },
    { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "power2.out" }
  );
}

document.querySelectorAll(".pager").forEach((pager) => {
  pager.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
      return;
    }

    const direction = button.dataset.action === "next" ? 1 : -1;
    const gallery = pager.dataset.gallery;

    if (gallery === "motion") {
      state.motionPage += direction;
      renderMotion();
    }

    if (gallery === "design") {
      state.designPage += direction;
      renderDesign();
    }
  });
});

document.querySelectorAll("[data-design-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-design-tab]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    state.designTab = button.dataset.designTab;
    state.designPage = 0;
    renderDesign();
  });
});

document.querySelectorAll("[data-motion-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-motion-tab]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    state.motionTab = button.dataset.motionTab;
    state.motionPage = 0;
    renderMotion();
  });
});

document.querySelectorAll("[data-ai-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-ai-tab]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    state.aiTab = button.dataset.aiTab;
    renderAi();
  });
});

const backToTopButton = document.querySelector(".back-to-top");

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

renderMotion();
renderDesign();
renderAi();

if (window.gsap) {
  gsap.set([".site-header", ".hero-copy > *", ".hero-portrait"], { autoAlpha: 0 });
  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .to(".site-header", { autoAlpha: 1, duration: 0.45 })
    .fromTo(".hero-copy > *", { y: 30 }, { autoAlpha: 1, y: 0, duration: 0.82, stagger: 0.08 }, "-=0.1")
    .fromTo(".hero-portrait", { y: 34, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 }, "-=0.62");

  const revealItems = document.querySelectorAll(".section-heading, .profile-card, .profile-content, .ai-copy");
  gsap.set(revealItems, { autoAlpha: 0, y: 26 });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        gsap.to(entry.target, {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: "power2.out",
        });
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
}







