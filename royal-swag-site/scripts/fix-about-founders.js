const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/app/about/page.tsx");
let s = fs.readFileSync(filePath, "utf8");

const start = s.indexOf(
  '          <motion.div className="relative z-10 flex flex-col gap-5'
);
const end = s.indexOf(
  "          </motion.div>\n        </div>\n      </section>\n\n      {/* Certifications */}"
);

if (start === -1 || end === -1 || !endMatch) {
  console.error("Could not find founders block", { start, end });
  process.exit(1);
}

const photoSoon =
  "<" + tag + ' style="color:rgba(255,255,255,0.3);font-size:14px;padding:40px;text-align:center;">Photo coming soon</' + tag + ">";

const replacement = [
  '          <div className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">',
  "            {FOUNDERS.map((f) => (",
  '              <div',
  "                key={f.name}",
  '                className="glass-card overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1 hover:shadow-xl"',
  "              >",
  '                <div',
  '                  className="flex w-full items-center justify-center bg-gradient-to-br from-[#e9f1dc] to-[#dee5d1]"',
  '                  style={{ minHeight: "320px" }}',
  "                >",
  "                  {/* eslint-disable-next-line @next/next/no-img-element */}",
  "                  <img",
  "                    src={f.img}",
  "                    alt={f.name}",
  "                    style={{",
  '                      width: "100%",',
  '                      height: "auto",',
  '                      maxHeight: "400px",',
  '                      objectFit: "contain",',
  '                      objectPosition: "center top",',
  '                      display: "block",',
  "                    }}",
  "                    onError={(e) => {",
  "                      const el = e.currentTarget;",
  '                      el.style.display = "none";',
  "                      const parent = el.parentElement;",
  "                      if (parent) {",
  "                        parent.style.background =",
  '                          "linear-gradient(160deg, #324023, #495738)";',
  "                        parent.innerHTML +=",
  `                          '${photoSoon.replace(/'/g, "\\'")}';`,
  "                      }",
  "                    }}",
  "                  />",
  "                </motion.div>",
  '                <div className="bg-white/50 p-5">',
  '                  <h4 className="font-display text-xl font-bold text-[#324023]">',
  "                    {f.name}",
  "                  </h4>",
  '                  <p className="mt-1 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A6F1A]">',
  "                    {f.role}",
  "                  </p>",
  '                  <div className="mt-2 border-t border-[rgba(200,210,190,0.4)] pt-2">',
  '                    <p className="font-sans text-sm text-[#45483f]">{f.focus}</p>',
  "                  </motion.div>",
  "                </motion.div>",
  "              </motion.div>",
  "            ))}",
  "          </motion.div>",
].join("\r\n");

const fixed = replacement.replace(/<\/?motion\.div/g, (t) =>
  t.replace("motion.div", tag)
);

s = s.slice(0, start) + fixed + s.slice(end);

s = s.replace(/<\/?motion\.div/g, (t) => t.replace("motion.div", tag));

fs.writeFileSync(filePath, s);
console.log("Fixed founders section");
