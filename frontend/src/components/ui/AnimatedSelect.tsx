import { motion } from "framer-motion";
import { ChangeEvent, ReactNode, CSSProperties } from "react";

interface AnimatedSelectProps {
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  children: ReactNode;
  delay?: number;
  label: string;
  optional?: boolean;
  style?: CSSProperties;
}

function AnimatedSelect({
  id, value, onChange, required, children, delay = 0, label, optional, style,
}: AnimatedSelectProps) {
  return (
    <motion.div
      className="form-group"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <label className="form-label" htmlFor={id}>
        {label}
        {optional && <span className="form-label-optional">(Optionnel)</span>}
      </label>
      <div className="input-wrapper">
        <motion.select
          id={id}
          className="input-control select-control"
          value={value}
          onChange={onChange}
          required={required}
          style={style}
          whileFocus={{ boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.2)" }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.select>
      </div>
    </motion.div>
  );
}

export default AnimatedSelect;