# Tailwind 设计 Token

> 本文件将 design-system.md 中的视觉规范转化为 Tailwind CSS 可用的 token。
> 所有自定义值写入 tailwind.config.ts，组件 recipe 在 globals.css 的 @layer components 中定义。

---

## 一、颜色 Token

### 品牌色（`colors.brand`）

```typescript
brand: {
  // 深空靛青（Abyss）
  deep: {
    950: '#040A14',  // 最深背景、灯塔海面
    900: '#0B1426',  // 主背景
    850: '#0E1A32',  // 卡片底色
    800: '#111D38',  // 悬浮面板
    700: '#162447',  // 输入框默认态
    600: '#1E3055',  // 分割线
    500: '#263D6A',  // hover 背景
    400: '#2D4A7E',  // 滚动条 hover
    300: '#3B5E99',  // 禁用文字
  },
  // 翡翠绿（Jade）
  jade: {
    100: '#B3FBE8',
    200: '#7FF5D5',
    300: '#33EDBA',
    400: '#00C9A7',
    500: '#00E5A0',  // 主色
    600: '#00A87A',
    700: '#007A58',
  },
  // 琥珀金（Amber）
  amber: {
    100: '#FFF0D4',
    200: '#FFE4B0',
    300: '#FFD98E',
    400: '#FFC870',
    500: '#FFB347',  // 主色
    600: '#FF8C42',
    700: '#E06B1F',
  },
  // 深樱红（Ember）
  ember: {
    100: '#FBD5DB',
    200: '#F5A0B0',
    300: '#F07080',
    400: '#E84855',
    500: '#C73E5C',  // 主色
    600: '#A32E48',
    700: '#7A1F35',
  },
  // 星蓝紫（Astral）
  astral: {
    100: '#E8E4FC',
    200: '#C5BDFB',
    300: '#A39AF5',
    400: '#8577EE',
    500: '#6C5CE7',  // 主色
    600: '#5643C9',
    700: '#3F2FA8',
  },
}
```

### 失速色（`colors.stall`）

```typescript
stall: {
  warning: '#5A5A5A',     // 预警灰
  stalled: '#3C3C3C',     // 失速灰
  deep: '#1E1E26',        // 深度失速
  overlay: '#282832',     // 蒙层色
}
```

### 灯塔色（`colors.lighthouse`）

```typescript
lighthouse: {
  sea: {
    deep: '#040A14',      // 海面暗部
    surface: '#0A1525',   // 海面波峰
  },
  sky: '#060E1C',         // 天空
  beam: '#FFF8E7',        // 光束暖白
  'beam-dim': '#D4C9A8',  // 光束衰减
  stone: '#3A3D42',       // 灯塔材质
}
```

### 文字色（`colors.txt`）

```typescript
txt: {
  primary: '#E8EDF4',
  secondary: '#8B95A6',
  muted: '#576173',
  ghost: '#3A4556',
  inverse: '#0B1426',
  warn: '#F07080',
  accent: '#00E5A0',
  warm: '#FFD98E',
}
```

### 航程色（`colors.voyage`）

```typescript
voyage: {
  sea: '#1A3A6E',         // 航程深蓝海面
  'sea-light': '#234B8A', // 航程深蓝浅色
  horizon: '#FFB347',     // 地平线光带
}
```

---

## 二、字体 Token

### fontFamily

```typescript
fontFamily: {
  cn: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
  display: ['"Space Grotesk"', '"Outfit"', 'system-ui', 'sans-serif'],
  poetic: ['"Crimson Pro"', '"Noto Serif SC"', 'Georgia', 'serif'],
  mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
}
```

### fontSize

