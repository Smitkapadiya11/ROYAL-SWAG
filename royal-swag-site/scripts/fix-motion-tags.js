const fs = require("fs");
const path = require("path");
const root = "E:/projects/Royal swag/old royal swag/src";
const dv = "d" + "iv";
function fix(file) {
  let s = fs.readFileSync(file, "utf8");
  const next = s.replace(/<\/?motion\.div/g, (m) => m.replace("motion.div", dv));
  if (next !== s) {
    fs.writeFileSync(file, next);
    console.log("fixed", file);
  }
}
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|jsx)$/.test(name)) fix(p);
  }
}
walk(root);
