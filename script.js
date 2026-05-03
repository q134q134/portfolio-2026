const pageSize = 9;

const motionPageSize = 4;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function getPosterSrc(src) {
  const fileName = src.split("/").pop().replace(/\.mp4$/i, ".webp");
  return `assets/posters/${fileName}`;
}

function createMotionItems(count, type, folder, prefix) {
  return Array.from({ length: count }, (_, index) => {
    const id = String(index + 1).padStart(2, "0");
    const src = `assets/${folder}/${prefix}-${id}.mp4`;
    return {
      src,
      posterSrc: getPosterSrc(src),
      title: `${type} ${id}`,
      type,
    };
  });
}

const motionSets = {
  virtual: createMotionItems(24, "Virtual", "motion", "virtual"),
  animation: createMotionItems(9, "Animation", "Animation", "animation"),
};

const cacpItems = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 26, 21, 22, 23, 24,
].map((id) => {
  const paddedId = String(id).padStart(2, "0");
  const item = {
    src: `assets/cacp/cacp-${paddedId}.webp`,
    title: `Cultural Product ${paddedId}`,
    type: "Cultural Product",
  };

  if (id === 11) {
    item.hoverSrc = "assets/cacp/cacp-12.webp";
  }

  if (id === 20) {
    item.hoverSrc = "assets/cacp/cacp-25.webp";
  }

  return item;
});

const graphicOrder = [
  5, 6, 3, 29,
  1, 2, 4, 7,
  8, 9, 10, 11,
  12, 13, 14, 15,
  16, 17, 18, 19,
  20, 21, 22, 23,
  24, 25, 26, 27,
  28,
];

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
  graphic: graphicOrder.map((number) => {
    const id = String(number).padStart(2, "0");
    return {
      src: `assets/graphic/graphic-${id}.webp`,
      title: `Graphic ${id}`,
      type: "Graphic",
    };
  }),
  printer: Array.from({ length: 10 }, (_, index) => {
    const front = String(index * 2 + 1).padStart(2, "0");
    const hover = String(index * 2 + 2).padStart(2, "0");
    return {
      src: `assets/3d-printer/printer-${front}.webp`,
      hoverSrc: `assets/3d-printer/printer-${hover}.webp`,
      title: `3D Print ${index + 1}`,
      type: "3D Print",
    };
  }),
  culture: cacpItems,
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
    posterSrc: getPosterSrc(`assets/ai/ai-video-${id}.mp4`),
    title: `AI Video ${id}`,
    type: "AI Motion",
  };
}).concat([
  {
    src: "assets/ai/remotion-voice.mp4",
    posterSrc: getPosterSrc("assets/ai/remotion-voice.mp4"),
    title: "Remotion Video",
    type: "Remotion",
  },
]);

const ai3dItems = [
  {
    src: "assets/ai/ai-3d-render.webp",
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

function getAllImageSources() {
  return [...new Set([
    "assets/profile/portrait.webp",
    ...motionSets.virtual.map((item) => item.posterSrc),
    ...motionSets.animation.map((item) => item.posterSrc),
    ...designSets.product.flatMap((item) => [item.src, item.hoverSrc]),
    ...designSets.graphic.map((item) => item.src),
    ...designSets.printer.flatMap((item) => [item.src, item.hoverSrc]),
    ...designSets.culture.flatMap((item) => [item.src, item.hoverSrc]),
    ...aiCards.map((item) => item.src),
    ...aiVideos.map((item) => item.posterSrc),
    ...ai3dItems.map((item) => item.src),
  ].filter(Boolean))];
}

function updatePageLoader(completed, total) {
  const loaderBar = document.querySelector("#loaderBar");
  const loaderPercent = document.querySelector("#loaderPercent");
  const percent = total ? Math.min(100, Math.round((completed / total) * 100)) : 100;

  if (loaderBar) {
    loaderBar.style.width = `${percent}%`;
  }

  if (loaderPercent) {
    loaderPercent.textContent = `${percent}%`;
  }
}

function loadImageAsset(src, attempt = 1) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => {
      if (attempt < 3) {
        window.setTimeout(() => {
          loadImageAsset(src, attempt + 1).then(resolve);
        }, 280 * attempt);
        return;
      }

      console.warn(`Image failed to load: ${src}`);
      resolve(false);
    };
    image.src = src;
  });
}

