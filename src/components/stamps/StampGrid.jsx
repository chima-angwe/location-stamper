import { motion } from 'framer-motion';
import StampCard from './StampCard';
import { staggerContainer, staggerItem } from '../../utils/animations';

const StampGrid = ({ stamps, onEdit, onDelete, onView }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {stamps.map((stamp) => (
        <motion.div key={stamp._id} variants={staggerItem}>
          <StampCard
            stamp={stamp}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StampGrid;