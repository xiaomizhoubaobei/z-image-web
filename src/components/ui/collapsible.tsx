"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

/**
 * 一个可以展开和折叠其内容区域的组件。
 */
const Collapsible = CollapsiblePrimitive.Root

/**
 * 用于切换 Collapsible 组件展开/折叠状态的按钮。
 */
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

/**
 * Collapsible 组件中可折叠的内容区域。
 */
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
