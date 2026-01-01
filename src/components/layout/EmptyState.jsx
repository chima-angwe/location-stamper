import { motion } from 'framer-motion';
import Button from '../common/Button';

const EmptyState = ({ icon, title, description, action, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <div className="text-gray-500 mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      {action && onAction && (
        <Button onClick={onAction}>{action}</Button>
      )}
    </motion.div>
  );
};

export default EmptyState;