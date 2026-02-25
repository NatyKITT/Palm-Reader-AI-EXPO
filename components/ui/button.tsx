"use client";

import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "fill" | "bordered" | "bordered_icon" | "link";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({variant = "fill", className = "", children, ...props}, ref) => {
      const baseClass = "btn";
      const variantClass = {
        fill: "btn_fill",
        bordered: "btn_bordered",
        bordered_icon: "btn_bordered_icon",
        link: "btn_link",
      }[variant];

      return (
          <button
              ref={ref}
              className={`${baseClass} ${variantClass} ${className}`}
              {...props}
          >
            {children}
          </button>
      );
    }
);

Button.displayName = "Button";

export {Button};