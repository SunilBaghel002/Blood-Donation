import React from "react";
import { motion } from "framer-motion";

const MetricCard = ({ label, value, icon: Icon, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border-l-4 ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      <Icon className="w-8 h-8 text-gray-500" />
    </div>
  </motion.div>
);

export default MetricCard;