```typescript
fontSize: {
  'display-hero': ['80px', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
  'display-lg': ['64px', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '700' }],
  'display': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
  'h1': ['36px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
  'h2': ['28px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
  'h3': ['22px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
  'h4': ['18px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '500' }],
  'body-lg': ['18px', { lineHeight: '1.75', letterSpacing: '0.01em', fontWeight: '400' }],
  'body': ['15px', { lineHeight: '1.65', letterSpacing: '0.01em', fontWeight: '400' }],
  'body-sm': ['14px', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '400' }],
  'caption': ['13px', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '400' }],
  'overline': ['11px', { lineHeight: '1.4', letterSpacing: '0.1em', fontWeight: '600' }],
  'poetic': ['20px', { lineHeight: '1.8', letterSpacing: '0.02em', fontWeight: '400' }],
  'mono-sm': ['13px', { lineHeight: '1.5', letterSpacing: '0.03em', fontWeight: '400' }],
}
```

---

## 三、间距 Token

```typescript
spacing: {
  '0.5': '2px',
  '1': '4px',
  '1.5': '6px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '4.5': '18px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
  '20': '80px',
  '24': '96px',
  // 特殊尺寸
  '88': '22rem',    // 企鹅面板展开宽度
  '200': '50rem',   // 最大内容宽度
}
```

---

## 四、圆角 Token

```typescript
borderRadius: {
  'bubble-poet': '2px 18px 18px 18px',
  'bubble-user': '18px 18px 2px 18px',
  'bubble-astral': '4px',
  'ember-card': '2px 12px 12px 12px',
  'capsule': '28px',
  'card': '16px',
  'modal': '20px',
  'modal-lg': '24px',
  'input': '20px',
  'bar': '8px',
  'tag': '6px',
}
```

---

## 五、阴影 Token

```typescript
boxShadow: {
  'low': '0 4px 16px rgba(0, 0, 0, 0.25)',
  'glass': '0 8px 32px rgba(0, 0, 0, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  'elevated': '0 16px 48px rgba(0, 0, 0, 0.50), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
  'dramatic': '0 24px 64px rgba(0, 0, 0, 0.60)',
  'jade-glow': '0 0 20px rgba(0, 229, 160, 0.20)',
  'jade-glow-lg': '0 0 36px rgba(0, 229, 160, 0.30)',
  'amber-glow': '0 0 20px rgba(255, 179, 71, 0.20)',
  'amber-glow-lg': '0 0 36px rgba(255, 179, 71, 0.30)',
  'ember-glow': '0 0 20px rgba(199, 62, 92, 0.20)',
  'astral-glow': '0 0 20px rgba(108, 92, 231, 0.20)',
}
```

---

## 六、毛玻璃 Token

```typescript
backdropBlur: {
  'glass-light': '10px',
  'glass': '16px',
  'glass-strong': '24px',
  'glass-ember': '20px',
}
```

---

## 七、渐变 Token

```typescript
backgroundImage: {
  'gradient-jade-amber': 'linear-gradient(135deg, #00E5A0, #FFB347)',
  'gradient-amber-ember': 'linear-gradient(135deg, #FFB347, #C73E5C)',
  'gradient-jade-ember': 'linear-gradient(135deg, #00E5A0, #C73E5C)',
  'gradient-full': 'linear-gradient(135deg, #00E5A0, #FFB347, #C73E5C)',
  'gradient-astral': 'linear-gradient(135deg, #6C5CE7, #A39AF5)',
  'gradient-deep': 'linear-gradient(180deg, #040A14 0%, #0B1426 50%, #111D38 100%)',
  'gradient-deep-radial': 'radial-gradient(ellipse at center, #162447 0%, #0B1426 70%)',
  'gradient-voyage': 'linear-gradient(180deg, #0B1426, #1A3A6E)',
  'gradient-fuel-healthy': 'linear-gradient(to top, #007A58, #00E5A0)',
  'gradient-fuel-warning': 'linear-gradient(to top, #E06B1F, #FFB347)',
  'gradient-fuel-danger': 'linear-gradient(to top, #7A1F35, #C73E5C)',
}
```

---

## 八、动画 Token

### keyframes

