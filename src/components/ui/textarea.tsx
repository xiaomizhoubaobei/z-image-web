import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * 一个可在整个应用程序中使用的自定义 Textarea 组件。
 * 它是对标准 HTML textarea 元素的封装，具有一致的样式。
 * @param {React.ComponentProps<'textarea'>} props - textarea 元素的 props。
 * @param {React.ForwardedRef<HTMLTextAreaElement>} ref - 转发到 textarea 元素的 ref。
 * @returns {JSX.Element} 渲染后的 textarea 组件。
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
