import { motion } from 'framer-motion'

export default function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <motion.div 
      className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Chase spinner */}
      <div className="sk-chase" style={{ width: '64px', height: '64px' }}>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>

        <style>{`
          .sk-chase {
            position: relative;
            animation: sk-chase 2.5s infinite linear both;
          }

          .sk-chase-dot {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            animation: sk-chase-dot 2.0s infinite ease-in-out both;
          }

          .sk-chase-dot:before {
            content: '';
            display: block;
            width: 25%;
            height: 25%;
            background-color: var(--primary);
            border-radius: 100%;
            animation: sk-chase-dot-before 2.0s infinite ease-in-out both;
          }

          .sk-chase-dot:nth-child(1) { animation-delay: -1.1s; }
          .sk-chase-dot:nth-child(2) { animation-delay: -1.0s; }
          .sk-chase-dot:nth-child(3) { animation-delay: -0.9s; }
          .sk-chase-dot:nth-child(4) { animation-delay: -0.8s; }
          .sk-chase-dot:nth-child(5) { animation-delay: -0.7s; }
          .sk-chase-dot:nth-child(6) { animation-delay: -0.6s; }
          .sk-chase-dot:nth-child(1):before { animation-delay: -1.1s; }
          .sk-chase-dot:nth-child(2):before { animation-delay: -1.0s; }
          .sk-chase-dot:nth-child(3):before { animation-delay: -0.9s; }
          .sk-chase-dot:nth-child(4):before { animation-delay: -0.8s; }
          .sk-chase-dot:nth-child(5):before { animation-delay: -0.7s; }
          .sk-chase-dot:nth-child(6):before { animation-delay: -0.6s; }

          @keyframes sk-chase {
            100% { transform: rotate(360deg); }
          }

          @keyframes sk-chase-dot {
            80%, 100% { transform: rotate(360deg); }
          }

          @keyframes sk-chase-dot-before {
            50% {
              transform: scale(0.4);
            }
            100%, 0% {
              transform: scale(1.0);
            }
          }
        `}</style>
      </div>
      
      <motion.p 
        className="mt-6 text-base text-gray-700 font-medium"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </motion.div>
  )
}
