/** 根布局 — 配置全局字体、元数据和主题 */

import type { Metadata } from 'next';
import { Space_Grotesk, Noto_Sans_SC, Crimson_Pro, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-cn',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-poetic',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: '有缺陷的AI — 诗人',
  description: '一个拥有独特人格、鲜明审美立场与完整成长结构的 AI 诗人。一次可终止的审美训练仪式。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${spaceGrotesk.variable} ${notoSansSC.variable} ${crimsonPro.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-abyss-900 text-txt-primary font-cn antialiased">
        {children}
      </body>
    </html>
  );
}
