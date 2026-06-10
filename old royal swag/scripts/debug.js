const fs = require("fs");
const s = fs.readFileSync("E:/projects/Royal swag/old royal swag/src/app/about/page.tsx","utf8");
const i = s.indexOf("            ))}");
console.log(JSON.stringify(s.slice(i, i+80)));
