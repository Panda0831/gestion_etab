import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface MotionWrapperProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export const FadeIn = ({ children, delay = 0, className, style }: MotionWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0, className, style }: MotionWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);