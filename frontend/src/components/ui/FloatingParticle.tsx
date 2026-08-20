import { motion } from "framer-motion";

interface FloatingParticleProps {
  delay: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

function FloatingParticle({ delay, x, y, size, duration }: FloatingParticleProps) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.06)",
        pointerEvents: "none",
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default FloatingParticle;

export const particles: FloatingParticleProps[] = [
  { delay: 0, x: 15, y: 20, size: 80, duration: 8 },
  { delay: 1.5, x: 70, y: 60, size: 120, duration: 10 },
  { delay: 0.8, x: 40, y: 80, size: 60, duration: 7 },
  { delay: 2, x: 85, y: 15, size: 90, duration: 9 },
  { delay: 0.3, x: 55, y: 40, size: 50, duration: 6 },
  { delay: 1.2, x: 25, y: 55, size: 70, duration: 11 },
];