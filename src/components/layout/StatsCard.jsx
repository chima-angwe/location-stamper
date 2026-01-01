import { motion } from 'framer-motion';
import Card from '../common/Card';

const StatsCard = ({ icon, label, value, color = 'blue' }) => {
  const colors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
  };

  return (
    <Card hover>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-4"
      >
        <div className={`${colors[color]} text-4xl`}>{icon}</div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </motion.div>
    </Card>
  );
};

export default StatsCard;