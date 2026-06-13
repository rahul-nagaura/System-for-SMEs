/* ─────────────────────────────────────────────────────────────
   BML Calculator — downloadable result card (Canvas → PNG)
   ─────────────────────────────────────────────────────────────
   Draws the shareable 720×1280 result card on an off-screen
   <canvas> and triggers a PNG download. This is the only piece of
   the BML feature that touches the Canvas API, so it lives on its
   own. It takes a plain data object (CardData) — it reads no React
   state directly — which keeps the drawing logic isolated and easy
   to reason about.

   Related modules:
     - bml-data.ts    → cardThemes (the accent palette used here)
     - bml-scoring.ts → RingGeometry (the arc angles used here)
     - bml-client.tsx → builds CardData and calls downloadResultCard()
   ──────────────────────────────────────────────────────────── */

import { cardThemes } from "./bml-data";
import type { RingGeometry } from "./bml-scoring";

/** Everything the card needs in order to render. Mirrors the values
 *  the results screen already has on hand. */
export type CardData = {
  themeId: string;
  exportName: string;
  showScoreRing: boolean;
  showLevel: boolean;
  showDimensions: boolean;
  averagePercentage: number;
  currentLevelIndex: number;
  stageNameOnly: string;
  currentLevelLine: string;
  ringGeometry: RingGeometry;
  dimensionsList: { name: string; value: number }[];
  weakestDim: string;
};

