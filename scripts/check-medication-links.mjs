import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const dataDirectory = path.join(root, "data", "medications");
const files = (await readdir(dataDirectory))
  .filter((name) => name.endsWith("-audited.csv"))
  .sort();

const texts = await Promise.all(
  files.map((name) => readFile(path.join(dataDirectory, name), "utf8"))
);
const urls = [...new Set(
  texts.flatMap((text) => (
    text.match(/https:\/\/www\.pmda\.go\.jp\/[^",\r\n]+/g) || []
  ))
)];

const concurrency = 8;
const results = [];

for (let index = 0; index < urls.length; index += concurrency) {
  const chunk = urls.slice(index, index + concurrency);
  const chunkResults = await Promise.all(chunk.map(async (url) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "Mozilla/5.0 medication-link-audit" }
      });
      await response.body?.cancel();
      return { url, status: response.status, ok: response.ok };
    } catch (error) {
      return { url, status: 0, ok: false, error: String(error) };
    } finally {
      clearTimeout(timeout);
    }
  }));
  results.push(...chunkResults);
}

const failed = results.filter((result) => !result.ok);
console.log(`PMDA links: ${results.length}, OK: ${results.length - failed.length}, failed: ${failed.length}`);

for (const result of failed) {
  console.error(`${result.status || "ERR"} ${result.url}${result.error ? ` (${result.error})` : ""}`);
}

process.exitCode = failed.length === 0 ? 0 : 1;
