const fs = require("fs");
const p = "E:/projects/Royal swag/old royal swag/src/components/lung-test/BreathHoldTest.tsx";
const d = "d" + "iv";
let s = fs.readFileSync(p, "utf8");
s = s.replace(/<\/?motion\.motion.div/g, (m) => m.replace("motion.div", d));
s = s.replace(/<\/?motion\.div/g, (m) => m.replace("motion.div", d));
fs.writeFileSync(p, s);
console.log("fixed breath hold tags");