function loadVideoAsset(src, attempt = 1) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    let isDone = false;
    const done = (isLoaded = true) => {
      if (isDone) {
        return;
      }
      isDone = true;
      video.oncanplaythrough = null;
      video.onloadeddata = null;
      video.onerror = null;
      video.src = "";
      video.load();
      resolve(isLoaded);
    };
    const retry = () => {
      if (attempt < 2) {
        window.setTimeout(() => {
          loadVideoAsset(src, attempt + 1).then(resolve);
        }, 650);
        return;
      }

      console.warn(`Video failed to preload: ${src}`);
      done(false);
    };
  
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.oncanplaythrough = () => done(true);
    video.onloadeddata = () => done(true);
    video.onerror = retry;
    video.src = src;
    video.load();
  });
}

async function loadAssetQueue(assets, concurrency, onProgress) {
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < assets.length) {
      const asset = assets[nextIndex];
      nextIndex += 1;
      if (asset.type === "video") {
        await loadVideoAsset(asset.src);
      } else {
        await loadImageAsset(asset.src);
      }
      onProgress();
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, assets.length) }, worker));
}

async function waitForFullPortfolioLoad() {
  const loader = document.querySelector("#portfolioLoader");
  window.scrollTo(0, 0);
  const imageSources = getAllImageSources();
  const videoSources = getInitialVideoSources();
  const imageAssets = imageSources.map((src) => ({ type: "image", src }));
  const videoAssets = videoSources.map((src) => ({ type: "video", src }));
  const totalAssets = imageAssets.length + videoAssets.length;
  let completed = 0;
  
  updatePageLoader(0, totalAssets);
  
  const onProgress = () => {
    completed += 1;
    updatePageLoader(completed, totalAssets);
  };

  await loadAssetQueue(imageAssets, 8, onProgress);
  await loadAssetQueue(videoAssets, 2, onProgress);
  
  updatePageLoader(totalAssets, totalAssets);
  document.querySelectorAll(".hover-video video").forEach((video) => {
    loadVideoElement(video, "auto");
    if (video.readyState > 0 && video.currentTime === 0) {
      video.currentTime = 0.08;
    }
  });
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  loader?.classList.add("is-done");
  document.body.classList.remove("is-preloading");
  window.setTimeout(() => window.scrollTo(0, 0), 60);
  window.setTimeout(preloadRemainingVideos, 700);
}

function createImageCard(item) {
  const hoverImage = item.hoverSrc ? `<img class="hover-image" src="${item.hoverSrc}" alt="${item.title} alternate view" loading="lazy" decoding="async" />` : "";
  const moreHint = item.moreHint ? `<span class="image-more-hint">${item.moreHint}</span>` : "";
  const interactionHint = item.hoverSrc
    ? `<span class="interaction-hint" data-desktop-label="滑過切換" data-mobile-label="點擊切換">滑過切換</span>`
    : "";

  return `
    <article class="media-card${item.hoverSrc ? " flip-image" : ""}">
      <div class="media-frame">
        <img class="base-image" src="${item.src}" alt="${item.title}" loading="eager" decoding="async" />
        ${hoverImage}
        ${moreHint}
        ${interactionHint}
      </div>
    </article>
  `;
}

function createDraggableImageCard(item) {
  return `
    <article class="media-card pan-card">
      <div class="media-frame">
        <img class="pan-image" src="${item.src}" alt="${item.title}" loading="eager" draggable="false" />
        <span class="pan-hint">拖曳查看</span>
      </div>
    </article>
  `;
}

