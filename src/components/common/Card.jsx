import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      onClick={onClick}
      className={`
        bg-gray-800 rounded-lg p-6 shadow-lg
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;