const criteria = window.RSC_CRITERIA;

/** @type {Record<string, number>} */
const formState = {}; // key -> quantity
/** @type {Record<string, string>} */
const formRawState = {}; // key -> raw user input (pt-BR)
/** @type {Record<string, string[]>} */
const attachmentsByKey = {}; // key -> [filePath]

const $criteriaRoot = document.getElementById('criteriaRoot');
const $summaryRoot = document.getElementById('summaryRoot');
const $toast = document.getElementById('toast');
const $btnExport = document.getElementById('btnExport');
const $btnSaveProject = document.getElementById('btnSaveProject');
const $btnOpenProject = document.getElementById('btnOpenProject');

let isRendering = false;

function toast(msg, isError = false) {
  $toast.textContent = msg;
  $toast.style.display = 'block';
  $toast.style.borderColor = isError ? 'rgba(255,107,107,.4)' : 'rgba(110,168,254,.35)';
  setTimeout(() => {
    $toast.style.display = 'none';
  }, 3500);
}

function keyFor(levelKey, itemKey, subKey) {
  return `${levelKey}.${itemKey}.${subKey}`;
}

const nf2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function safeNumber(v) {
  const n = Number(v);
  if (Number.isFinite(n)) return n;
  return 0;
}

function formatPt2(n) {
  return nf2.format(safeNumber(n));
}

function parsePtNumber(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return 0;
  // Accept: "1", "1,2", "1,23", "1.234,56", "1234,56"
  const normalized = s.replace(/\./g, '').replace(',', '.');
  // Incomplete input like "," or "." should not force a reset while typing.
  if (normalized === '.' || normalized === '-') return 0;
  const n = Number(normalized);
  if (!Number.isFinite(n)) return 0;
  return n;
}

