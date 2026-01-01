import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import { getCategoryColor, getCategoryLabel } from "../../utils/constants";
import { formatDate } from "../../utils/formatDate";
import {
  LocationOnOutlined,
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
} from "@mui/icons-material";

const StampCard = ({ stamp, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();

  const handleView = () => {
    if (onView) {
      onView(stamp);
    } else {
      navigate(`/stamp/${stamp._id}`);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(stamp);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(stamp);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        onClick={handleView}
        className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 my-10"
      >
        {/* Image Section */}
        {stamp.photos && stamp.photos.length > 0 ? (
          <div className="relative h-48 md:h-56 overflow-hidden bg-gray-900">
            <motion.img
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={stamp.photos[0]}
              alt={stamp.title}
              className="w-full h-full object-cover"
            />
            {/* Photo Count Badge */}
            {stamp.photos.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold text-white flex items-center gap-1"
              >
                <ImageOutlined fontSize="small" />+{stamp.photos.length - 1}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="h-48 md:h-56 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center group-hover:from-gray-600 group-hover:to-gray-700 transition-colors">
            <ImageOutlined
              className="text-gray-500 group-hover:text-gray-400 transition-colors"
              style={{ fontSize: 56 }}
            />
          </div>
        )}

        {/* Content Section */}
        <div className="p-5 md:p-6 space-y-4">
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
              style={{
                backgroundColor: `${getCategoryColor(stamp.category)}20`,
                color: getCategoryColor(stamp.category),
              }}
            >
              {getCategoryLabel(stamp.category)}
            </div>
          </motion.div>

          {/* Title */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
              {stamp.title}
            </h3>
            {stamp.description && (
              <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                {stamp.description}
              </p>
            )}
          </div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-start gap-2 text-sm text-gray-400"
          >
            <LocationOnOutlined
              fontSize="small"
              className="flex-shrink-0 mt-0.5 text-blue-400"
            />
            <div className="min-w-0 flex-1">
              {stamp.address && (
                <p className="text-white font-medium truncate">
                  {stamp.address}
                </p>
              )}
              <p className="text-xs text-gray-500 font-mono">
                {stamp.latitude.toFixed(4)}, {stamp.longitude.toFixed(4)}
              </p>
            </div>
          </motion.div>

          {/* Date */}
          <p className="text-xs text-gray-500">{formatDate(stamp.createdAt)}</p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-3 pt-3 border-t border-gray-700"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              <EditOutlined fontSize="small" />
              <span className="hidden sm:inline">Edit</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-red-500/30"
            >
              <DeleteOutlined fontSize="small" />
              <span className="hidden sm:inline">Delete</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StampCard;
