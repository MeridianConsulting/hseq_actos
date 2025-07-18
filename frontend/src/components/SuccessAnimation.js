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
    small: "w-20 h-20",
    medium: "w-28 h-28", 
    large: "w-36 h-36"
  };

  const textSizes = {
    small: "text-base",
    medium: "text-xl",
    large: "text-2xl"
  };

  const containerSizes = {
    small: "p-8",
    medium: "p-12",
    large: "p-16"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md"
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
            className={`bg-white rounded-3xl ${containerSizes[size]} shadow-2xl flex flex-col items-center relative min-w-[320px] max-w-md mx-4`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.1, 1],
              opacity: 1
            }}
            exit={{ 
              scale: 0,
              opacity: 0,
              transition: { duration: 0.2 }
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
            {/* Check Icon Container */}
            <motion.div
              className={`${sizeClasses[size]} bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg`}
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.4)",
                  "0 0 0 25px rgba(34, 197, 94, 0)",
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
                className="w-1/2 h-1/2 text-white drop-shadow-sm"
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
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: 0.6
              }}
            >
              <h3 className={`${textSizes[size]} font-bold text-gray-800 mb-2`}>
                ¡Éxito!
              </h3>
              <p className={`${textSizes[size]} text-gray-600 leading-relaxed`}>
                {message}
              </p>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full opacity-20"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.1, 0.2]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            
            <motion.div
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full opacity-20"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.1, 0.2]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5
              }}
            />

            {/* Pulse Ring Effect */}
            <motion.div
              className="absolute inset-0 border-2 border-green-500 rounded-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0, 0.3]
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