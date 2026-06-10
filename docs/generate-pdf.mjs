import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { marked } from "marked";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mdPath = join(__dirname, "WUFFI-ARCHITECTURE-ROADMAP.md");
const cssPath = join(__dirname, "pdf-style.css");
const htmlPath = join(__dirname, "WUFFI-ARCHITECTURE-ROADMAP.html");
const pdfPath = join(__dirname, "WUFFI-ARCHITECTURE-ROADMAP.pdf");

const chromePath =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const md = readFileSync(mdPath, "utf8");
const css = readFileSync(cssPath, "utf8");

// Strip YAML frontmatter if present
const bodyMd = md.replace(/^---[\s\S]*?---\n/, "");

const html = `<!DOCTYPE html>
<html lang="es-AR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WUFFI — Arquitectura y Roadmap</title>
  <style>${css}</style>
</head>
<body>
${marked.parse(bodyMd)}
</body>
</html>`;

writeFileSync(htmlPath, html, "utf8");

execFileSync(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    `--print-to-pdf=${pdfPath}`,
    "--print-to-pdf-no-header",
    htmlPath,
  ],
  { stdio: "inherit" },
);

console.log(`PDF generado: ${pdfPath}`);
