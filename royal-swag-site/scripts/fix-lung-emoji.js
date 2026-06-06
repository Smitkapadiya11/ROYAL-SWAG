const fs = require("fs");
const p = "E:/projects/Royal swag/old royal swag/src/app/lung-test/page.tsx";
let s = fs.readFileSync(p, "utf8");
s = s.replace(/\u{1F9E0}/u, "\u{1FAC1}");
fs.writeFileSync(p, s, "utf8");
console.log("fixed lung emoji");
