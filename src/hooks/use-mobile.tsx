import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * 一个自定义 hook，用于确定当前视口是否为移动设备。
 * 它使用 `window.matchMedia` 来监听视口大小的变化。
 *
 * @returns {boolean} 如果视口宽度小于移动设备断点，则返回 `true`，否则返回 `false`。
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    /**
     * 根据当前窗口宽度更新 isMobile 状态的回调函数。
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    mql.addEventListener('change', onChange);

    // 设置初始状态
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // 移除事件监听器的清理函数
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
