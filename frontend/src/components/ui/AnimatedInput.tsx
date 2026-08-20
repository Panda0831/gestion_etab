import { motion } from "framer-motion";
import { ChangeEvent, ReactNode, CSSProperties } from "react";

interface AnimatedInputProps {
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: ReactNode;
  rightElement?: ReactNode;
  delay?: number;
  style?: CSSProperties;
}

function AnimatedInput({
  id, type = "text", placeholder, value, onChange, required,
  icon, rightElement, delay = 0, style,
}: AnimatedInputProps) {
  return (
    <motion.div
      className="form-group"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <label className="form-label" htmlFor={id}>{placeholder}</label>
      <motion.div className="input-wrapper" whileFocus={{ scale: 1.01 }}>
        {icon && <span className="input-icon-left">{icon}</span>}
        <motion.input
          id={id}
          type={type}
          className="input-control"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={style}
          whileFocus={{
            boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.2), 0 4px 12px rgba(37, 99, 235, 0.1)",
          }}
          transition={{ duration: 0.2 }}
        />
        {rightElement}
      </motion.div>
    </motion.div>
  );
}

export default AnimatedInput;