```typescript
keyframes: {
  // 基础
  'pulse-glow': {
    '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
    '50%': { opacity: '1', transform: 'scale(1.05)' },
  },
  'breathe': {
    '0%, 100%': { opacity: '0.3' },
    '50%': { opacity: '0.8' },
  },
  'jade-breathe': {
    '0%, 100%': { boxShadow: '0 0 15px rgba(0, 229, 160, 0.15)' },
    '50%': { boxShadow: '0 0 30px rgba(0, 229, 160, 0.35)' },
  },
  'amber-pulse': {
    '0%, 100%': { boxShadow: '0 0 12px rgba(255, 179, 71, 0.15)' },
    '50%': { boxShadow: '0 0 24px rgba(255, 179, 71, 0.35)' },
  },

  // 运动
  'float': {
    '0%': { transform: 'translateY(0) translateX(0)' },
    '33%': { transform: 'translateY(-8px) translateX(4px)' },
    '66%': { transform: 'translateY(4px) translateX(-6px)' },
    '100%': { transform: 'translateY(0) translateX(0)' },
  },
  'sway': {
    '0%, 100%': { transform: 'rotate(-2deg)' },
    '50%': { transform: 'rotate(2deg)' },
  },
  'liquid-rise': {
    '0%, 100%': { transform: 'translateY(1px)' },
    '50%': { transform: 'translateY(-1px)' },
  },

  // 入场/出场
  'slide-in-left': {
    '0%': { opacity: '0', transform: 'translateX(-12px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  'slide-in-right': {
    '0%': { opacity: '0', transform: 'translateX(12px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  'fade-in-up': {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'fade-out-up': {
    '0%': { opacity: '1', transform: 'translateY(0)' },
    '100%': { opacity: '0', transform: 'translateY(-20px)' },
  },
  'scale-in': {
    '0%': { opacity: '0', transform: 'scale(0.9)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  'scale-out': {
    '0%': { opacity: '1', transform: 'scale(1)' },
    '100%': { opacity: '0', transform: 'scale(0.95)' },
  },

  // 谱弦
  'spectrum-flow': {
    '0%': { backgroundPosition: '0% 0%' },
    '100%': { backgroundPosition: '0% 100%' },
  },

  // 装饰
  'shimmer': {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
  'ripple': {
    '0%': { transform: 'scale(0)', opacity: '0.6' },
    '100%': { transform: 'scale(4)', opacity: '0' },
  },
  'typing-dot': {
    '0%, 60%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
    '30%': { opacity: '1', transform: 'scale(1)' },
  },

  // 企鹅特有
  'edge-glitch': {
    '0%, 90%, 100%': { transform: 'translateX(0)' },
    '93%': { transform: 'translateX(1px)' },
    '96%': { transform: 'translateX(-1px)' },
  },
  'shiver': {
    '0%, 100%': { transform: 'translateX(0)' },
    '25%': { transform: 'translateX(-1px)' },
    '75%': { transform: 'translateX(1px)' },
  },

  // 事件/演出
  'screen-shake': {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%': { transform: 'translateX(-2px)' },
    '20%': { transform: 'translateX(2px)' },
    '30%': { transform: 'translateX(-1px)' },
    '40%': { transform: 'translateX(1px)' },
    '50%': { transform: 'translateX(0)' },
  },
  'dissolve': {
    '0%': { opacity: '1', filter: 'blur(0)' },
    '100%': { opacity: '0', filter: 'blur(8px)' },
  },
  'wind-erosion': {
    '0%': { opacity: '1', transform: 'translateX(0) scale(1)', filter: 'blur(0)' },
    '100%': { opacity: '0', transform: 'translateX(40px) scale(0.9)', filter: 'blur(4px)' },
  },

  // 灯塔
  'lighthouse-beam': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  'wave': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-4px)' },
  },

  // 色彩过渡
  'color-converge': {
    '0%': { filter: 'saturate(1) brightness(1)' },
    '70%': { filter: 'saturate(2) brightness(1.5)' },
    '85%': { filter: 'saturate(0) brightness(3)' },
    '100%': { filter: 'saturate(0.3) brightness(0.8)' },
  },
  'stall-darken': {
    '0%': { filter: 'saturate(1) brightness(1)' },
    '100%': { filter: 'saturate(var(--stall-sat, 1)) brightness(var(--stall-bright, 1))' },
  },

  // 进度条
  'progress-shimmer': {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
  'dot-pulse': {
    '0%, 100%': { boxShadow: '0 0 4px currentColor', transform: 'scale(1)' },
    '50%': { boxShadow: '0 0 10px currentColor', transform: 'scale(1.3)' },
  },
}
```

