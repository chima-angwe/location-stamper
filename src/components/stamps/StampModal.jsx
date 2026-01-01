import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { getCategoryColor, getCategoryLabel } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatDate';
import {
  LocationOnOutlined,
  NavigationOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarTodayOutlined,
  CategoryOutlined,
  NotesOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
} from '@mui/icons-material';

const StampModal = ({ stamp, isOpen, onClose, onEdit, onDelete }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!stamp) return null;

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${stamp.latitude},${stamp.longitude}`;
    window.open(url, '_blank');
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === stamp.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? stamp.photos.length - 1 : prev - 1
    );
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={stamp.title} size="lg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Photo Carousel */}
        {stamp.photos && stamp.photos.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="relative group"
          >
            <div className="relative overflow-hidden rounded-xl bg-gray-900">
              <motion.img
                key={currentPhotoIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={stamp.photos[currentPhotoIndex]}
                alt={stamp.title}
                className="w-full h-96 object-cover"
              />

              {stamp.photos.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all backdrop-blur-sm"
                  >
                    <ChevronLeftOutlined />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all backdrop-blur-sm"
                  >
                    <ChevronRightOutlined />
                  </motion.button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white">
                    {currentPhotoIndex + 1} / {stamp.photos.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Category Badge */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-800 rounded-lg">
              <CategoryOutlined
                fontSize="small"
                style={{ color: getCategoryColor(stamp.category) }}
              />
            </div>
            <span
              className="px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm"
              style={{
                backgroundColor: `${getCategoryColor(stamp.category)}20`,
                color: getCategoryColor(stamp.category),
              }}
            >
              {getCategoryLabel(stamp.category)}
            </span>
          </div>
        </motion.div>

        {/* Description */}
        {stamp.description && (
          <motion.p
            variants={itemVariants}
            className="text-gray-300 text-base leading-relaxed"
          >
            {stamp.description}
          </motion.p>
        )}

        {/* Location Section */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                <LocationOnOutlined className="text-blue-400" fontSize="small" />
              </div>
              <div className="flex-1">
                {stamp.address && (
                  <p className="font-semibold text-white mb-1">{stamp.address}</p>
                )}
                <p className="text-sm text-gray-400 font-mono">
                  {stamp.latitude.toFixed(6)}, {stamp.longitude.toFixed(6)}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNavigate}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              <NavigationOutlined fontSize="small" />
              Navigate Here
            </motion.button>
          </div>
        </motion.div>

        {/* Notes */}
        {stamp.notes && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <NotesOutlined fontSize="small" className="text-purple-400" />
              </div>
              <span className="font-semibold text-white">Notes</span>
            </div>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {stamp.notes}
            </p>
          </motion.div>
        )}

        {/* Date */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 text-sm text-gray-400"
        >
          <CalendarTodayOutlined fontSize="small" />
          <span>Created {formatDateTime(stamp.createdAt)}</span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex gap-3 pt-6 border-t border-gray-700"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onClose();
              onEdit(stamp);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <EditOutlined fontSize="small" />
            Edit
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onClose();
              onDelete(stamp);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all"
          >
            <DeleteOutlined fontSize="small" />
            Delete
          </motion.button>
        </motion.div>
      </motion.div>
    </Modal>
  );
};

export default StampModal;