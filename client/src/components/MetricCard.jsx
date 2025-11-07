// src/components/MetricCard.jsx
import { motion } from "framer-motion";

const MetricCard = ({ label, value, icon: Icon, color, gradient, index }) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
    className={`relative overflow-hidden rounded-2xl p-6 text-white ${
      gradient ? `bg-gradient-to-br ${color}` : "bg-white"
    } shadow-xl`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{label}</p>
        <p className="text-4xl font-bold mt-2">{value}</p>
      </div>
      <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
        <Icon className="w-8 h-8" />
      </div>
    </div>
    {gradient && <div className="absolute inset-0 bg-black/10" />}
  </motion.div>
);

export default MetricCard;
