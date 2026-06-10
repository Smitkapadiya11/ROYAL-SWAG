const fs = require("fs");
const p = "E:/projects/Royal swag/old royal swag/src/components/ui/ProductSocialProof.tsx";
let s = fs.readFileSync(p, "utf8");
s = s.replace(/Only <span className="font-number/, "\u{1F525} Only <span className=\"font-number\"");
if (!s.includes("\u{1F525}")) {
  s = s.replace(
    /<span className="font-sans text-xs font-semibold text-\[#324023\]">\s*[^<]*Only/,
    '<span className="font-sans text-xs font-semibold text-[#324023]">\n              \u{1F525} Only'
  );
}
s = s.replace(/sold this week[^·]*Limited/, "sold this week \u00B7 Limited");
fs.writeFileSync(p, s, "utf8");
console.log(s.split("\n")[21]);
