const fs = require("fs");
const p = "E:/projects/Royal swag/old royal swag/src/app/product/page.tsx";
let s = fs.readFileSync(p, "utf8");
s = s.replace(
  '<span className="font-display text-[32px] font-semibold text-primary">',
  '<span className="price-num font-number text-[32px] font-semibold text-primary">'
);
s = s.replace(
  '<span className="font-sans text-base text-on-surface-variant line-through">',
  '<span className="price-num font-number text-base text-on-surface-variant line-through">'
);
s = s.replace(
  "Save {getSaving(selectedBundle.price, selectedBundle.mrp)}%",
  'Save <span className="font-number tabular-nums">{getSaving(selectedBundle.price, selectedBundle.mrp)}</span>%'
);
fs.writeFileSync(p, s);
console.log("product prices updated");
