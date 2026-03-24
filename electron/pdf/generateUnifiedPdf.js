const path = require('path');
const {
  PDFDocument,
  StandardFonts,
  rgb,
  PDFName,
  PDFNumber,
  PDFArray
} = require('pdf-lib');

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function safeNumber(v) {
  const n = Number(v);
  if (Number.isFinite(n)) return n;
  return 0;
}

const nf2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function formatPt2(n) {
  return nf2.format(safeNumber(n));
}

function wrapText(font, text, size, maxWidth) {
  const words = String(text ?? '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (!words.length) return [''];
  /** @type {string[]} */
  const lines = [];
  let line = words[0];
  for (let i = 1; i < words.length; i++) {
    const candidate = `${line} ${words[i]}`;
    const w = font.widthOfTextAtSize(candidate, size);
    if (w <= maxWidth) {
      line = candidate;
    } else {
      lines.push(line);
      line = words[i];
    }
  }
  lines.push(line);
  return lines;
}

function keyFor(levelKey, itemKey, subKey) {
  return `${levelKey}.${itemKey}.${subKey}`;
}

function calc(criteria, formState) {
  const result = {
    levels: {},
    grandTotal: 0
  };

  for (const level of criteria.levels) {
    let levelSumCappedItems = 0;
    const levelDetail = { items: {}, total: 0, totalCapped: 0, maxPoints: level.maxPoints };

    for (const item of level.items) {
      let itemSum = 0;
      const subDetail = {};
      for (const sub of item.subitems) {
        const k = keyFor(level.key, item.key, sub.key);
        const qty = safeNumber(formState[k] ?? 0);
        const raw = qty * sub.pointsPerUnit;
        const points = round2(raw);
        subDetail[sub.key] = { qty, pointsPerUnit: sub.pointsPerUnit, points };
        itemSum += points;
      }
      itemSum = round2(itemSum);
      const itemCapped = round2(Math.min(itemSum, item.maxPoints));
      levelSumCappedItems += itemCapped;
      levelDetail.items[item.key] = { sum: itemSum, capped: itemCapped, maxPoints: item.maxPoints, sub: subDetail };
    }

    levelDetail.total = round2(levelSumCappedItems);
    levelDetail.totalCapped = round2(Math.min(levelDetail.total, level.maxPoints));
    result.levels[level.key] = levelDetail;
    result.grandTotal += levelDetail.totalCapped;
  }

  result.grandTotal = round2(result.grandTotal);
  return result;
}

function fileExt(p) {
  const ext = path.extname(p || '').toLowerCase();
  return ext.startsWith('.') ? ext.slice(1) : ext;
}

function guessMime(ext) {
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'pdf') return 'application/pdf';
  return 'application/octet-stream';
}

function addGoToLink(pdfDoc, page, rect, destPageRef) {
  // Creates a /Link annotation with a /GoTo action (internal navigation).
  // rect: {x1,y1,x2,y2} in PDF user space coordinates.
  const ctx = pdfDoc.context;
  const annot = ctx.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [rect.x1, rect.y1, rect.x2, rect.y2],
    Border: [0, 0, 0],
    C: [0, 0, 1],
    A: {
      S: 'GoTo',
      D: [destPageRef, PDFName.of('XYZ'), PDFNumber.of(0), PDFNumber.of(0), PDFNumber.of(0)]
    }
  });

  const annotsKey = PDFName.of('Annots');
  const annots = page.node.lookupMaybe(annotsKey, PDFArray);
  if (annots) {
    annots.push(annot);
  } else {
    page.node.set(annotsKey, ctx.obj([annot]));
  }
}

/**
 * @param {{
 *  criteria: any,
 *  formState: Record<string, number>,
 *  attachmentsByKey: Record<string, string[]>,
 *  readFile: (p: string) => Promise<Buffer>
 * }} params
 */
