// Usage (from the HQ folder): npx tsx .claude/skills/learn/scripts/gemini-extract.ts <public-youtube-url> <out-file.md>
// Requires GEMINI_API_KEY. Override model with GEMINI_MODEL (check ai.google.dev/gemini-api/docs/models).
import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { loadEnvFile } from "../../../../system/scripts/hq-lib.mjs";

loadEnvFile();

const [url, outFile] = process.argv.slice(2);
if (!url || !outFile) {
  console.error("usage: gemini-extract <url> <out-file>");
  process.exit(1);
}
if (!process.env.GEMINI_API_KEY) {
  console.error("FAILED: GEMINI_API_KEY is not set. Run /onboard stack to save one, or export GEMINI_API_KEY yourself.");
  process.exit(1);
}

const model = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
const prompt = readFileSync(new URL("./extraction-prompt.md", import.meta.url), "utf8");
const ai = new GoogleGenAI({});

try {
  const response = await ai.models.generateContent({
    model,
    contents: [
      { fileData: { fileUri: url } }, // docs: put the text prompt after the video
      { text: prompt },
    ],
  });
  const text = response.text ?? "";
  if (!text.trim()) throw new Error("empty response (video may be private, unavailable, or blocked)");
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(
    outFile,
    `---\nsource: ${url}\nmodel: ${model}\nextracted: ${new Date().toISOString()}\n---\n\n${text}\n`
  );
  console.log(`ok ${outFile}`);
} catch (err) {
  console.error(`FAILED ${url}: ${(err as Error).message}`);
  process.exit(2);
}
