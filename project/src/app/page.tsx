/** Landing Page — 全屏沉浸式引入，滚动展示角色与功能 */

'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import StoryIntro from '@/components/landing/StoryIntro';
import FeatureShowcase from '@/components/landing/FeatureShowcase';
import EnterButton from '@/components/landing/EnterButton';
import ParticleCanvas from '@/components/landing/ParticleCanvas';

export default function Home() {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);

  const handleEnter = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      router.push('/chat');
    }, 800);
  }, [router]);

  return (
    <main className="relative min-h-screen bg-abyss-950 overflow-x-hidden">
      {/* 背景粒子 */}
      <ParticleCanvas count={35} />

      {/* 过渡遮罩 */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="fixed inset-0 z-[100] bg-jade-500"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      {/* 主内容 */}
      <HeroSection onEnter={handleEnter} />
      <StoryIntro />
      <FeatureShowcase />
      <EnterButton onEnter={handleEnter} />
    </main>
  );
}
