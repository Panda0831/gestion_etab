import { motion, AnimatePresence } from "framer-motion";
import { AlertCircleIcon, CheckCircleIcon } from "../icons";

interface AlertBannerProps {
  type: "error" | "success";
  message: string;
}

function AlertBanner({ type, message }: AlertBannerProps) {
  return (
    <AnimatePresence>
      <motion.div
        className={`alert alert-${type}`}
        initial={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto", marginBottom: 24 }}
        exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {type === "error" ? <AlertCircleIcon /> : <CheckCircleIcon />}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}

export default AlertBanner;