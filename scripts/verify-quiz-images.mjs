import { existsSync, readFileSync, readdirSync } from "fs";
import { questions } from "../prisma/questions-data.ts";

const urls = [...new Set(questions.filter((q) => q.imageUrl).map((q) => q.imageUrl))];
let failed = false;

for (const url of urls) {
  const path = `public${url}`;
  if (!existsSync(path)) {
    console.error("MISSING:", url);
    failed = true;
    continue;
  }
  const content = readFileSync(path, "utf8");
  if (content.includes("\uFFFD")) {
    console.error("CORRUPT (replacement char):", url);
    failed = true;
  }
  if (url.endsWith(".svg") && !content.includes("</svg>")) {
    console.error("INVALID SVG:", url);
    failed = true;
  }
}

const referenced = new Set(urls.map((u) => u.replace("/images/quiz/", "")));
for (const file of readdirSync("public/images/quiz")) {
  if (file.endsWith(".svg") && !referenced.has(file) && file !== "quiz-result.svg") {
    console.warn("UNREFERENCED:", file);
  }
}

if (failed) {
  process.exit(1);
}
console.log(`OK: ${urls.length} quiz images verified`);
