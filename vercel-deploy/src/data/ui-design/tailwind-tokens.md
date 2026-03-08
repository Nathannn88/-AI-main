# Tailwind CSS Token 配置

> 本文件包含可直接复制到 `tailwind.config.ts` 的配置代码。

---

## 1. 自定义颜色变量

```typescript
// tailwind.config.ts — colors 部分
const colors = {
  // 主色：深空靛青
  abyss: {
    950: '#060D1A',
    900: '#0B1426',
    800: '#111D38',
    700: '#162447',
    600: '#1A2744',
    500: '#223058',
    400: '#2D3F6E',
    300: '#3B5185',
  },

  // 辅色：翡翠流光绿
  jade: {
    200: '#7FF5D5',
    300: '#33EDBA',
    400: '#00C9A7',
    500: '#00E5A0',
    600: '#00A87A',
  },

  // 强调色：琥珀金
  amber: {
    300: '#FFD98E',
    400: '#FFC870',
    500: '#FFB347',
    600: '#FF8C42',
  },

  // 点缀色：深樱红
  ember: {
    300: '#F07080',
    400: '#E84855',
    500: '#C73E5C',
  },

  // 中性文字色
  text: {
    primary: '#E0E6ED',
    secondary: '#8892A0',
    muted: '#5A6478',
    inverse: '#0B1426',
  },
}
```

---

