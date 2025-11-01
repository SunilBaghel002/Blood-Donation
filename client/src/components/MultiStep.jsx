// ../components/MultiStep.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";

function Step({ step, currentStep }) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  return (
    <motion.div animate={status} className="relative">
      <motion.div
        variants={{
          active: { scale: 1, transition: { delay: 0, duration: 0.2 } },
          complete: { scale: 1.25 },
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "tween",
          ease: "circOut",
        }}
        className="absolute inset-0 rounded-full bg-red-200"
      />

      <motion.div
        initial={false}
        variants={{
          inactive: {
            backgroundColor: "#fff",
            borderColor: "#e5e5e5",
            color: "#a3a3a3",
          },
          active: {
            backgroundColor: "#fff",
            borderColor: "#dc2626",
            color: "#dc2626",
          },
          complete: {
            backgroundColor: "#dc2626",
            borderColor: "#dc2626",
            color: "#fff",
          },
        }}
        transition={{ duration: 0.2 }}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold"
      >
        {status === "complete" ? (
          <Check className="h-6 w-6 text-white" />
        ) : (
          <span>{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function MultiStep({ currentStep, totalSteps = 4 }) {
  return (
    <div className="flex justify-between w-full max-w-md mx-auto mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <Step key={i + 1} step={i + 1} currentStep={currentStep} />
      ))}
    </div>
  );
}
