/** Landing Page — 5 画面竖直 scroll-snap 沉浸式入口 */

'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import MissionSection from '@/components/landing/MissionSection';
import PenguinShowcase from '@/components/landing/PenguinShowcase';
import GrowthTimeline from '@/components/landing/GrowthTimeline';
import EntrySection from '@/components/landing/EntrySection';
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
    <main
      className="relative h-screen bg-abyss-950 overflow-y-auto overflow-x-hidden snap-y snap-mandatory"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {/* 全局背景粒子 */}
      <div className="fixed inset-0 z-particles pointer-events-none">
        <ParticleCanvas count={30} showLines={false} />
      </div>

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

      {/* 画面 1：Hero */}
      <div className="snap-start snap-always">
        <HeroSection />
      </div>

      {/* 画面 2：诗人使命 */}
      <div className="snap-start snap-always">
        <MissionSection />
      </div>

      {/* 画面 3：企鹅能力 */}
      <div className="snap-start snap-always">
        <PenguinShowcase />
      </div>

      {/* 画面 4：成长系统 */}
      <div className="snap-start snap-always">
        <GrowthTimeline />
      </div>

      {/* 画面 5：入口 */}
      <div className="snap-start snap-always">
        <EntrySection onEnter={handleEnter} />
      </div>
    </main>
  );
}
