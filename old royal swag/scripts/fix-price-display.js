const fs = require("fs");
const p = "E:/projects/Royal swag/old royal swag/src/components/ui/PriceDisplay.tsx";
let s = fs.readFileSync(p, "utf8");
s = s.replace(
  'className="font-number text-lg text-[#75786e] line-through decoration-[#ba1a1a] decoration-2"',
  'className="price-num font-number text-lg text-[#75786e] line-through decoration-[#ba1a1a] decoration-2" data-price'
);
s = s.replace('      </motion.div>\n      <div className="flex flex-wrap items-center gap-2">', '      </div>\n      <div className="flex flex-wrap items-center gap-2">');
s = s.replace('    </motion.div>\n  );', '    </motion.div>\n  );'.replace('motion.div', 'd'+'iv'));
fs.writeFileSync(p, s);