### animation

```typescript
animation: {
  // 呼吸/脉动
  'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
  'breathe': 'breathe 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'jade-breathe': 'jade-breathe 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'amber-pulse': 'amber-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',

  // 运动
  'float': 'float 6s ease-in-out infinite',
  'sway': 'sway 8s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',
  'liquid-rise': 'liquid-rise 2s ease-in-out infinite',

  // 入场/出场
  'slide-in-left': 'slide-in-left 300ms cubic-bezier(0, 0, 0.2, 1)',
  'slide-in-right': 'slide-in-right 200ms cubic-bezier(0, 0, 0.2, 1)',
  'fade-in-up': 'fade-in-up 400ms cubic-bezier(0, 0, 0.2, 1)',
  'fade-in-up-slow': 'fade-in-up 800ms cubic-bezier(0.16, 1, 0.3, 1)',
  'fade-out-up': 'fade-out-up 300ms cubic-bezier(0.4, 0, 1, 1)',
  'scale-in': 'scale-in 300ms cubic-bezier(0.16, 1, 0.3, 1)',
  'scale-out': 'scale-out 200ms cubic-bezier(0.4, 0, 1, 1)',

  // 谱弦
  'spectrum-flow': 'spectrum-flow 8s linear infinite',
  'spectrum-flow-fast': 'spectrum-flow 3s linear infinite',

  // 装饰
  'shimmer': 'shimmer 2s linear infinite',
  'ripple': 'ripple 600ms cubic-bezier(0, 0, 0.2, 1) forwards',
  'typing-dot': 'typing-dot 1.4s ease-in-out infinite',

  // 企鹅
  'edge-glitch': 'edge-glitch 4s steps(1) infinite',
  'shiver': 'shiver 0.2s ease-in-out',

  // 事件
  'screen-shake': 'screen-shake 300ms ease-in-out',
  'dissolve': 'dissolve 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  'wind-erosion': 'wind-erosion 2s cubic-bezier(0.4, 0, 0.2, 1) forwards',

  // 灯塔
  'lighthouse-beam': 'lighthouse-beam 15s linear infinite',
  'wave': 'wave 4s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',

  // 色彩
  'color-converge': 'color-converge 5.5s ease-in-out forwards',

  // 进度条
  'progress-shimmer': 'progress-shimmer 2s ease-in-out infinite',
  'dot-pulse': 'dot-pulse 2s ease-in-out infinite',
}
```

### 过渡时间

```typescript
transitionDuration: {
  'fast': '150ms',
  'normal': '250ms',
  'slow': '400ms',
  'dramatic': '800ms',
  'cinematic': '1500ms',
}
```

### 缓动函数

```typescript
transitionTimingFunction: {
  'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'enter': 'cubic-bezier(0, 0, 0.2, 1)',
  'exit': 'cubic-bezier(0.4, 0, 1, 1)',
  'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  'breath': 'cubic-bezier(0.4, 0, 0.6, 1)',
  'dramatic': 'cubic-bezier(0.16, 1, 0.3, 1)',
  'gentle': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
}
```

---

## 九、z-index 层级

```typescript
zIndex: {
  'bg': '0',
  'particles': '1',
  'chord': '2',
  'content': '10',
  'topbar': '20',
  'input': '20',
  'penguin': '25',
  'dropdown': '30',
  'modal-backdrop': '40',
  'modal': '50',
  'event': '60',
  'toast': '70',
  'finale': '80',
}
```

