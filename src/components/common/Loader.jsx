import { motion } from 'framer-motion';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const loader = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizes[size]} border-4 border-gray-600 border-t-blue-500 rounded-full`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50">
        <div className="text-center">
          {loader}
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <div className="flex justify-center items-center py-8">{loader}</div>;
};

export default Loader;