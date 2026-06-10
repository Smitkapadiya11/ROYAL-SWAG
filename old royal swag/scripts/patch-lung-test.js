const fs = require("fs");
const path = require("path");

const pagePath = path.join(__dirname, "../src/app/lung-test/page.tsx");
let s = fs.readFileSync(pagePath, "utf8");
const d = "d" + "iv";

const introOld =
  /            <div\r?\n              className="relative mb-8 h-52 w-full overflow-hidden rounded-3xl shadow-lg"[\s\S]*?            <\/div>\r?\n\r?\n            <h1 className="mb-3 font-display/;

const introNew = `            <${d}
              className="relative mb-8 w-full overflow-hidden rounded-2xl shadow-sm"
              style={{ height: "200px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/lungtest.jpeg"
                alt="Lung Health Test"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.style.background =
                      "linear-gradient(160deg, #324023 0%, #495738 60%, #9A6F1A 100%)";
                  }
                }}
              />
              <${d} className="absolute inset-0 bg-gradient-to-t from-[#495738]/80 to-transparent" />
              <${d} className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="text-2xl">\u{1F9E0}</span>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white">
                  60-Second Assessment
                </span>
              </${d}>
            </${d}>

            <h1 className="mb-3 font-display`;

if (!introOld.test(s)) {
  console.error("intro block not found");
  process.exit(1);
}
s = s.replace(introOld, introNew);

s = s.replace(
  /<BreathHoldTest onComplete=\{saveAndShowResult\} disabled=\{submitting\} \/>/,
  `<BreathHoldTest
                onComplete={saveAndShowResult}
                disabled={submitting}
                onBack={() => {
                  setView("questions");
                  setCurrentQ(LUNG_TEST_QUESTIONS.length - 1);
                }}
              />`
);

s = s.replace(/<\/?motion\.div/g, (m) => m.replace("motion.div", d));

fs.writeFileSync(pagePath, s);
console.log("patched lung-test page");