function createVideoCard(item) {
  return `
    <article class="media-card hover-video">
      <div class="media-frame">
        <img class="video-poster" src="${item.posterSrc}" alt="${item.title} preview" loading="eager" decoding="async" />
          <video data-src="${item.src}" muted loop playsinline preload="none"></video>
          <span class="interaction-hint video-action-hint" data-desktop-label="滑過播放" data-mobile-label="點擊播放">滑過播放</span>
          <span class="video-loading" aria-hidden="true">讀取中</span>
          <span class="video-countdown" aria-hidden="true">0秒</span>
        </div>
      </article>
    `;
  }

function getAllVideoSources() {
  return [...new Set([
    ...motionSets.virtual.map((item) => item.src),
    ...motionSets.animation.map((item) => item.src),
    ...aiVideos.map((item) => item.src),
  ])];
}

function getInitialVideoSources() {
  return [...new Set([
    ...motionSets.virtual.slice(0, motionPageSize * 2).map((item) => item.src),
    ...aiVideos.map((item) => item.src),
  ])];
}

  function getVisibleVideoSources() {
    return [...document.querySelectorAll(".hover-video video")]
      .map((video) => video.dataset.src || video.currentSrc || video.src)
      .filter(Boolean);
  }

function waitForVisibleVideos() {
  const videos = [...document.querySelectorAll(".hover-video video")];
  if (!videos.length) {
    return Promise.resolve();
  }

  const readyPromises = videos.map((video) => {
    if (video.readyState >= 2) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const done = () => resolve();
      video.addEventListener("loadeddata", done, { once: true });
      video.addEventListener("error", done, { once: true });
    });
  });

  return Promise.allSettled(readyPromises);
}

function preloadRemainingVideos() {
  const existing = document.querySelector("#videoPreloadPool");
  if (existing) {
    existing.remove();
  }

  const visibleSources = new Set(getVisibleVideoSources());
  const initialSources = new Set(getInitialVideoSources());
  const remainingSources = getAllVideoSources().filter((src) => !initialSources.has(src) && !visibleSources.has(new URL(src, window.location.href).href) && !visibleSources.has(src));
  if (!remainingSources.length) {
    return;
  }

  const pool = document.createElement("div");
  pool.id = "videoPreloadPool";
  pool.setAttribute("aria-hidden", "true");
  pool.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
  document.body.appendChild(pool);

  let index = 0;
  const loadNext = () => {
    const batch = remainingSources.slice(index, index + 2);
    index += batch.length;

    batch.forEach((src) => {
      const video = document.createElement("video");
      video.src = src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      pool.appendChild(video);
      video.load();
    });

    if (index < remainingSources.length) {
      window.setTimeout(loadNext, 900);
    }
  };

  loadNext();
}

  function preloadVideosInPriority() {
    waitForVisibleVideos().then(() => {
      window.setTimeout(preloadRemainingVideos, 600);
    });
  }

  function loadVideoElement(video, preload = "auto") {
    if (!video || !video.dataset.src) {
      return;
    }

    video.preload = preload;
    if (!video.getAttribute("src")) {
      video.src = video.dataset.src;
    }
    video.load();
  }

  function preloadVisibleVideos(scope = document) {
    const videos = [...scope.querySelectorAll(".hover-video video")];
    const loadBatch = () => {
      videos.forEach((video) => loadVideoElement(video, "auto"));
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadBatch, { timeout: 1400 });
    } else {
      window.setTimeout(loadBatch, 700);
    }
  }

  function preloadImageSources(sources, batchSize = 8) {
    const uniqueSources = [...new Set(sources.filter(Boolean))];
    let index = 0;

    const loadNextBatch = () => {
      const batch = uniqueSources.slice(index, index + batchSize);
      index += batch.length;

      batch.forEach((src) => {
        const image = new Image();
        image.decoding = "async";
        image.src = src;
      });

      if (index < uniqueSources.length) {
        window.setTimeout(loadNextBatch, 160);
      }
    };

    loadNextBatch();
  }

  function preloadDesignImages() {
    const orderedItems = [
      ...designSets.product,
      ...designSets.culture,
      ...designSets.graphic,
      ...designSets.printer,
    ];
    const baseSources = orderedItems.map((item) => item.src);
    const hoverSources = orderedItems.map((item) => item.hoverSrc);

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        preloadImageSources(baseSources);
        window.setTimeout(() => preloadImageSources(hoverSources), 900);
      }, { timeout: 1800 });
    } else {
      window.setTimeout(() => {
        preloadImageSources(baseSources);
        window.setTimeout(() => preloadImageSources(hoverSources), 900);
      }, 1000);
    }
  }

  function getDesignPageSize() {
    if (window.matchMedia("(hover: none)").matches && state.designTab === "product") {
      return 3;
    }

    return state.designTab === "graphic" || state.designTab === "printer" || state.designTab === "culture" ? 4 : pageSize;
  }

  function resetTouchMediaState() {
    document.querySelectorAll(".flip-image.is-flipped").forEach((card) => card.classList.remove("is-flipped"));
    document.querySelectorAll(".hover-video.is-playing").forEach((card) => {
      if (typeof card.stopVideoPlayback === "function") {
        card.stopVideoPlayback();
      }
    });
  }
  
  function paginate(items, page, size = pageSize) {
  const start = page * size;
  return items.slice(start, start + size);
}

