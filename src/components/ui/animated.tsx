"use client";
import { motion, type MotionProps } from "motion/react";
import {
  type ElementType,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";

type AnimatedProps<T extends ElementType> = MotionProps &
  Omit<ComponentPropsWithoutRef<T>, keyof MotionProps> & {
    as?: T;
    children: ReactNode;
  };

export function Animated<T extends ElementType = "div">({
  as,
  children,
  ...props
}: AnimatedProps<T>) {
  const Component = as || "div";
  const MotionComponent = motion.create(Component);
  return (
    <MotionComponent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
