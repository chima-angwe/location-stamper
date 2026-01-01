import { motion } from "framer-motion";
import {
  CheckCircleOutline,
  ErrorOutline,
  WarningAmberOutlined,
  InfoOutlined,
  CloseOutlined,
} from "@mui/icons-material";

const Alert = ({ type = "info", message, onClose }) => {
  const types = {
    success: {
      bg: "bg-green-900 border-green-500",
      icon: <CheckCircleOutline className="text-green-500" />,
    },
    error: {
      bg: "bg-red-900 border-red-500",
      icon: <ErrorOutline className="text-red-500" />,
    },
    warning: {
      bg: "bg-yellow-900 border-yellow-500",
      icon: <WarningAmberOutlined className="text-yellow-500" />,
    },
    info: {
      bg: "bg-blue-900 border-blue-500",
      icon: <InfoOutlined className="text-blue-500" />,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        ${types[type].bg}
        border-l-4 rounded-lg p-4
        flex items-start gap-3
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{types[type].icon}</div>
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <CloseOutlined fontSize="small" />
        </button>
      )}
    </motion.div>
  );
};

export default Alert;