function renderMotion() {
  const grid = document.querySelector("#motionGrid");
  const pageLabel = document.querySelector("#motionPage");
  const items = motionSets[state.motionTab];
  const pageTotal = Math.ceil(items.length / motionPageSize);

  state.motionPage = Math.max(0, Math.min(state.motionPage, pageTotal - 1));
    grid.innerHTML = paginate(items, state.motionPage, motionPageSize).map(createVideoCard).join("");
    pageLabel.textContent = `${state.motionPage + 1} / ${pageTotal}`;
    bindHoverVideos(grid);
    preloadVisibleVideos(grid);
    animateCards(grid);
  }

function renderDesign() {
  const grid = document.querySelector("#designGrid");
  const pageLabel = document.querySelector("#designPage");
  const items = designSets[state.designTab];
  const designPageSize = getDesignPageSize();
  const pageTotal = Math.ceil(items.length / designPageSize);

  state.designPage = Math.max(0, Math.min(state.designPage, pageTotal - 1));
  grid.classList.toggle("is-product", state.designTab === "product");
  grid.classList.toggle("is-graphic", state.designTab === "graphic");
  grid.classList.toggle("is-printer", state.designTab === "printer");
  grid.classList.toggle("is-culture", state.designTab === "culture");
  grid.innerHTML = paginate(items, state.designPage, designPageSize).map(createImageCard).join("");
  pageLabel.textContent = `${state.designPage + 1} / ${pageTotal}`;
  bindTapImageCards(grid);
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
    bindTapImageCards(grid);
  }

    if (state.aiTab === "motion") {
      grid.classList.add("ai-video-row");
      grid.innerHTML = aiVideos.map(createVideoCard).join("");
      bindHoverVideos(grid);
      preloadVisibleVideos(grid);
    }

  animateCards(grid);
}

  function bindDraggableImages(scope = document) {
    scope.querySelectorAll(".pan-card").forEach((card) => {
      const image = card.querySelector(".pan-image");
      const frame = card.querySelector(".media-frame");
      const verticalOnly = Boolean(card.closest(".ai-3d-grid"));
      const scale = verticalOnly ? 1 : 1.35;
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
        const frameRect = frame.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();
        const imageRatio = image.naturalWidth && image.naturalHeight
          ? image.naturalWidth / image.naturalHeight
          : Math.max(0.01, imageRect.width / Math.max(1, imageRect.height));
  
        if (verticalOnly) {
          const renderedHeight = Math.max(imageRect.height, frameRect.width / imageRatio);
          minX = 0;
          maxX = 0;
          maxY = 0;
          minY = Math.min(0, frameRect.height - renderedHeight);
          currentX = 0;
        currentY = Math.max(minY, Math.min(maxY, currentY));
        return;
      }

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
  
      function startDrag(event) {
        updateBounds();
        if (minX === maxX && minY === maxY) {
          return;
        }
        isDragging = true;
        startX = event.clientX - currentX;
        startY = event.clientY - currentY;
        card.classList.add("is-dragging");
        frame.setPointerCapture(event.pointerId);
      }
  
      function moveDrag(event) {
        if (!isDragging) {
          return;
        }
  
        currentX = verticalOnly ? 0 : Math.max(minX, Math.min(maxX, event.clientX - startX));
        currentY = Math.max(minY, Math.min(maxY, event.clientY - startY));
        applyTransform();
      }
  
      function stopDrag(event) {
        isDragging = false;
        card.classList.remove("is-dragging");
        if (frame.hasPointerCapture(event.pointerId)) {
          frame.releasePointerCapture(event.pointerId);
        }
      }
  
      frame.addEventListener("pointerdown", startDrag);
      frame.addEventListener("pointermove", moveDrag);
      frame.addEventListener("pointerup", stopDrag);
      frame.addEventListener("pointercancel", stopDrag);
      frame.addEventListener("pointerleave", () => {
        isDragging = false;
        card.classList.remove("is-dragging");
      });

    window.addEventListener("resize", () => {
      updateBounds();
      applyTransform();
    });
  });
}

