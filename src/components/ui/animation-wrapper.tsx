"use client";

import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimationWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scaleIn";
  show?: boolean;
  stagger?: number;
  index?: number;
}

export const AnimationWrapper = ({
  children,
  className,
  delay = 0,
  duration = 300,
  animation = "fadeIn",
  show = true,
  stagger = 0,
  index = 0,
}: AnimationWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(show);
    }, delay + stagger * index);

    return () => clearTimeout(timer);
  }, [show, delay, stagger, index]);

  const animationClasses = {
    fadeIn:
      "opacity-0 translate-y-4 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0",
    slideUp:
      "opacity-0 translate-y-8 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0",
    slideIn:
      "opacity-0 -translate-x-4 data-[visible=true]:opacity-100 data-[visible=true]:translate-x-0",
    scaleIn:
      "opacity-0 scale-95 data-[visible=true]:opacity-100 data-[visible=true]:scale-100",
  };

  return (
    <div
      data-visible={isVisible}
      className={cn(
        "transition-all ease-out",
        animationClasses[animation],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Staggered animation container
interface StaggeredContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scaleIn";
  show?: boolean;
}

export const StaggeredContainer = ({
  children,
  className,
  staggerDelay = 100,
  animation = "fadeIn",
  show = true,
}: StaggeredContainerProps) => {
  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <AnimationWrapper
          key={index}
          show={show}
          animation={animation}
          stagger={staggerDelay}
          index={index}
        >
          {child}
        </AnimationWrapper>
      ))}
    </div>
  );
};
