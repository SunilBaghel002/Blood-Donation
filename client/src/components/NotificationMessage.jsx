import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";

const messageVariants = {
  initial: { opacity: 0, y: -20, x: 20 },
  animate: { opacity: 1, y: 0, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, x: 20, transition: { duration: 0.3 } },
};

const NotificationMessage = ({ success, error }) => (
  <AnimatePresence>
    {success && (
      <motion.div
        variants={messageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed top-4 right-4 p-3 bg-green-50 border border-green-200 rounded-lg shadow-md z-50"
      >
        <p className="text-sm text-green-600 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          {success}
        </p>
      </motion.div>
    )}
    {error && (
      <motion.div
        variants={messageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed top-4 right-4 p-3 bg-red-50 border border-red-200 rounded-lg shadow-md z-50"
      >
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </p>
      </motion.div>
    )}
  </AnimatePresence>
);

export default NotificationMessage;
