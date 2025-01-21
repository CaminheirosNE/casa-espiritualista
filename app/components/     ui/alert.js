"use client"

import * as React from "react"
import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-lg border border-gray-200 p-4",
      {
        "bg-gray-50 text-gray-900": variant === "default",
        "border-red-500 bg-red-50 text-red-900": variant === "destructive",
      },
      className
    )}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }
