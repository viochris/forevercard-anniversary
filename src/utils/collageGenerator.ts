import { PhotoItem } from '../types';

/**
 * Loads an image from URL with CORS handling and fallback support
 */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback attempt without crossOrigin in case data URL or specific origin
      const retryImg = new Image();
      retryImg.onload = () => resolve(retryImg);
      retryImg.onerror = () => resolve(null);
      retryImg.src = src;
    };
    img.src = src;
  });
}

/**
 * Draws text wrapped within maxWidth, limiting to maxLines
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 2
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let linesDrawn = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      linesDrawn++;
      if (linesDrawn >= maxLines) {
        ctx.fillText(line.trim() + '...', x, currentY);
        return;
      }
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

/**
 * Draws image with cover aspect ratio inside a bounding box
 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number = 4
) {
  ctx.save();
  ctx.beginPath();
  if (radius > 0 && ctx.roundRect) {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.clip();

  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sw = img.width;
  let sh = img.height;
  let sx = 0;
  let sy = 0;

  if (imgRatio > boxRatio) {
    sw = img.height * boxRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / boxRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

/**
 * Generates a high-resolution polaroid scrapbook collage of all photos
 */
export async function generateCollageBlob(photos: PhotoItem[], daysTogether: number = 365): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const validPhotos = photos.length > 0 ? photos : [];
  const cols = 2;
  const rows = Math.max(1, Math.ceil(validPhotos.length / cols));

  const canvasWidth = 1440;
  const headerHeight = 260;
  const rowHeight = 520;
  const footerHeight = 160;
  const canvasHeight = headerHeight + (rows * rowHeight) + footerHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 1. Romantic Textured Background (warm gradient)
  const bgGrad = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  bgGrad.addColorStop(0, '#fffbfb');
  bgGrad.addColorStop(0.35, '#fff1f4');
  bgGrad.addColorStop(0.7, '#fff5f7');
  bgGrad.addColorStop(1, '#fef2f2');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Soft decorative border
  ctx.strokeStyle = 'rgba(251, 113, 133, 0.25)';
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, canvasWidth - 56, canvasHeight - 56);

  ctx.strokeStyle = 'rgba(251, 113, 133, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, canvasWidth - 72, canvasHeight - 72);

  // 2. Header Section
  ctx.save();
  ctx.textAlign = 'center';

  // Mini badge
  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 20px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(`♥ 1 Year • ${daysTogether} Days of Our Story ♥`, canvasWidth / 2, 85);

  // Main serif title
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 54px "Playfair Display", Georgia, serif';
  ctx.fillText('Our 1 Year Anniversary Memories', canvasWidth / 2, 155);

  // Subtitle
  ctx.fillStyle = '#57534e';
  ctx.font = '500 24px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('From that first shy hello to 365 days of unconditional love and laughter', canvasWidth / 2, 205);
  ctx.restore();

  // 3. Load all photos in parallel
  const loadedImages = await Promise.all(
    validPhotos.map(async (p) => {
      const img = await loadImage(p.imageUrl);
      return { photo: p, img };
    })
  );

  // 4. Draw Polaroid Scrapbook items
  const cardWidth = 600;
  const cardHeight = 470;
  const colWidth = canvasWidth / 2;

  loadedImages.forEach(({ photo, img }, index) => {
    const colIndex = index % cols;
    const rowIndex = Math.floor(index / cols);

    const centerX = colIndex === 0 ? colWidth * 0.52 : colWidth * 1.48;
    const centerY = headerHeight + (rowIndex * rowHeight) + (rowHeight / 2) - 10;

    const rotDeg = photo.rotation || (index % 2 === 0 ? -1.8 : 2.2);
    const rotRad = (rotDeg * Math.PI) / 180;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotRad);

    // Soft Polaroid drop shadow
    ctx.shadowColor = 'rgba(28, 25, 23, 0.14)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;

    // White polaroid base
    ctx.fillStyle = '#ffffff';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 14);
      ctx.fill();
    } else {
      ctx.fillRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
    }

    // Reset shadow for inner elements
    ctx.shadowColor = 'transparent';

    // Subtle 1px inner border
    ctx.strokeStyle = 'rgba(231, 229, 228, 0.8)';
    ctx.lineWidth = 1;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 14);
      ctx.stroke();
    } else {
      ctx.strokeRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
    }

    // Photo frame dimensions
    const photoPad = 20;
    const photoW = cardWidth - (photoPad * 2);
    const photoH = 340;
    const photoX = -cardWidth / 2 + photoPad;
    const photoY = -cardHeight / 2 + photoPad;

    if (img) {
      drawImageCover(ctx, img, photoX, photoY, photoW, photoH, 8);
    } else {
      // Romantic fallback placeholder tile
      const placeholderGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
      placeholderGrad.addColorStop(0, '#fecdd3');
      placeholderGrad.addColorStop(1, '#fda4af');
      ctx.fillStyle = placeholderGrad;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoW, photoH, 8);
        ctx.fill();
      } else {
        ctx.fillRect(photoX, photoY, photoW, photoH);
      }
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('♥ Memory Captured ♥', 0, photoY + (photoH / 2));
    }

    // Polaroid Washi Tape Accent at top
    ctx.fillStyle = index % 2 === 0 ? 'rgba(251, 113, 133, 0.45)' : 'rgba(245, 158, 11, 0.4)';
    const tapeW = 100;
    const tapeH = 24;
    ctx.fillRect(-tapeW / 2, -cardHeight / 2 - 8, tapeW, tapeH);

    // Caption & Meta Text below photo
    ctx.textAlign = 'left';
    ctx.fillStyle = '#292524';
    ctx.font = '500 20px "Plus Jakarta Sans", system-ui, sans-serif';
    wrapText(ctx, photo.caption, photoX + 6, photoY + photoH + 34, photoW - 12, 28, 2);

    // Date and Location badge at bottom
    if (photo.date || photo.location) {
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 15px "Plus Jakarta Sans", system-ui, sans-serif';
      const meta = [photo.location, photo.date].filter(Boolean).join(' • ');
      ctx.fillText(meta, photoX + 6, photoY + photoH + 96);
    }

    ctx.restore();
  });

  // 5. Footer Section
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e11d48';
  ctx.font = 'bold 24px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Forever & Always, 1 Year Anniversary Keepsake ✨', canvasWidth / 2, canvasHeight - 75);

  ctx.fillStyle = '#78716c';
  ctx.font = '500 18px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Claire & Ethan • 365 Days and a Lifetime More to Go 💕', canvasWidth / 2, canvasHeight - 40);
  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      'image/jpeg',
      0.95
    );
  });
}

/**
 * Triggers native save on mobile (via Web Share files or download attribute) or download on desktop
 */
export async function downloadCollageImage(photos: PhotoItem[], daysTogether: number = 365): Promise<boolean> {
  const blob = await generateCollageBlob(photos, daysTogether);
  if (!blob) return false;

  const fileName = 'our_1_year_anniversary_collage.jpg';
  const file = new File([blob], fileName, { type: 'image/jpeg' });

  // On Mobile: check if Web Share API with files is available (saves directly to camera roll / gallery)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Our 1 Year Anniversary Collage 💕',
        text: 'Kolase foto kenangan 1 tahun perjalanan cinta kita berdua! 💌',
      });
      return true;
    } catch (err: any) {
      if (err.name === 'AbortError') return true;
      // Fallback to direct anchor download
    }
  }

  // Anchor download
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  return true;
}