---

## 十、组件 Recipe（className 组合）

以下为 globals.css 中 `@layer components` 定义的完整 className。

### 毛玻璃面板

```css
.glass-light    → bg-brand-deep-900/45 backdrop-blur-[10px] border border-white/[0.05]
.glass-panel    → bg-brand-deep-900/70 backdrop-blur-[16px] border border-white/[0.08] shadow-glass
.glass-elevated → bg-brand-deep-800/85 backdrop-blur-[24px] border border-white/[0.12] shadow-elevated
.glass-ember    → bg-brand-deep-900/80 backdrop-blur-[20px] border border-brand-amber-500/[0.15] shadow-amber-glow
```

### 消息气泡

```css
.bubble-poet → bg-brand-jade-500/[0.05] border border-brand-jade-500/[0.15]
               rounded-bubble-poet px-5 py-3.5
               font-cn text-body-lg text-txt-primary
               shadow-low

.bubble-user → bg-white/[0.05] border border-white/[0.08]
               rounded-bubble-user px-[18px] py-3
               font-cn text-body text-txt-primary

.bubble-astral → bg-brand-astral-500/[0.06] border border-brand-astral-500/[0.2]
                 rounded-bubble-astral px-5 py-4
                 font-mono text-mono-sm text-brand-astral-200
                 shadow-astral-glow

.ember-card → glass-ember rounded-ember-card px-6 py-5
              font-poetic text-poetic text-brand-amber-300 italic
              shadow-amber-glow
```

### 按钮

```css
.btn-primary → border-2 border-brand-jade-500 text-brand-jade-500
               font-display font-semibold text-body
               rounded-capsule px-8 py-3
               shadow-jade-glow
               transition-all duration-normal
               hover:border-brand-jade-300 hover:bg-brand-jade-500/[0.06] hover:shadow-jade-glow-lg
               active:bg-brand-jade-500/[0.12] active:scale-[0.98]
               disabled:border-brand-deep-300 disabled:text-txt-muted disabled:shadow-none disabled:cursor-not-allowed

.btn-secondary → bg-brand-amber-500 text-txt-inverse
                 font-display font-semibold text-body
                 rounded-card px-6 py-2.5
                 shadow-amber-glow
                 transition-all duration-normal
                 hover:bg-brand-amber-400 hover:shadow-amber-glow-lg
                 active:scale-[0.98]

.btn-ghost → text-txt-secondary
             font-cn text-body
             rounded-card px-4 py-2
             transition-all duration-normal
             hover:text-txt-primary hover:bg-white/[0.04]

.btn-danger → border border-brand-ember-500/40 text-brand-ember-300
              font-cn text-body
              rounded-card px-6 py-2.5
              transition-all duration-normal
              hover:border-brand-ember-500 hover:bg-brand-ember-500/[0.08]
```

### 输入框

```css
.input-chat → bg-white/[0.04] border border-white/[0.06]
              rounded-input px-[18px] py-2.5
              text-body text-txt-primary font-cn
              placeholder:text-txt-muted
              transition-all duration-normal
              focus:border-brand-jade-500/40 focus:outline-none
              focus:shadow-[0_0_8px_rgba(0,229,160,0.10)]
```

### 进度条

```css
.progress-bar → h-1.5 bg-white/[0.06] rounded-bar overflow-hidden
.progress-fill → h-full rounded-bar bg-gradient-fuel-healthy animate-progress-shimmer
```

### 渐变文字

```css
.gradient-text      → bg-gradient-jade-amber bg-clip-text text-transparent
.gradient-text-warm → bg-gradient-amber-ember bg-clip-text text-transparent
.gradient-text-full → bg-gradient-full bg-clip-text text-transparent
```

### 谱弦

```css
.spectrum-chord → w-[2px]
                  bg-gradient-to-b from-[var(--chord-color-1)] to-[var(--chord-color-2)]
                  opacity-[var(--chord-opacity)]
                  animate-spectrum-flow
```