function bindTapImageCards(scope = document) {
  scope.querySelectorAll(".flip-image").forEach((card) => {
    card.addEventListener("click", () => {
      if (!window.matchMedia("(hover: none)").matches) {
        return;
      }
      const wasFlipped = card.classList.contains("is-flipped");
      document.querySelectorAll(".flip-image.is-flipped").forEach((item) => {
        if (item !== card) {
          item.classList.remove("is-flipped");
        }
      });
      card.classList.toggle("is-flipped", !wasFlipped);
    });
  });
}
  function bindHoverVideos(scope = document) {
      scope.querySelectorAll(".hover-video").forEach((card) => {
        const video = card.querySelector("video");
        const countdown = card.querySelector(".video-countdown");
        const poster = card.querySelector(".video-poster");
        const loading = card.querySelector(".video-loading");
        let countdownTimer = null;
        let wantsPlayback = false;
        const isTouchMode = () => window.matchMedia("(hover: none)").matches;

        const setLoading = (isLoading) => {
          loading?.classList.toggle("is-visible", isLoading);
          card.classList.toggle("is-loading", isLoading);
        };

        const revealVideo = () => {
          if (!wantsPlayback || video.readyState < 2) {
            return;
          }

          poster?.classList.add("is-hidden");
          setLoading(false);
        };

    const getRemainingSeconds = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return 0;
      }
      return Math.max(0, Math.ceil(video.duration - video.currentTime));
    };

    const updateCountdown = () => {
      if (!countdown) {
        return;
      }
      countdown.textContent = `${getRemainingSeconds()}秒`;
    };

        const showPreviewFrame = () => {
          if (video.readyState > 0 && video.currentTime === 0) {
            video.currentTime = 0.08;
          }
          revealVideo();
          updateCountdown();
        };

    const startCountdown = () => {
      updateCountdown();
      window.clearInterval(countdownTimer);
      countdownTimer = window.setInterval(updateCountdown, 250);
      card.classList.add("is-playing");
    };

    const stopCountdown = () => {
      window.clearInterval(countdownTimer);
      countdownTimer = null;
      card.classList.remove("is-playing");
      updateCountdown();
    };

    video.addEventListener("loadedmetadata", showPreviewFrame);
    video.addEventListener("loadeddata", showPreviewFrame);
    video.addEventListener("timeupdate", updateCountdown);

      const loadVideo = () => {
        loadVideoElement(video, "auto");
      };

          const playVideo = () => {
            wantsPlayback = true;
            document.querySelectorAll(".hover-video.is-playing").forEach((playingCard) => {
              if (playingCard !== card && typeof playingCard.stopVideoPlayback === "function") {
                playingCard.stopVideoPlayback();
              }
            });
            loadVideo();
            setLoading(video.readyState < 2);
            startCountdown();
            video.play().then(() => {
              revealVideo();
          }).catch(() => {
            if (wantsPlayback && video.readyState < 2) {
              setLoading(true);
            }
          });
      };
  
      const stopVideo = () => {
        wantsPlayback = false;
        video.pause();
        if (video.readyState > 0) {
          video.currentTime = 0.08;
          }
          setLoading(false);
            poster?.classList.remove("is-hidden");
            stopCountdown();
          };

          card.stopVideoPlayback = stopVideo;
  
      const toggleVideo = (event) => {
        if (!isTouchMode()) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
  
        if (video.paused) {
          playVideo();
        } else {
          stopVideo();
        }
      };
  
        card.addEventListener("mouseenter", () => {
          if (!isTouchMode()) {
            playVideo();
          }
        });
        card.addEventListener("mouseleave", () => {
          if (!isTouchMode()) {
            stopVideo();
          }
        });
        card.addEventListener("focusin", () => {
          if (!isTouchMode()) {
            playVideo();
          }
        });
        card.addEventListener("focusout", () => {
          if (!isTouchMode()) {
            stopVideo();
          }
        });
        card.addEventListener("click", toggleVideo);
        video.addEventListener("waiting", () => {
          if (wantsPlayback) {
            setLoading(true);
          }
        });
        video.addEventListener("canplay", revealVideo);
        video.addEventListener("playing", revealVideo);
      });
    }