async function generateUnifiedPdf({ criteria, formState, attachmentsByKey, readFile }) {
  const totals = calc(criteria, formState);
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // A4 portrait
  const pageSize = { width: 595.28, height: 841.89 };
  const margin = 40;

  // We build summary first, then append attachments. Links are added after we know destination page refs.
  /** @type {Record<string, import('pdf-lib').PDFPage>} */
  const destPageByKey = {};
  /** @type {Array<{ page: import('pdf-lib').PDFPage, rect: {x1:number,y1:number,x2:number,y2:number}, linkKey: string }>} */
  const pendingLinks = [];

  // Add a placeholder summary page (index 0). We'll draw later.
  let summaryPage = pdfDoc.addPage([pageSize.width, pageSize.height]);

  // Logo on first page header
  try {
    const logoPath = path.join(__dirname, '../../renderer/ifpr_logo.png');
    const logoBytes = await readFile(logoPath);
    const logoImg = await pdfDoc.embedPng(logoBytes);
    const maxLogoH = 28;
    const scale = maxLogoH / logoImg.height;
    const w = logoImg.width * scale;
    const h = logoImg.height * scale;
    summaryPage.drawImage(logoImg, { x: margin, y: pageSize.height - margin - h, width: w, height: h });
  } catch {
    // If logo is missing/cannot be read, skip silently.
  }

  // Draw summary/table page and add links to cover pages.
  summaryPage.drawText('RSC IFPR - Tabela de pontuação (com links para anexos)', {
    x: margin + 90,
    y: pageSize.height - margin - 12,
    size: 14,
    font: fontBold,
    color: rgb(0.05, 0.1, 0.25)
  });

  summaryPage.drawText(criteria.title, {
    x: margin + 90,
    y: pageSize.height - margin - 32,
    size: 9,
    font,
    color: rgb(0.25, 0.25, 0.25)
  });

  let y = pageSize.height - margin - 70;
  const col1 = margin;
  const col2 = 360;
  const col3 = 470;

  function drawColumnHeaders() {
    summaryPage.drawText('Descrição (clique para ir aos anexos)', { x: col1, y, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
    summaryPage.drawText('Pts', { x: col2, y, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
    summaryPage.drawText('Máx', { x: col3, y, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
    y -= 14;
    summaryPage.drawLine({ start: { x: margin, y }, end: { x: pageSize.width - margin, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
    y -= 12;
  }

  function ensureSpace(neededHeight) {
    if (y - neededHeight >= margin + 60) return;
    const p = pdfDoc.addPage([pageSize.width, pageSize.height]);
    p.drawText('Continuação - Tabela de pontuação', { x: margin, y: pageSize.height - margin - 10, size: 12, font: fontBold, color: rgb(0.05, 0.1, 0.25) });
    summaryPage = p;
    y = pageSize.height - margin - 30;
    drawColumnHeaders();
  }

  function headerRow(text) {
    ensureSpace(18);
    summaryPage.drawText(text, { x: col1, y, size: 11, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
    y -= 16;
  }

  function row(text, pts, max, linkKey) {
    const maxW = col2 - col1 - 10;
    const lines = wrapText(font, text, 8.5, maxW);
    const lineHeight = 10.5;
    const blockHeight = lines.length * lineHeight + 2;

    ensureSpace(blockHeight + 4);
    const topY = y;

    for (let i = 0; i < lines.length; i++) {
      summaryPage.drawText(lines[i], { x: col1, y: topY - i * lineHeight, size: 8.5, font, color: rgb(0.1, 0.1, 0.1) });
    }

    summaryPage.drawText(formatPt2(pts), { x: col2, y: topY, size: 8.5, font: fontBold, color: rgb(0.0, 0.4, 0.2) });
    summaryPage.drawText(max === '' ? '' : formatPt2(max), { x: col3, y: topY, size: 8.5, font, color: rgb(0.25, 0.25, 0.25) });

    // Record a link to be created later (after attachments are appended).
    if (linkKey) {
      pendingLinks.push({
        page: summaryPage,
        linkKey,
        rect: { x1: col1 - 2, y1: topY - blockHeight + 2, x2: col2 - 14, y2: topY + 10 }
      });
      // subtle underline cue
      summaryPage.drawLine({
        start: { x: col1, y: topY - 1 },
        end: { x: col2 - 18, y: topY - 1 },
        thickness: 0.5,
        color: rgb(0.15, 0.35, 0.8),
        opacity: 0.35
      });
    }

    y -= blockHeight;
  }

  // Column headers
  drawColumnHeaders();

  for (const level of criteria.levels) {
    const lvl = totals.levels[level.key];
    headerRow(`${level.label} (teto ${formatPt2(level.maxPoints)}) — Total: ${formatPt2(lvl.totalCapped)}`);

    for (const item of level.items) {
      const it = lvl.items[item.key];
      const itemText = `${item.key}) ${item.title}`;
      const itemLines = wrapText(fontBold, itemText, 9, col2 - col1 - 10);
      const itemLineHeight = 11;
      const itemBlockHeight = itemLines.length * itemLineHeight + 2;
      ensureSpace(itemBlockHeight + 4);
      const topY = y;

      for (let i = 0; i < itemLines.length; i++) {
        summaryPage.drawText(itemLines[i], { x: col1, y: topY - i * itemLineHeight, size: 9, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
      }
      summaryPage.drawText(formatPt2(it.capped), { x: col2, y: topY, size: 9, font: fontBold, color: rgb(0.0, 0.4, 0.2) });
      summaryPage.drawText(formatPt2(item.maxPoints), { x: col3, y: topY, size: 9, font, color: rgb(0.25, 0.25, 0.25) });
      y -= itemBlockHeight;

      for (const sub of item.subitems) {
        const k = keyFor(level.key, item.key, sub.key);
        const sd = it.sub[sub.key];
        const has = (attachmentsByKey?.[k] ?? []).length > 0;
        row(
          `   ${sub.key}) ${sub.label} [qtd: ${formatPt2(sd.qty)} × ${formatPt2(sub.pointsPerUnit)}]`,
          sd.points,
          '',
          has ? k : null
        );
      }

      y -= 6;
    }
    y -= 8;
  }

  summaryPage.drawLine({ start: { x: margin, y }, end: { x: pageSize.width - margin, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
  y -= 14;
  summaryPage.drawText(`TOTAL GERAL (níveis com teto): ${formatPt2(totals.grandTotal)}`, { x: margin, y, size: 12, font: fontBold, color: rgb(0.05, 0.25, 0.12) });

  // Append attachments AFTER the full table.
  for (const level of criteria.levels) {
    for (const item of level.items) {
      for (const sub of item.subitems) {
        const k = keyFor(level.key, item.key, sub.key);
        const files = attachmentsByKey?.[k] ?? [];
        if (!files.length) continue;

        // Create a cover page for this subitem; links will point here.
        const cover = pdfDoc.addPage([pageSize.width, pageSize.height]);
        destPageByKey[k] = cover;

        const title = `${level.label} • Item ${item.key} • ${sub.key}`;
        cover.drawText(title, { x: margin, y: pageSize.height - margin - 18, size: 14, font: fontBold, color: rgb(0.1, 0.2, 0.5) });
        cover.drawText(sub.label, { x: margin, y: pageSize.height - margin - 40, size: 11, font, color: rgb(0.1, 0.1, 0.1) });

        const qty = safeNumber(formState[k] ?? 0);
        const points = round2(qty * sub.pointsPerUnit);
        cover.drawText(
          `Quantidade: ${formatPt2(qty)} • Pontos por unidade: ${formatPt2(sub.pointsPerUnit)} • Pontos calculados: ${formatPt2(points)}`,
          {
            x: margin,
            y: pageSize.height - margin - 62,
            size: 10,
            font,
            color: rgb(0.2, 0.2, 0.2)
          }
        );

        cover.drawText('Anexos:', { x: margin, y: pageSize.height - margin - 92, size: 11, font: fontBold, color: rgb(0.1, 0.1, 0.1) });

        let listY = pageSize.height - margin - 110;
        for (const f of files) {
          const name = path.basename(f);
          cover.drawText(`- ${name}`, { x: margin, y: listY, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
          listY -= 12;
          if (listY < margin + 40) break;
        }

        // Append attachment content pages
        for (const filePath of files) {
          const ext = fileExt(filePath);
          const mime = guessMime(ext);
          const buf = await readFile(filePath);

          if (mime === 'application/pdf') {
            const src = await PDFDocument.load(buf);
            const copied = await pdfDoc.copyPages(src, src.getPageIndices());
            for (const p of copied) pdfDoc.addPage(p);
          } else if (mime === 'image/png' || mime === 'image/jpeg') {
            const page = pdfDoc.addPage([pageSize.width, pageSize.height]);
            const img =
              mime === 'image/png' ? await pdfDoc.embedPng(buf) : await pdfDoc.embedJpg(buf);
            const maxW = pageSize.width - margin * 2;
            const maxH = pageSize.height - margin * 2 - 30;
            const scale = Math.min(maxW / img.width, maxH / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            const x = (pageSize.width - w) / 2;
            const y = margin + (maxH - h) / 2;

            page.drawText(path.basename(filePath), { x: margin, y: pageSize.height - margin - 14, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
            page.drawImage(img, { x, y, width: w, height: h });
          } else {
            const page = pdfDoc.addPage([pageSize.width, pageSize.height]);
            page.drawText('Arquivo não incorporado (formato não suportado neste MVP):', { x: margin, y: pageSize.height - margin - 20, size: 12, font: fontBold, color: rgb(0.8, 0.2, 0.2) });
            page.drawText(filePath, { x: margin, y: pageSize.height - margin - 40, size: 10, font, color: rgb(0.2, 0.2, 0.2) });
          }
        }
      }
    }
  }

  // Now that attachment pages exist, create link annotations on the summary pages.
  for (const link of pendingLinks) {
    const dest = destPageByKey[link.linkKey];
    if (!dest) continue;
    addGoToLink(pdfDoc, link.page, link.rect, dest.ref);
  }

  return await pdfDoc.save();
}

module.exports = { generateUnifiedPdf };

