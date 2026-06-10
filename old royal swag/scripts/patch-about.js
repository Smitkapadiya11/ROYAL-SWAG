const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "app", "about", "page.tsx");
let s = fs.readFileSync(filePath, "utf8");
const dv = "d" + "iv";

if (!s.includes("FounderPhoto")) {
  s = s.replace(
    'import { SafeImage } from "@/components/ui/SafeImage";',
    'import { SafeImage } from "@/components/ui/SafeImage";\nimport { FounderPhoto } from "@/components/about/FounderPhoto";'
  );
}

s = s.replace(
  'className="relative z-10 flex flex-col gap-5 md:grid md:grid-cols-3 md:gap-6"',
  'className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6"'
);

s = s.replace("{FOUNDERS.map((f, i) => (", "{FOUNDERS.map((f) => (");

s = s.replace(
  /className="glass-card overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1 hover:shadow-xl"\r?\n                style=\{\{ animationDelay: `\$\{i \* 100\}ms` \}\}/,
  'className="glass-card overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1 hover:shadow-xl"'
);

s = s.replace(
  /                <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-\[#324023\] to-\[#9A6F1A\]">[\s\S]*?                <\/div>/,
  [
    "                <" + dv,
    '                  className="flex w-full items-center justify-center bg-gradient-to-br from-[#e9f1dc] to-[#dee5d1]"',
    '                  style={{ minHeight: "320px" }}',
    "                >",
    "                  <FounderPhoto src={f.img} alt={f.name} />",
    "                </" + dv + ">",
  ].join("\r\n")
);

s = s.replace(
  '                <div className="p-5">',
  '                <div className="bg-white/50 p-5">'
);

s = s.replace(
  'className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9A6F1A]"',
  'className="mt-1 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A6F1A]"'
);

s = s.replace(
  'className="mt-2 border-t border-[rgba(255,255,255,0.4)] pt-2"',
  'className="mt-2 border-t border-[rgba(200,210,190,0.4)] pt-2"'
);

s = s.replace(
  'className="font-sans text-xs text-[#45483f]"',
  'className="font-sans text-sm text-[#45483f]"'
);

fs.writeFileSync(filePath, s);
console.log("patched");
