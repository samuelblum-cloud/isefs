import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont } from "pdf-lib";

import regularAsset from "@/assets/SourceSans3-Regular.ttf.asset.json";
import semiboldAsset from "@/assets/SourceSans3-Semibold.ttf.asset.json";
import { isefsLogoUrl } from "@/content/assets";
import type { Tables } from "@/integrations/supabase/types";

import { boardRegistrationRows } from "./board-pdf-data";

// Called only after hydration; no backend calls or writes.
export async function createBoardPdf(records: readonly Tables<"interest_registrations">[]) {
  if (!records.length) throw new Error("No registrations to export.");
  const generatedAt = new Date();
  const styles = getComputedStyle(document.documentElement);
  const colour = (token: string) => {
    const hex = styles.getPropertyValue(token).trim().replace("#", "");
    if (!/^[a-f\d]{6}$/i.test(hex)) throw new Error("Report brand colours are unavailable.");
    return rgb(
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    );
  };
  const navy = colour("--primary");
  const teal = colour("--accent");
  const ink = colour("--foreground");
  const muted = colour("--muted-foreground");
  const mist = colour("--surface");
  const rule = colour("--rule");
  const white = colour("--background");
  const fetchFont = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Report fonts could not be loaded. Please try again.");
    return response.arrayBuffer();
  };
  const logo = new window.Image();
  logo.src = isefsLogoUrl;
  await logo.decode();
  const canvas = document.createElement("canvas");
  canvas.width = logo.naturalWidth;
  canvas.height = logo.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Report logo could not be prepared.");
  ctx.drawImage(logo, 0, 0);
  const [regularBytes, semiboldBytes] = await Promise.all([
    fetchFont(regularAsset.url),
    fetchFont(semiboldAsset.url),
  ]);
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const regular = await pdf.embedFont(regularBytes, { subset: true });
  const semibold = await pdf.embedFont(semiboldBytes, { subset: true });
  const image = await pdf.embedPng(canvas.toDataURL("image/png"));
  const title = "ISEFS Membership Interest Registrations";
  pdf.setTitle(title);
  pdf.setAuthor("ISEFS");
  pdf.setSubject("Confidential Board report");
  pdf.setCreationDate(generatedAt);
  const widths = [24, 95, 135, 58, 100, 95, 90, 90, 99];
  const headers = [
    "No.",
    "Full name",
    "Email",
    "Country",
    "Specialty / professional role",
    "Institution",
    "Areas of interest",
    "Registered (UTC)",
    "Workflow status",
  ];
  const margin = 28;
  const tableTop = 435;
  const bottom = 48;
  const fontSize = 9;
  const lineHeight = 12;
  const wrap = (text: string, width: number, font: PDFFont, size: number) => {
    const lines: string[] = [];
    for (const paragraph of text.replace(/\r/g, "").split("\n")) {
      let line = "";
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        const candidate = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) <= width) {
          line = candidate;
          continue;
        }
        if (line) {
          lines.push(line);
          line = "";
        }
        for (const char of word) {
          if (line && font.widthOfTextAtSize(line + char, size) > width) {
            lines.push(line);
            line = "";
          }
          line += char;
        }
      }
      lines.push(line);
    }
    return lines;
  };
  const timestamp = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "medium",
    timeZone: "UTC",
  }).format(generatedAt);
  const newPage = () => {
    const page = pdf.addPage([841.89, 595.28]);
    const logoWidth = 270;
    const logoHeight = (logoWidth * image.height) / image.width;
    page.drawImage(image, {
      x: margin,
      y: 595.28 - 20 - logoHeight,
      width: logoWidth,
      height: logoHeight,
    });
    page.drawText("CONFIDENTIAL — FOR BOARD USE ONLY", {
      x: 495,
      y: 552,
      font: semibold,
      size: 10,
      color: navy,
    });
    page.drawText(title, { x: margin, y: 480, font: semibold, size: 21, color: navy });
    page.drawText(`Generated: ${timestamp} UTC  |  Total records: ${records.length}`, {
      x: margin,
      y: 459,
      font: regular,
      size: 10,
      color: muted,
    });
    page.drawLine({
      start: { x: margin, y: 447 },
      end: { x: 814, y: 447 },
      thickness: 1.5,
      color: teal,
    });
    page.drawRectangle({ x: margin, y: tableTop - 35, width: 786, height: 35, color: navy });
    let x = margin;
    headers.forEach((header, i) => {
      wrap(header, widths[i] - 10, semibold, fontSize).forEach((line, j) =>
        page.drawText(line, {
          x: x + 5,
          y: tableTop - 12 - j * 11,
          font: semibold,
          size: fontSize,
          color: white,
        }),
      );
      x += widths[i];
    });
    return page;
  };
  let page = newPage();
  let y = tableTop - 35;
  for (const [index, row] of boardRegistrationRows(records).entries()) {
    const cells = row.map((cell, i) => wrap(cell, widths[i] - 10, regular, fontSize));
    const length = Math.max(...cells.map((cell) => cell.length));
    // Keep normal rows intact; exceptionally tall rows continue without truncation.
    if (
      length * lineHeight + 12 <= tableTop - 35 - bottom &&
      y - length * lineHeight - 12 < bottom
    ) {
      page = newPage();
      y = tableTop - 35;
    }
    let offset = 0;
    while (offset < length) {
      const capacity = Math.floor((y - bottom - 12) / lineHeight);
      if (capacity < 1) {
        page = newPage();
        y = tableTop - 35;
        continue;
      }
      const count = Math.min(capacity, length - offset);
      const height = count * lineHeight + 12;
      if (index % 2 === 0)
        page.drawRectangle({ x: margin, y: y - height, width: 786, height, color: mist });
      let x = margin;
      cells.forEach((cell, i) => {
        cell.slice(offset, offset + count).forEach((line, j) =>
          page.drawText(line, {
            x: x + 5,
            y: y - 14 - j * lineHeight,
            font: regular,
            size: fontSize,
            color: ink,
          }),
        );
        x += widths[i];
      });
      page.drawLine({
        start: { x: margin, y: y - height },
        end: { x: 814, y: y - height },
        thickness: 0.5,
        color: rule,
      });
      y -= height;
      offset += count;
    }
  }
  const pages = pdf.getPages();
  pages.forEach((item, index) => {
    item.drawText("ISEFS  |  CONFIDENTIAL — FOR BOARD USE ONLY", {
      x: margin,
      y: 25,
      font: regular,
      size: 8,
      color: muted,
    });
    item.drawText(`Page ${index + 1} of ${pages.length}`, {
      x: 742,
      y: 25,
      font: regular,
      size: 8,
      color: muted,
    });
  });
  const bytes = await pdf.save();
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    filename: `ISEFS_Membership_Interest_Registrations_${generatedAt.toISOString().slice(0, 10)}.pdf`,
  };
}
