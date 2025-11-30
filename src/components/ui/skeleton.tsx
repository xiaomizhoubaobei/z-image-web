import { cn } from "@/lib/utils"

/**
 * 用于显示内容正在加载中的占位符预览。
 * @param {React.HTMLAttributes<HTMLDivElement>} props - 组件的 props。
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