function calc() {
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

function captureFocusAndScroll() {
  const y = window.scrollY;
  const active = document.activeElement;
  if (active && active.tagName === 'INPUT' && active.dataset && active.dataset.key) {
    return {
      y,
      key: active.dataset.key,
      selectionStart: active.selectionStart,
      selectionEnd: active.selectionEnd
    };
  }
  return { y, key: null };
}

function restoreFocusAndScroll(snapshot) {
  if (!snapshot) return;
  window.scrollTo(0, snapshot.y || 0);
  if (!snapshot.key) return;
  const esc = (globalThis.CSS && typeof globalThis.CSS.escape === 'function')
    ? globalThis.CSS.escape
    : (v) => String(v).replace(/["\\]/g, '\\$&');
  const el = document.querySelector(`input[data-key="${esc(snapshot.key)}"]`);
  if (!el) return;
  el.focus({ preventScroll: true });
  try {
    if (typeof snapshot.selectionStart === 'number' && typeof snapshot.selectionEnd === 'number') {
      el.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd);
    }
  } catch {
    // ignore selection errors
  }
}

function render({ preserve = false } = {}) {
  isRendering = true;
  const snap = preserve ? captureFocusAndScroll() : null;
  const totals = calc();

  $criteriaRoot.innerHTML = '';
  for (const level of criteria.levels) {
    const $section = document.createElement('div');
    $section.className = 'rsc-level mb-3 bg-white';

    const $head = document.createElement('div');
    $head.className = 'd-flex align-items-center justify-content-between gap-2 px-3 py-2 border-bottom bg-light';
    const levelTot = totals.levels[level.key];
    $head.innerHTML = `
      <div>
        <div class="fw-bold">${level.label}</div>
        <div class="text-secondary small">Máx: ${formatPt2(level.maxPoints)} pontos</div>
      </div>
      <span class="badge text-bg-success">Total (c/ teto): ${formatPt2(levelTot.totalCapped)}</span>
    `;

    const $body = document.createElement('div');
    $body.className = 'p-3';

    for (const item of level.items) {
      const itemTot = levelTot.items[item.key];
      const $item = document.createElement('div');
      $item.className = 'card mb-3 shadow-sm';

      const $itemHead = document.createElement('div');
      $itemHead.className = 'card-header d-flex align-items-start justify-content-between gap-2';
      $itemHead.innerHTML = `
        <div style="min-width:0" class="me-2">
          <div class="fw-semibold">${item.key}) ${item.title}</div>
          <div class="text-secondary small">Máx do item: ${formatPt2(item.maxPoints)} pontos</div>
        </div>
        <div class="text-end">
          <div class="small text-secondary">Subtotal: <span class="fw-semibold text-body">${formatPt2(itemTot.sum)}</span></div>
          <div class="small text-secondary">Subtotal (c/ teto): <span class="fw-bold text-success">${formatPt2(itemTot.capped)}</span></div>
        </div>
      `;

      const $itemBody = document.createElement('div');
      $itemBody.className = 'card-body';

      for (const sub of item.subitems) {
        const k = keyFor(level.key, item.key, sub.key);
        const subTot = itemTot.sub[sub.key];
        const files = attachmentsByKey[k] ?? [];

        const $sub = document.createElement('div');
        $sub.className = 'rsc-subitem mb-3';

        const $left = document.createElement('div');
        $left.innerHTML = `
          <div class="fw-semibold">${sub.key}) ${sub.label}</div>
          <div class="text-secondary small">Unidade: ${sub.unit} • Pontos por unidade: ${formatPt2(sub.pointsPerUnit)}</div>
          <div class="text-secondary small">Pontos calculados: <span class="fw-bold text-success">${formatPt2(subTot.points)}</span></div>
        `;

        const $qty = document.createElement('div');
        $qty.innerHTML = `
          <label class="form-label small text-secondary mb-1">Quantidade</label>
        `;
        const $input = document.createElement('input');
        $input.type = 'text';
        $input.inputMode = 'decimal';
        $input.autocomplete = 'off';
        $input.spellcheck = false;
        $input.dataset.key = k;
        $input.className = 'form-control form-control-sm';
        $input.value = formRawState[k] ?? formatPt2(subTot.qty ?? 0);
        $input.addEventListener('input', () => {
          const raw = $input.value;
          formRawState[k] = raw;
          const n = Math.max(0, parsePtNumber(raw));
          formState[k] = round2(n);
          render({ preserve: true });
        });
        $input.addEventListener('blur', () => {
          if (isRendering) return;
          formRawState[k] = formatPt2(formState[k] ?? 0);
          $input.value = formRawState[k];
        });
        $qty.appendChild($input);

        const $att = document.createElement('div');
        $att.className = 'd-flex flex-column gap-2';
        const $btnAdd = document.createElement('button');
        $btnAdd.className = 'btn btn-outline-primary btn-sm';
        $btnAdd.textContent = files.length ? `Anexos (${files.length})` : 'Anexar arquivos';
        $btnAdd.addEventListener('click', async () => {
          try {
            const picked = await window.api.pickFiles({
              title: `Selecionar anexos para ${sub.key}`,
              filters: [
                { name: 'PDF e Imagens', extensions: ['pdf', 'png', 'jpg', 'jpeg'] },
                { name: 'Todos', extensions: ['*'] }
              ]
            });
            if (!picked.length) return;
            attachmentsByKey[k] = [...(attachmentsByKey[k] ?? []), ...picked];
            render({ preserve: true });
          } catch (e) {
            toast(`Erro ao anexar: ${e?.message ?? e}`, true);
          }
        });
        $att.appendChild($btnAdd);

        for (const [idx, f] of files.entries()) {
          const $file = document.createElement('div');
          $file.className = 'd-flex align-items-center justify-content-between gap-2 border rounded-3 px-2 py-1 bg-light';
          const name = f.split(/[\\/]/).pop();
          $file.innerHTML = `<button type="button" class="btn btn-link btn-sm p-0 text-start rsc-file-name" title="${f}">${name}</button>`;
          const $nameBtn = $file.querySelector('button');
          $nameBtn.addEventListener('click', async () => {
            try {
              await window.api.openPath(f);
            } catch (e) {
              toast(`Erro ao abrir anexo: ${e?.message ?? e}`, true);
            }
          });
          const $actions = document.createElement('div');
          $actions.className = 'd-flex gap-2';
          const $rm = document.createElement('button');
          $rm.className = 'btn btn-outline-danger btn-sm';
          $rm.textContent = 'Remover';
          $rm.addEventListener('click', () => {
            const list = attachmentsByKey[k] ?? [];
            list.splice(idx, 1);
            attachmentsByKey[k] = list;
            render({ preserve: true });
          });
          $actions.appendChild($rm);
          $file.appendChild($actions);
          $att.appendChild($file);
        }

        const $row = document.createElement('div');
        $row.className = 'row g-3 align-items-start';

        const $colLeft = document.createElement('div');
        $colLeft.className = 'col-12 col-lg-6';
        $colLeft.appendChild($left);

        const $colQty = document.createElement('div');
        $colQty.className = 'col-12 col-sm-4 col-lg-2';
        $colQty.appendChild($qty);

        const $colAtt = document.createElement('div');
        $colAtt.className = 'col-12 col-sm-8 col-lg-4';
        $colAtt.appendChild($att);

        $row.appendChild($colLeft);
        $row.appendChild($colQty);
        $row.appendChild($colAtt);

        $sub.appendChild($row);

        $itemBody.appendChild($sub);
      }

      $item.appendChild($itemHead);
      $item.appendChild($itemBody);
      $body.appendChild($item);
    }

    $section.appendChild($head);
    $section.appendChild($body);
    $criteriaRoot.appendChild($section);
  }

  // Summary
  $summaryRoot.innerHTML = '';
  const $tot = document.createElement('div');
  $tot.className = 'd-flex align-items-center justify-content-between gap-2';
  $tot.innerHTML = `
    <div>
      <div class="fw-bold">Total geral</div>
      <div class="text-secondary small">Soma dos níveis (cada um com teto)</div>
    </div>
    <span class="badge text-bg-success fs-6">${formatPt2(totals.grandTotal)}</span>
  `;
  $summaryRoot.appendChild($tot);

  for (const level of criteria.levels) {
    const lvl = totals.levels[level.key];
    const $r = document.createElement('div');
    $r.className = 'mt-3';
    $r.innerHTML = `
      <div class="d-flex align-items-center justify-content-between gap-2">
        <div class="text-secondary">${level.label}</div>
        <span class="badge text-bg-light border">
          ${formatPt2(lvl.totalCapped)}
          <span class="text-secondary">/ ${formatPt2(level.maxPoints)}</span>
        </span>
      </div>
    `;
    $summaryRoot.appendChild($r);
  }

  restoreFocusAndScroll(snap);
  // allow blur formatting again after DOM is stable
  queueMicrotask(() => {
    isRendering = false;
  });
}

async function exportPdf() {
  try {
    const out = await window.api.savePdf('RSC_IFPR.pdf');
    if (!out) return;

    toast('Gerando PDF... (pode levar alguns segundos)');
    await window.api.generatePdf({
      criteria,
      formState,
      attachmentsByKey,
      outputPath: out,
      openAfter: true
    });
    toast(`PDF gerado em: ${out}`);
  } catch (e) {
    toast(`Erro ao gerar PDF: ${e?.message ?? e}`, true);
  }
}

async function saveProject() {
  try {
    const out = await window.api.saveProject('RSC_IFPR.rscproj');
    if (!out) return;
    toast('Salvando projeto... (pode levar alguns segundos)');
    await window.api.writeProject({
      projectPath: out,
      criteria,
      formState,
      attachmentsByKey
    });
    toast(`Projeto salvo em: ${out}`);
  } catch (e) {
    toast(`Erro ao salvar projeto: ${e?.message ?? e}`, true);
  }
}

async function openProject() {
  try {
    const picked = await window.api.openProject();
    if (!picked) return;
    toast('Abrindo projeto...');
    const loaded = await window.api.readProject({ projectPath: picked });
    if (!loaded) return;

    // replace state
    for (const k of Object.keys(formState)) delete formState[k];
    for (const k of Object.keys(attachmentsByKey)) delete attachmentsByKey[k];
    for (const k of Object.keys(formRawState)) delete formRawState[k];

    Object.assign(formState, loaded.formState ?? {});
    Object.assign(attachmentsByKey, loaded.attachmentsByKey ?? {});
    for (const [k, v] of Object.entries(formState)) {
      formRawState[k] = formatPt2(v);
    }

    render({ preserve: true });
    toast('Projeto carregado.');
  } catch (e) {
    toast(`Erro ao abrir projeto: ${e?.message ?? e}`, true);
  }
}

$btnExport.addEventListener('click', exportPdf);
$btnSaveProject?.addEventListener('click', saveProject);
$btnOpenProject?.addEventListener('click', openProject);
render({ preserve: true });

