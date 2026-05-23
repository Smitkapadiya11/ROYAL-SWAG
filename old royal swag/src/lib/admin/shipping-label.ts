import type { ShippingLabelOrder } from "@/components/ShippingLabel";

const FSSAI =
  process.env.NEXT_PUBLIC_FSSAI_NUMBER ||
  process.env.NEXT_PUBLIC_FSSAI_LICENSE ||
  "—";

export function formatLabelDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function renderLabelHTML(order: ShippingLabelOrder): string {
  const site = typeof window !== "undefined" ? window.location.origin : "";
  const logo = `${site}/images/logo/Royalswag_LOGO01.png`;
  const date = formatLabelDate(order.created_at);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Label ${order.order_id}</title>
  <style>
    @page { size: 100mm 150mm; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      width: 100mm;
      min-height: 150mm;
      padding: 8mm;
      color: #171e11;
      font-size: 11px;
      line-height: 1.4;
    }
    .logo { display: block; margin: 0 auto 6mm; height: 12mm; width: auto; object-fit: contain; }
    .rule { border-top: 1px dashed #324023; margin: 4mm 0; opacity: 0.4; }
    .ship-title { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; color: #495738; margin-bottom: 2mm; }
    .name { font-size: 14px; font-weight: 700; margin-bottom: 2mm; }
    .meta { font-size: 11px; }
    .row { display: flex; justify-content: space-between; gap: 4mm; margin-top: 2mm; font-size: 10px; }
    .barcode-wrap { text-align: center; margin-top: 4mm; }
  </style>
</head>
<body>
  <img class="logo" src="${logo}" alt="Royal Swag" />
  <div class="rule"></div>
  <div class="ship-title">SHIP TO:</div>
  <div class="name">${escapeHtml(order.customer_name)}</div>
  <div class="meta">${escapeHtml(order.address)}</div>
  <div class="meta">${escapeHtml(order.city)} — ${escapeHtml(order.state)} — ${escapeHtml(order.pincode)}</div>
  <div class="meta">Mobile: ${escapeHtml(order.mobile)}</div>
  <div class="rule"></div>
  <div class="row">
    <span><strong>ORDER:</strong> ${escapeHtml(order.order_id)}</span>
    <span><strong>PACK:</strong> ${escapeHtml(order.pack)}</span>
  </div>
  <div class="row">
    <span><strong>AMOUNT:</strong> ₹${order.amount}</span>
    <span><strong>DATE:</strong> ${date}</span>
  </div>
  <div class="rule"></div>
  <div class="barcode-wrap">
    <svg id="barcode"></svg>
    <div style="font-size:10px;margin-top:2mm;">${escapeHtml(order.order_id)}</div>
  </div>
  <div class="rule"></div>
  <p style="text-align:center;font-size:9px;margin-top:3mm;">
    Royal Swag · Lung Detox Tea<br/>
    Breathe Clean. Live Free.<br/>
    FSSAI: ${escapeHtml(FSSAI)}
  </p>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.12.3/dist/JsBarcode.all.min.js"><\/script>
  <script>
    JsBarcode("#barcode", ${JSON.stringify(order.order_id)}, {
      format: "CODE128",
      width: 1.4,
      height: 48,
      displayValue: false,
      margin: 0
    });
  <\/script>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function printLabel(order: ShippingLabelOrder) {
  const win = window.open("", "_blank", "width=400,height=600");
  if (!win) return;
  win.document.write(renderLabelHTML(order));
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
  }, 500);
}

export function printLabelsBulk(orders: ShippingLabelOrder[]) {
  const site = window.location.origin;
  const logo = `${site}/images/logo/Royalswag_LOGO01.png`;
  const fssai =
    process.env.NEXT_PUBLIC_FSSAI_NUMBER ||
    process.env.NEXT_PUBLIC_FSSAI_LICENSE ||
    "—";

  const pages = orders
    .map((order) => {
      const date = formatLabelDate(order.created_at);
      return `
      <div class="label-page">
        <img class="logo" src="${logo}" alt="Royal Swag" />
        <div class="rule"></div>
        <div class="ship-title">SHIP TO:</div>
        <div class="name">${escapeHtml(order.customer_name)}</div>
        <div class="meta">${escapeHtml(order.address)}</div>
        <div class="meta">${escapeHtml(order.city)} — ${escapeHtml(order.state)} — ${escapeHtml(order.pincode)}</div>
        <div class="meta">Mobile: ${escapeHtml(order.mobile)}</div>
        <div class="rule"></div>
        <div class="row"><span><strong>ORDER:</strong> ${escapeHtml(order.order_id)}</span><span><strong>PACK:</strong> ${escapeHtml(order.pack)}</span></div>
        <div class="row"><span><strong>AMOUNT:</strong> ₹${order.amount}</span><span><strong>DATE:</strong> ${date}</span></div>
        <div class="rule"></div>
        <div class="barcode-wrap"><svg class="bc" data-id="${escapeHtml(order.order_id)}"></svg><div style="font-size:10px;margin-top:2mm;">${escapeHtml(order.order_id)}</div></div>
        <div class="rule"></div>
        <p class="footer">Royal Swag · Lung Detox Tea<br/>Breathe Clean. Live Free.<br/>FSSAI: ${escapeHtml(fssai)}</p>
      </div>`;
    })
    .join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    @page { size: 100mm 150mm; margin: 0; }
    .label-page { page-break-after: always; width: 100mm; min-height: 150mm; padding: 8mm; font-family: system-ui; font-size: 11px; color: #171e11; }
    .label-page:last-child { page-break-after: auto; }
    .logo { display:block;margin:0 auto 6mm;height:12mm; }
    .rule { border-top:1px dashed #324023;margin:4mm 0;opacity:0.4; }
    .ship-title { font-size:9px;font-weight:700;letter-spacing:0.12em;color:#495738; }
    .name { font-size:14px;font-weight:700;margin:4px 0; }
    .row { display:flex;justify-content:space-between;font-size:10px;margin-top:2mm; }
    .barcode-wrap { text-align:center;margin-top:4mm; }
    .footer { text-align:center;font-size:9px;margin-top:3mm; }
  </style></head><body>${pages}
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.12.3/dist/JsBarcode.all.min.js"><\/script>
  <script>
    document.querySelectorAll('.bc').forEach(function(el) {
      JsBarcode(el, el.getAttribute('data-id'), { format: 'CODE128', width: 1.4, height: 48, displayValue: false });
    });
  <\/script></body></html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
  }, 800);
}
