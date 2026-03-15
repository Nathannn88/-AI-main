/** 根布局 — 配置全局字体、元数据和主题 */

import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans, Crimson_Pro, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-cinis',
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
  title: '有缺陷的AI — 栖迟',
  description: '一个拥有独特人格、审美偏好和成长系统的 AI 伴侣。来自谱渊的谱织师，带着注定完成的使命和注定结束的旅程。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${crimsonPro.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-abyss-900 text-txt-primary font-body antialiased">
        {children}
      </body>
    </html>
  );
}
