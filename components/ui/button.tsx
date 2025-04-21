import React from "react"
import { cn } from "@/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
      destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-green-500",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
      ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
      link: "text-green-600 underline-offset-4 hover:underline focus:ring-green-500",
    }

    const sizeClasses = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8 text-base",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