function animateCards(scope) {
  const cards = scope.querySelectorAll(".media-card");
  if (!cards.length) {
    return;
  }

  if (!window.gsap) {
    cards.forEach((card) => {
      card.style.opacity = "1";
      card.style.transform = "none";
    });
    return;
  }

  try {
    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "power2.out" }
    );
  } catch (error) {
    cards.forEach((card) => {
      card.style.opacity = "1";
      card.style.transform = "none";
    });
  }
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
        resetTouchMediaState();
        state.motionPage += direction;
        renderMotion();
      }
  
      if (gallery === "design") {
        resetTouchMediaState();
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
      resetTouchMediaState();
      renderDesign();
    });
  });

document.querySelectorAll("[data-motion-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-motion-tab]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.motionTab = button.dataset.motionTab;
      state.motionPage = 0;
      resetTouchMediaState();
      renderMotion();
    });
  });

document.querySelectorAll("[data-ai-tab]").forEach((button) => {
  button.addEventListener("click", () => {
      document.querySelectorAll("[data-ai-tab]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.aiTab = button.dataset.aiTab;
      resetTouchMediaState();
      renderAi();
    });
  });

const backToTopButton = document.querySelector(".back-to-top");

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

document.addEventListener("dragstart", (event) => {
  if (event.target.closest("img, video")) {
    event.preventDefault();
  }
});

let longPressTimer = null;

document.addEventListener("touchstart", (event) => {
  if (!event.target.closest("img, video")) {
    return;
  }

  longPressTimer = window.setTimeout(() => {
    event.preventDefault();
  }, 360);
}, { passive: false });

document.addEventListener("touchend", () => {
  window.clearTimeout(longPressTimer);
});

document.addEventListener("touchmove", () => {
  window.clearTimeout(longPressTimer);
});

renderMotion();
renderDesign();
renderAi();
preloadDesignImages();
waitForFullPortfolioLoad();
// Background video preload disabled so images render first.

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
































