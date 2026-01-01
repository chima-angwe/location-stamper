import { motion } from 'framer-motion';
import { CloseOutlined } from '@mui/icons-material';

const ImagePreview = ({ images, onRemove }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <img
            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
            alt={`Preview ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg"
          />
          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="
                absolute top-2 right-2
                bg-red-600 hover:bg-red-700
                text-white rounded-full p-1
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
              "
            >
              <CloseOutlined fontSize="small" />
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ImagePreview;