/** Render the result card to a PNG and trigger a browser download. */
export function downloadResultCard(data: CardData): void {
  const {
    themeId,
    exportName,
    showScoreRing,
    showLevel,
    showDimensions,
    averagePercentage,
    currentLevelIndex,
    stageNameOnly,
    currentLevelLine,
    ringGeometry,
    dimensionsList,
    weakestDim,
  } = data;

  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const currentTheme = cardThemes.find(t => t.id === themeId) || cardThemes[0];

  // 1. Background
  ctx.fillStyle = currentTheme.bg;
  ctx.fillRect(0, 0, 720, 1280);

  // 2. Subtle Inset Border
  ctx.strokeStyle = currentTheme.border;
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 680, 1240);

  // 3. Header
  // Logo text
  ctx.fillStyle = currentTheme.text;
  ctx.font = "900 22px Archivo, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("SYSTEMS FOR SME", 60, 90);

  // Eyebrow
  ctx.fillStyle = "#9A9A93";
  ctx.font = "bold 14px Inter, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("BML DIAGNOSTIC", 660, 90);

  // Divider Line
  ctx.strokeStyle = currentTheme.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 125);
  ctx.lineTo(660, 125);
  ctx.stroke();

  // 4. Footer
  // Footer Divider Line
  ctx.strokeStyle = currentTheme.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 1130);
  ctx.lineTo(660, 1130);
  ctx.stroke();

  // Handle @systems_for_sme (centered)
  ctx.fillStyle = currentTheme.accent;
  ctx.font = "900 22px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("@systems_for_sme", 360, 1195);

  // 5. Calculate layout heights and spacing dynamically to center content
  const heights: { name: string; height: number }[] = [];

  // Name & Badge is always shown
  heights.push({ name: "name", height: 110 });

  if (showScoreRing) {
    heights.push({ name: "scoreRing", height: 230 });
  }

  if (showLevel) {
    heights.push({ name: "levelLine", height: 80 });
  }

  if (showDimensions) {
    heights.push({ name: "dimensions", height: 200 });
  }

  // Biggest Gap is always shown
  heights.push({ name: "biggestGap", height: 90 });

  const totalContentHeight = heights.reduce((sum, h) => sum + h.height, 0);
  const totalAvailableHeight = 850; // space between Y=180 and Y=1030

  // Distribute spacing
  const maxSpacing = 50;
  const spacing = heights.length > 1 ? Math.min(maxSpacing, (totalAvailableHeight - totalContentHeight) / (heights.length - 1)) : 0;
  const actualBlockHeight = totalContentHeight + spacing * (heights.length - 1);
  const startY = 180 + (totalAvailableHeight - actualBlockHeight) / 2;

  let currentY = startY;

  heights.forEach((item) => {
    if (item.name === "name") {
      ctx.fillStyle = currentTheme.text;
      ctx.font = "900 32px Archivo, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(exportName || "Founder", 60, currentY + 45);

      if (showLevel) {
        const badgeText = `LEVEL ${currentLevelIndex} · ${stageNameOnly.toUpperCase()}`;
        ctx.font = "900 15px Inter, sans-serif";
        const textWidth = ctx.measureText(badgeText).width;

        // Draw yellow badge background
        ctx.fillStyle = currentTheme.labelBg;
        ctx.fillRect(60, currentY + 68, textWidth + 24, 30);

        // Draw text inside badge
        ctx.fillStyle = currentTheme.labelText;
        ctx.fillText(badgeText, 72, currentY + 88);
      }
      currentY += item.height + spacing;
    }

    else if (item.name === "scoreRing") {
      const centerX = 360;
      const centerY = currentY + 110;
      const radius = 80;

      // Draw track
      ctx.strokeStyle = currentTheme.trackBg;
      ctx.lineWidth = 17;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw progress fill
      ctx.strokeStyle = currentTheme.accent;
      ctx.lineWidth = 17;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, ringGeometry.startAngle, ringGeometry.endAngle, false);
      ctx.stroke();

      // Draw score inside ring
      ctx.fillStyle = currentTheme.text;
      ctx.font = "900 64px Archivo, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(averagePercentage.toString() + "%", centerX, centerY + 12);

      ctx.fillStyle = "#9A9A93";
      ctx.font = "900 15px Inter, sans-serif";
      ctx.fillText("OVERALL", centerX, centerY + 42);

      currentY += item.height + spacing;
    }

    else if (item.name === "levelLine") {
      ctx.fillStyle = currentTheme.id === 'light' ? '#54544F' : '#D7D7D2';
      ctx.font = "bold 21px Inter, sans-serif";
      ctx.textAlign = "center";

      // Wrapped stage line text
      const text = currentLevelLine;
      const words = text.split(" ");
      let line = "";
      const lines = [];
      const maxWidth = 560;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      let textY = currentY + 30;
      lines.forEach((l) => {
        ctx.fillText(l.trim(), 360, textY);
        textY += 30;
      });

      currentY += item.height + spacing;
    }

    else if (item.name === "dimensions") {
      ctx.textAlign = "left";
      let barY = currentY + 20;

      dimensionsList.forEach((dim) => {
        const isWeak = dim.name === weakestDim;

        // Dimension Label
        ctx.fillStyle = currentTheme.text;
        ctx.font = "bold 18px Inter, sans-serif";
        ctx.fillText(dim.name, 60, barY);

        // If weakest, draw GAP badge
        if (isWeak) {
          ctx.font = "900 11px Inter, sans-serif";
          const badgeWidth = ctx.measureText("GAP").width;
          ctx.fillStyle = "#E5484D";
          ctx.fillRect(60 + ctx.measureText(dim.name).width + 12, barY - 16, badgeWidth + 12, 20);
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText("GAP", 60 + ctx.measureText(dim.name).width + 18, barY - 2);
        }

        // Percentage
        ctx.fillStyle = currentTheme.id === 'light' ? '#6B6B66' : '#9A9A93';
        ctx.font = "bold 18px Archivo, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`${dim.value}%`, 660, barY);

        // Progress Track
        ctx.fillStyle = currentTheme.trackBg;
        ctx.fillRect(60, barY + 12, 600, 10);

        // Progress Fill
        ctx.fillStyle = currentTheme.accent;
        ctx.fillRect(60, barY + 12, 600 * (dim.value / 100), 10);

        barY += 45;
        ctx.textAlign = "left";
      });

      currentY += item.height + spacing;
    }

    else if (item.name === "biggestGap") {
      // Draw vertical yellow accent line
      ctx.fillStyle = currentTheme.accent;
      ctx.fillRect(60, currentY, 6, 70);

      // Subtext
      ctx.fillStyle = "#9A9A93";
      ctx.font = "900 13px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("BIGGEST GAP", 80, currentY + 18);

      // Main value
      ctx.fillStyle = currentTheme.text;
      ctx.font = "900 24px Archivo, sans-serif";
      ctx.fillText(weakestDim.toUpperCase(), 80, currentY + 50);

      currentY += item.height + spacing;
    }
  });

  // Download flow
  const link = document.createElement("a");
  link.download = `${exportName.trim().replace(/\s+/g, "_")}_BML_Score.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
