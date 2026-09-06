/**
 * 共有時に出る絵（1200×630）を焼く道具。
 *   node tools/shoot-og.mjs [URL]
 *
 * 版下を別に描くのではなく、実際のトップ画面をヘッドレスChromeで
 * 1200×630 で開いて撮る。撮るときだけ、絵に要らないもの
 * （右上の「？」ボタン、写真をえらぶカード）を隠し、
 * 下の生き物ベルトの流れを止めて先頭（こすくま→人間→犬…）に揃える。
 *
 * 既定では本番URLを撮るので、手元の変更を映したいときは
 *   npm run dev の後に node tools/shoot-og.mjs http://localhost:3000
 *
 * 焼いた絵のハッシュを src/app/og-version.ts に書き出す。
 * SNSは og:image を URL 単位で覚えるので、これが変わらないと
 * 絵を差し替えても古いものが出続ける。
 */
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = process.argv[2] ?? "https://creature-vision.kosukuma.com/";

/** 撮るときだけ効かせる化粧 */
const SHOOT_CSS = `
  /* 右上のヘルプは絵に要らない */
  button[aria-label="このアプリについて"] { display: none !important; }
  /* 操作用のカードも要らない（見出しと生き物を見せたい） */
  .upload-card { display: none !important; }
  /* ベルトの流れを止めて、毎回同じ並び（こすくま→人間→犬…）で撮る */
  .belt-track { animation: none !important; }
`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ["--headless=new", "--hide-scrollbars", "--force-device-scale-factor=1"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(SITE, { waitUntil: "networkidle0", timeout: 60000 });
  await page.addStyleTag({ content: SHOOT_CSS });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200)); // 立ち上がりのアニメーションが終わるのを待つ

  const out = path.join(ROOT, "public/og.png");
  await page.screenshot({ path: out });
  console.log(out);

  const version = createHash("sha256").update(await readFile(out)).digest("hex").slice(0, 8);
  const vfile = path.join(ROOT, "src/app/og-version.ts");
  await writeFile(
    vfile,
    `// tools/shoot-og.mjs が og.png を焼くたびに書き換える。手で触らない。\nexport const OG_VERSION = "${version}";\n`,
    "utf8"
  );
  console.log(`${vfile} (${version})`);
} finally {
  await browser.close();
}
