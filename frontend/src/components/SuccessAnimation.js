import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SuccessAnimation = ({ 
  isVisible, 
  onComplete, 
  duration = 1000, 
  fadeOutDuration = 2000,
  message = "¡Enviado exitosamente!",
  showConfetti = true,
  size = "medium" // small, medium, large
}) => {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24", 
    large: "w-32 h-32"
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-lg",
    large: "text-xl"
  };

  const confettiColors = [
    "#10B981", // green
    "#3B82F6", // blue
    "#F59E0B", // yellow
    "#EF4444", // red
    "#8B5CF6", // purple
    "#06B6D4"  // cyan
  ];

  const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: confettiColors[i % confettiColors.length],
    delay: i * 0.1,
    x: (Math.random() - 0.5) * 400,
    y: Math.random() * 200 + 100
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {confettiPieces.map((piece) => (
                <motion.div
                  key={piece.id}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: piece.color }}
                  initial={{ 
                    x: 0, 
                    y: -50, 
                    opacity: 0,
                    scale: 0 
                  }}
                  animate={{ 
                    x: piece.x, 
                    y: piece.y, 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: piece.delay,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}

          {/* Success Icon Container */}
          <motion.div
            className="bg-white rounded-full p-6 shadow-2xl flex flex-col items-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [-180, 0]
            }}
            transition={{ 
              duration: duration / 1000,
              ease: "easeOut",
              times: [0, 0.6, 1]
            }}
            onAnimationComplete={() => {
              setTimeout(() => {
                onComplete && onComplete();
              }, fadeOutDuration);
            }}
          >
            {/* Check Icon */}
            <motion.div
              className={`${sizeClasses[size]} bg-green-500 rounded-full flex items-center justify-center mb-4`}
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.4)",
                  "0 0 0 20px rgba(34, 197, 94, 0)",
                  "0 0 0 0 rgba(34, 197, 94, 0)"
                ]
              }}
              transition={{ 
                duration: 2,
                ease: "easeOut",
                delay: 0.3
              }}
            >
              <motion.svg
                className="w-1/2 h-1/2 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.4,
                  ease: "easeOut"
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>

            {/* Success Message */}
            <motion.p
              className={`${textSizes[size]} font-semibold text-gray-800 text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: 0.6
              }}
            >
              {message}
            </motion.p>

            {/* Pulse Ring Effect */}
            <motion.div
              className="absolute inset-0 border-4 border-green-500 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.8, 0, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessAnimation; 