import type { Metadata } from "next";
import "./globals.css";
import { OG_VERSION } from "./og-version";

const SITE_URL = "https://creature-vision.kosukuma.com";
// 共有したときに出る絵。実際のトップ画面を撮ったもので、
// 焼き直しは node tools/shoot-og.mjs。焼くたびに ?v= が変わり、
// SNS が持っている古い絵を捨てて取り直す。
const OG_IMAGE = `${SITE_URL}/og.png?v=${OG_VERSION}`;
// SNSに貼ったときの見出しは、このサイトの呼び名そのもの
const SHARE_TITLE = "生き物の視点";
const SHARE_DESCRIPTION = "写真をアップして、24種類の生き物の目で見てみよう。";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://creature-vision.vercel.app"
  ),
  title: "Creature Vision Lab — 生き物の目で世界を見よう",
  description:
    "写真や動画をアップロードして、100種類の生き物の視覚フィルターで世界を体験しよう！",
  // ?x=1 のようにクエリを付けて配っても、素のURLと同じ1ページとして扱われるように
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Creature Vision Lab",
    locale: "ja_JP",
    type: "website",
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: SHARE_TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
