"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "black",
          "--normal-text": "white",
          "--normal-border": "#e2e8f0",
          "fontFamily": "var(--ff-p)",
          "fontSize": "0.6rem"
        }
      }
      {...props} />
  );
}

export { Toaster }