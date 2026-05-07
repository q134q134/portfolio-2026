---
name: portfolio-visual-design
description: Build, refine, or maintain a dark editorial visual designer portfolio site like Hsieh Chih-Cheng's 2020~ portfolio. Use when creating or updating a designer/visual portfolio with Traditional Chinese copy, 01-04 section navigation, non-cropped image galleries, YouTube-backed video cards with local WebP posters, hover/tap media interactions, mobile-safe layouts, GitHub Desktop/Vercel publishing, or the specific project at D:\2026 作品集\portfolio-2026.
---

# Portfolio Visual Design

## Core Intent

Create a usable portfolio first, not a landing page. The site should feel like a professional visual designer's work archive: dark, editorial, restrained, easy to scan, and built around the work itself.

Use Traditional Chinese for visible copy unless the user asks otherwise. Keep the tone concise and direct.

## Site Structure

Use this order unless the user changes it:

1. `01 自我介紹`
2. `02 虛擬景、動畫作品`
3. `03 商品、平面及3D延伸設計`
4. `04 AI 協作內容`

The hero should show:

- `2020~`
- `謝治成`
- `Hsieh`
- `Chih-Cheng`
- A short positioning paragraph
- Four section links
- Portrait image on the first viewport when requested
- Role line near the portrait: `視覺設計｜動態影像設計｜AI視覺設計`

Avoid decorative workflow graphics unless the user explicitly approves them after preview.

## Visual System

Use a dark editorial base:

- Background: near-black `#0f1114`
- Ink: warm white `#f3efe6`
- Muted text: `#a7a9aa`
- Section number accent: `#FB4339`
- Gold eyebrow labels: `#d8b978`
- Thin borders using translucent warm white

Keep cards square-edged or lightly rounded only if the existing code already uses it. Avoid gradient blobs, decorative orbs, and stock-like filler imagery.

Use large typographic section numbers (`01`, `02`, `03`, `04`) as background/side signals. Do not let them overlap text in a way that hurts readability.

## Media Rules

Images and videos are the portfolio. Prioritize media correctness over decoration.

- Never crop portfolio images unintentionally.
- Use `object-fit: contain` for gallery images, product cards, posters, and embedded media.
- Use stable aspect ratios so grids do not jump.
- For product flip cards, show the base image first and hover/tap to reveal the alternate image.
- On touch devices, tapping a new image should reset the previous flipped image.
- On touch devices, tapping a new video should stop/reset the previous video.
- Disable right-click, dragging, selection, and long-press image actions as a light deterrent, while remembering this cannot fully prevent downloading.

For YouTube-backed videos:

- Store local WebP posters under `assets/posters`.
- Show poster first.
- Insert the YouTube iframe only after clicking the play icon.
- Use `autoplay=1&mute=1&rel=0&playsinline=1`.
- Use an icon button for play, not visible text.
- Do not preload local MP4 files when a YouTube ID exists.

## Gallery Behavior

Default page size:

- Motion/virtual/animation: 2x2, 4 works per page.
- Graphic design: 2x2, 4 works per page.
- 3D printing: 2x2, 4 works per page.
- Cultural product: 2x2, 4 works per page.
- Product design desktop: use the existing product grid behavior unless the user requests mobile-specific changes.

Mobile/touch:

- Use one-column layouts for image-heavy galleries when readability matters.
- Product design on mobile should avoid vertical cropping.
- Media should remain fully visible inside its frame.

## Copy Guidelines

Keep copy simple, professional, and specific. Prefer short explanations over promotional language.

Useful copy patterns:

- About: `我具有視覺設計、動態影像與 AI 協作流程整合經驗。`
- Product/design: explain freelance work, product development, printing, selling, and 3D printing experience in one concise paragraph.
- Motion: emphasize high-speed broadcast/news production and clear information delivery.
- AI: explain AI as a workflow collaborator, not as decoration.

For AI section bullets, use this order when relevant:

1. `Remotion動態輔助：支援片頭、配音與影像內容製作`
2. `3D 視覺：協助建立材質、造型與畫面風格參考`
3. `靜態輔助：用於通路卡、情境圖與視覺方向發想`
4. `網頁設計：運用 AI 協作完成作品集網站規劃、版面設計與前端製作`

## Implementation Workflow

When editing the existing portfolio at `D:\2026 作品集\portfolio-2026`:

1. Read `index.html`, `styles.css`, and `script.js` before changing layout or behavior.
2. Preserve existing asset folders and naming patterns.
3. Use `apply_patch` for manual edits.
4. Check JavaScript with `node --check`.
5. Confirm key assets exist before publishing.
6. Preview locally at `http://127.0.0.1:8080/` with a cache-busting query string.
7. For publishing, use GitHub Desktop's bundled Git if system Git is unavailable:
   `C:\Users\owner\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe`

## Validation Checklist

Before calling the work done:

- No broken `assets/...` references.
- `script.js` passes syntax check.
- Main page returns `200 OK` locally if the preview server is running.
- Hero portrait appears only where intended.
- Section numbers use `#FB4339`.
- Gallery images are not cropped on desktop or mobile.
- YouTube cards show posters before click.
- Mobile tap behavior resets previously opened media.
- Git status is clean after commit/push when publishing.

