/** 存档 Hook — 文件上传下载操作封装 */

'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { generateSaveFileName } from '@/lib/save-system';

interface UseSaveLoadReturn {
  /** 导出存档为 JSON 文件下载 */
  saveToFile: () => void;
  /** 从文件导入存档，可选回调通知结果 */
  loadFromFile: (onResult?: (success: boolean, error?: string) => void) => void;
}

/** 存档导入导出 Hook */
export function useSaveLoad(): UseSaveLoadReturn {
  const exportState = useGameStore((s) => s.exportState);
  const importState = useGameStore((s) => s.importState);

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
  };
}