## 2. 完整 tailwind.config.ts 配置

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // =====================
      // 颜色
      // =====================
      colors: {
        abyss: {
          950: '#060D1A',
          900: '#0B1426',
          800: '#111D38',
          700: '#162447',
          600: '#1A2744',
          500: '#223058',
          400: '#2D3F6E',
          300: '#3B5185',
        },
        jade: {
          200: '#7FF5D5',
          300: '#33EDBA',
          400: '#00C9A7',
          500: '#00E5A0',
          600: '#00A87A',
        },
        amber: {
          300: '#FFD98E',
          400: '#FFC870',
          500: '#FFB347',
          600: '#FF8C42',
        },
        ember: {
          300: '#F07080',
          400: '#E84855',
          500: '#C73E5C',
        },
        txt: {
          primary: '#E0E6ED',
          secondary: '#8892A0',
          muted: '#5A6478',
          inverse: '#0B1426',
        },
      },

      // =====================
      // 字体族
      // =====================
      fontFamily: {
        display: ['"Space Grotesk"', '"Outfit"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', '"Sora"', 'system-ui', 'sans-serif'],
        cinis: ['"Crimson Pro"', '"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },

      // =====================
      // 字号
      // =====================
      fontSize: {
        'display-lg': ['72px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['36px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h2': ['28px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
        'h3': ['22px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'body-lg': ['18px', { lineHeight: '1.7', letterSpacing: '0.01em', fontWeight: '400' }],
        'body': ['15px', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '400' }],
        'overline': ['11px', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '600' }],
      },

      // =====================
      // 间距 (额外)
      // =====================
      spacing: {
        '4.5': '1.125rem',   // 18px
        '13': '3.25rem',     // 52px
        '15': '3.75rem',     // 60px
        '18': '4.5rem',      // 72px
        '88': '22rem',       // 352px — 聊天区域最大宽度的一半
        '200': '50rem',      // 800px — 聊天区域最大宽度
      },

      // =====================
      // 圆角
      // =====================
      borderRadius: {
        'bubble-cinis': '2px 16px 16px 16px',   // 栖迟气泡
        'bubble-user': '16px 16px 2px 16px',     // 用户气泡
        'capsule': '28px',                        // 胶囊按钮
        'card': '16px',                           // 卡片
        'modal': '20px',                          // 弹窗
        'modal-lg': '24px',                       // 大型弹窗
      },

      // =====================
      // 背景模糊
      // =====================
      backdropBlur: {
        'glass': '16px',
        'glass-strong': '24px',
        'glass-light': '12px',
      },

      // =====================
      // 阴影
      // =====================
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glass-elevated': '0 16px 48px rgba(0, 0, 0, 0.50), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'jade-glow': '0 0 20px rgba(0, 229, 160, 0.20)',
        'jade-glow-lg': '0 0 30px rgba(0, 229, 160, 0.30)',
        'amber-glow': '0 0 20px rgba(255, 179, 71, 0.20)',
        'ember-glow': '0 0 20px rgba(199, 62, 92, 0.20)',
      },

      // =====================
      // 背景图像 (渐变)
      // =====================
      backgroundImage: {
        // 渐变文字
        'gradient-jade-amber': 'linear-gradient(135deg, #00E5A0, #FFB347)',
        'gradient-amber-ember': 'linear-gradient(135deg, #FFB347, #C73E5C)',
        'gradient-full': 'linear-gradient(135deg, #00E5A0, #FFB347, #C73E5C)',
        // 背景渐变
        'gradient-abyss': 'linear-gradient(180deg, #060D1A 0%, #0B1426 50%, #111D38 100%)',
        'gradient-abyss-radial': 'radial-gradient(ellipse at center, #162447 0%, #0B1426 70%)',
      },

      // =====================
      // 动画 Keyframes
      // =====================
      keyframes: {
        // 呼吸脉冲（谱弦、光晕）
        'pulse-glow': {
          '0%, 100%': {
            opacity: '0.4',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)',
          },
        },

        // 翡翠绿呼吸
        'jade-breathe': {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(0, 229, 160, 0.15)',
          },
          '50%': {
            boxShadow: '0 0 25px rgba(0, 229, 160, 0.30)',
          },
        },

        // 粒子漂浮
        'float': {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '33%': { transform: 'translateY(-8px) translateX(4px)' },
          '66%': { transform: 'translateY(4px) translateX(-6px)' },
          '100%': { transform: 'translateY(0) translateX(0)' },
        },

        // 消息滑入（栖迟侧，从左）
        'slide-in-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-12px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },

        // 消息滑入（用户侧，从右）
        'slide-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(12px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },

        // 淡入上移
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        // 淡出上移
        'fade-out-up': {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
        },

        // 谱弦流光
        'spectrum-flow': {
          '0%': {
            backgroundPosition: '0% 0%',
          },
          '100%': {
            backgroundPosition: '0% 100%',
          },
        },

        // 频率波纹扩散
        'ripple': {
          '0%': {
            transform: 'scale(0)',
            opacity: '0.6',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },

        // 打字指示器
        'typing-dot': {
          '0%, 60%, 100%': {
            opacity: '0.3',
            transform: 'scale(0.8)',
          },
          '30%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },

        // 屏幕震动（事件触发）
        'screen-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%': { transform: 'translateX(-2px)' },
          '20%': { transform: 'translateX(2px)' },
          '30%': { transform: 'translateX(-1px)' },
          '40%': { transform: 'translateX(1px)' },
          '50%': { transform: 'translateX(0)' },
        },

        // 进度条光脉冲
        'progress-pulse': {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },

        // 光点脉动（进度条末端）
        'dot-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 4px currentColor',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 10px currentColor',
            transform: 'scale(1.3)',
          },
        },

        // 全色汇聚（事件D）
        'color-converge': {
          '0%': {
            filter: 'saturate(1) brightness(1)',
          },
          '70%': {
            filter: 'saturate(2) brightness(1.5)',
          },
          '85%': {
            filter: 'saturate(0) brightness(3)',
          },
          '100%': {
            filter: 'saturate(0.3) brightness(0.8)',
          },
        },

        // shimmer（骨架屏）
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      // =====================
      // 动画
      // =====================
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'jade-breathe': 'jade-breathe 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 300ms cubic-bezier(0, 0, 0.2, 1)',
        'slide-in-right': 'slide-in-right 200ms cubic-bezier(0, 0, 0.2, 1)',
        'fade-in-up': 'fade-in-up 400ms cubic-bezier(0, 0, 0.2, 1)',
        'fade-out-up': 'fade-out-up 300ms cubic-bezier(0.4, 0, 1, 1)',
        'spectrum-flow': 'spectrum-flow 8s linear infinite',
        'ripple': 'ripple 600ms cubic-bezier(0, 0, 0.2, 1) forwards',
        'typing-dot': 'typing-dot 1.4s ease-in-out infinite',
        'screen-shake': 'screen-shake 300ms ease-in-out',
        'progress-pulse': 'progress-pulse 2s ease-in-out infinite',
        'dot-pulse': 'dot-pulse 2s ease-in-out infinite',
        'color-converge': 'color-converge 5.5s ease-in-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },

      // =====================
      // 过渡时长
      // =====================
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '800': '800ms',
      },

      // =====================
      // 过渡缓动
      // =====================
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'enter': 'cubic-bezier(0, 0, 0.2, 1)',
        'exit': 'cubic-bezier(0.4, 0, 1, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'breath': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },

      // =====================
      // z-index 层级
      // =====================
      zIndex: {
        'particles': '0',        // 背景粒子
        'content': '10',         // 主内容
        'topbar': '20',          // 顶部栏
        'input': '20',           // 输入栏
        'dropdown': '30',        // 下拉菜单
        'modal-backdrop': '40',  // 弹窗遮罩
        'modal': '50',           // 弹窗内容
        'event': '60',           // 事件弹窗（最高）
        'toast': '70',           // Toast 通知
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 3. CSS 变量（用于动态主题切换）

在 `globals.css` 中定义 CSS 自定义属性，方便根据熟悉度阶段动态切换：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* 阶段相关的动态颜色 — 通过 JS 切换 */
    --phase-primary: theme('colors.jade.500');
    --phase-secondary: theme('colors.jade.400');
    --phase-glow: rgba(0, 229, 160, 0.15);

    /* 谱弦颜色 */
    --chord-color-1: theme('colors.jade.500');
    --chord-color-2: theme('colors.jade.300');
    --chord-opacity: 0.3;

    /* 粒子颜色 */
    --particle-color: theme('colors.jade.500');
    --particle-speed: 1;

    /* 背景环境光 */
    --ambient-color: transparent;
  }

  /* 相识阶段 (20-49%) */
  [data-phase="acquaintance"] {
    --phase-primary: theme('colors.jade.500');
    --phase-secondary: theme('colors.amber.500');
    --phase-glow: rgba(0, 229, 160, 0.12);
    --chord-color-1: theme('colors.jade.500');
    --chord-color-2: theme('colors.amber.500');
    --chord-opacity: 0.5;
    --particle-color: theme('colors.amber.400');
    --ambient-color: rgba(255, 179, 71, 0.03);
  }

  /* 熟悉阶段 (50-79%) */
  [data-phase="familiar"] {
    --phase-primary: theme('colors.amber.500');
    --phase-secondary: theme('colors.ember.500');
    --phase-glow: rgba(255, 179, 71, 0.12);
    --chord-color-1: theme('colors.jade.500');
    --chord-color-2: theme('colors.ember.500');
    --chord-opacity: 0.7;
    --particle-speed: 1.5;
    --ambient-color: rgba(255, 179, 71, 0.04);
  }

  /* 亲近阶段 (80-99%) */
  [data-phase="close"] {
    --phase-primary: theme('colors.ember.500');
    --phase-secondary: theme('colors.ember.400');
    --phase-glow: rgba(199, 62, 92, 0.15);
    --chord-color-1: theme('colors.ember.500');
    --chord-color-2: theme('colors.ember.400');
    --chord-opacity: 0.9;
    --particle-speed: 2;
    --ambient-color: rgba(199, 62, 92, 0.04);
  }

  /* 羁绊阶段 (100%) */
  [data-phase="bonded"] {
    --phase-primary: #9CA3AF;
    --phase-secondary: #6B7280;
    --phase-glow: rgba(156, 163, 175, 0.10);
    --chord-color-1: #9CA3AF;
    --chord-color-2: #6B7280;
    --chord-opacity: 0.4;
    --particle-speed: 0.5;
    --ambient-color: rgba(156, 163, 175, 0.03);
  }
}
```

---

## 4. 常用组件类（@layer components）

```css
@layer components {
  /* 玻璃面板 */
  .glass-panel {
    @apply bg-abyss-900/75 backdrop-blur-glass border border-white/[0.08] shadow-glass;
  }

  .glass-panel-elevated {
    @apply bg-abyss-800/85 backdrop-blur-[24px] border border-white/[0.12] shadow-glass-elevated;
  }

  .glass-panel-light {
    @apply bg-abyss-900/50 backdrop-blur-[12px] border border-white/[0.05];
  }

  /* 栖迟消息气泡 */
  .bubble-cinis {
    @apply bg-jade-500/[0.06] border border-jade-500/[0.15]
           rounded-[2px_16px_16px_16px] px-[18px] py-3.5
           font-cinis text-body-lg text-txt-primary;
  }

  /* 用户消息气泡 */
  .bubble-user {
    @apply bg-white/[0.06] border border-white/[0.08]
           rounded-[16px_16px_2px_16px] px-4 py-3
           font-body text-body text-txt-primary;
  }

  /* 翡翠发光按钮 */
  .btn-jade {
    @apply border-2 border-jade-500 text-jade-500
           font-display font-semibold text-base
           rounded-capsule px-8 py-3
           shadow-jade-glow
           transition-all duration-200 ease-default
           hover:border-jade-300 hover:bg-jade-500/[0.06] hover:shadow-jade-glow-lg
           active:bg-jade-500/[0.12] active:scale-[0.98];
  }

  /* 琥珀实心按钮 */
  .btn-amber {
    @apply bg-amber-500 text-txt-inverse
           font-display font-semibold text-base
           rounded-card px-6 py-2.5
           shadow-amber-glow
           transition-all duration-200 ease-default
           hover:bg-amber-400
           active:scale-[0.98];
  }

  /* Ghost 按钮 */
  .btn-ghost {
    @apply text-txt-secondary
           font-body text-body
           rounded-card px-4 py-2
           transition-all duration-200
           hover:text-txt-primary hover:bg-white/[0.04];
  }

  /* 输入框 */
  .input-chat {
    @apply bg-white/[0.04] border border-white/[0.06]
           rounded-[20px] px-[18px] py-2.5
           text-body text-txt-primary font-body
           placeholder:text-txt-muted
           transition-all duration-200
           focus:border-jade-500/40 focus:outline-none
           focus:shadow-[0_0_8px_rgba(0,229,160,0.10)];
  }

  /* 谱纹纵向光带 */
  .spectrum-chord {
    @apply w-[2px] bg-gradient-to-b from-[var(--chord-color-1)] to-[var(--chord-color-2)]
           opacity-[var(--chord-opacity)]
           animate-spectrum-flow;
  }
}
```

---

## 5. Google Fonts 导入

在 `src/app/layout.tsx` 中使用 Next.js 的 `next/font`：

```typescript
import { Space_Grotesk, DM_Sans, Crimson_Pro, JetBrains_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-cinis',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
})

// 在 <html> 标签上应用：
// className={`${spaceGrotesk.variable} ${dmSans.variable} ${crimsonPro.variable} ${jetbrainsMono.variable}`}
```

然后在 tailwind.config.ts 的 fontFamily 中引用 CSS 变量：

```typescript
fontFamily: {
  display: ['var(--font-display)', '"Outfit"', 'system-ui', 'sans-serif'],
  body: ['var(--font-body)', '"Sora"', 'system-ui', 'sans-serif'],
  cinis: ['var(--font-cinis)', '"Source Serif 4"', 'Georgia', 'serif'],
  mono: ['var(--font-mono)', '"Fira Code"', 'monospace'],
},
```
