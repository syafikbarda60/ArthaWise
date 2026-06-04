"use client";

import React from "react";

interface StarBorderProps extends React.ComponentPropsWithoutRef<"div"> {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  children: React.ReactNode;
}

export const StarBorder = ({
  as: Component = "div",
  className = "",
  color = "#f59e0b",
  speed = "4s",
  children,
  ...rest
}: StarBorderProps) => {
  return (
    <Component 
      className={`relative inline-block py-[1px] overflow-hidden rounded-[20px] ${className}`} 
      {...rest}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-80 bottom-[-11px] right-[-250%] rounded-full z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `star-movement-bottom ${speed} linear infinite`,
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-80 top-[-10px] left-[-250%] rounded-full z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `star-movement-top ${speed} linear infinite`,
        }}
      ></div>
      <div className="relative z-1 w-full h-full">
        {children}
      </div>
    </Component>
  );
};
