import * as React from "react"

import { cn } from "@/lib/utils"
import { useAutoResize } from "@/hooks/use-auto-resize"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** Enable auto-resize based on content (default: false) */
  autoResize?: boolean
  /** Minimum height in pixels when autoResize is enabled (default: 80) */
  minHeight?: number
  /** Maximum height in pixels when autoResize is enabled (default: 300) */
  maxHeight?: number
}

function Textarea({
  className,
  autoResize = false,
  minHeight = 80,
  maxHeight = 300,
  ref: forwardedRef,
  ...props
}: TextareaProps) {
  const { ref: autoResizeRef } = useAutoResize({
    minHeight,
    maxHeight,
    disabled: !autoResize,
  })

  // Merge refs when autoResize is enabled
  const mergedRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      // Update auto-resize ref
      if (autoResizeRef) {
        (autoResizeRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
      }
      // Update forwarded ref
      if (typeof forwardedRef === "function") {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    },
    [autoResizeRef, forwardedRef]
  )

  return (
    <textarea
      ref={mergedRef}
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Only add field-sizing-content when NOT using JS auto-resize (as they conflict)
        !autoResize && "field-sizing-content",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
export type { TextareaProps }
