/** 存档 Hook — 文件上传下载操作封装，支持 v2 新字段和版本兼容检查 */

'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { generateSaveFileName } from '@/lib/save-system';
import { GAME_STATE_VERSION } from '@/types/game-state';

interface UseSaveLoadReturn {
  /** 导出存档为 JSON 文件下载 */
  saveToFile: () => void;
  /** 从文件导入存档，可选回调通知结果 */
  loadFromFile: (onResult?: (success: boolean, error?: string) => void) => void;
  /** 当前版本号 */
  version: string;
}

/** 存档导入导出 Hook */
export function useSaveLoad(): UseSaveLoadReturn {
  const exportState = useGameStore((s) => s.exportState);
  const importState = useGameStore((s) => s.importState);

  /** 导出存档为 JSON 文件下载 */
  const saveToFile = useCallback(() => {
    const json = exportState();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generateSaveFileName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [exportState]);

  /** 从文件导入存档（含版本兼容性检查） */
  const loadFromFile = useCallback((onResult?: (success: boolean, error?: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text !== 'string') return;

        // 预检查：解析 JSON 并验证版本
        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(text) as Record<string, unknown>;
        } catch {
          onResult?.(false, '文件格式错误，无法解析 JSON');
          return;
        }

        // 版本兼容性检查
        const meta = parsed.meta as Record<string, unknown> | undefined;
        if (meta && typeof meta.version === 'string') {
          const fileVersion = meta.version;
          if (fileVersion !== GAME_STATE_VERSION) {
            // v1 存档提示不兼容
            if (fileVersion.startsWith('0.') || fileVersion === '1.0.0' && GAME_STATE_VERSION !== '1.0.0') {
              onResult?.(false, `存档版本不兼容：该存档为 v${fileVersion}，当前版本为 v${GAME_STATE_VERSION}。旧版存档无法直接导入。`);
              return;
            }
          }
        }

        // 检查新字段是否存在，缺失则提示不兼容
        const hasNewFields = parsed.fuel !== undefined
          && parsed.penguin !== undefined
          && parsed.ending !== undefined
          && parsed.spark !== undefined;

        if (!hasNewFields) {
          onResult?.(false, '存档版本过旧，缺少燃料/企鹅/终局/火种数据。请使用新版本开始游戏。');
          return;
        }

        // 正式导入
        const result = importState(text);
        if (result.success) {
          onResult?.(true);
        } else {
          onResult?.(false, result.error || '导入失败');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [importState]);

  return {
    saveToFile,
    loadFromFile,
    version: GAME_STATE_VERSION,
  };
}
