"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps {
  children: ReactNode;
  animation?:
    | "fadeInUp"
    | "fadeInLeft"
    | "fadeInRight"
    | "scaleIn"
    | "slideInUp";
  delay?: number;
  duration?: number;
  className?: string;
  mode?: "inView" | "mount"; // inView: trigger when in viewport, mount: trigger on mount
}

const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  slideInUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
};

export default function MotionWrapper({
  children,
  animation = "fadeInUp",
  delay = 0,
  duration = 0.6,
  className = "",
  mode = "inView",
}: MotionWrapperProps) {
  const animationConfig = animations[animation];

  const motionProps =
    mode === "inView"
      ? {
          whileInView: animationConfig.animate,
          viewport: { once: true, margin: "-30px" },
        }
      : { animate: animationConfig.animate };

  return (
    <motion.div
      initial={animationConfig.initial}
      {...motionProps}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
