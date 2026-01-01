import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import Container from "../components/layout/Container";
import PageHeader from "../components/layout/PageHeader";
import StatsCard from "../components/layout/StatsCard";
import EmptyState from "../components/layout/EmptyState";
import StampGrid from "../components/stamps/StampGrid";
import StampModal from "../components/stamps/StampModal";
import Modal from "../components/common/Modal";
import StampForm from "../components/stamps/StampForm";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Alert from "../components/common/Alert";
import { useStamps } from "../hooks/useStamps";
import {
  AddLocationOutlined,
  LocationOnOutlined,
  CategoryOutlined,
  PhotoCameraOutlined,
} from "@mui/icons-material";

const Dashboard = () => {
  const { stamps, loading, error, fetchStamps, deleteStamp } = useStamps();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleEdit = (stamp) => {
    setSelectedStamp(stamp);
    setEditModalOpen(true);
  };

  const handleView = (stamp) => {
    setSelectedStamp(stamp);
    setViewModalOpen(true);
  };

  const handleDelete = async (stamp) => {
    if (!window.confirm(`Are you sure you want to delete "${stamp.title}"?`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteStamp(stamp._id);
      setAlert({ type: "success", message: "Stamp deleted successfully" });
      setViewModalOpen(false);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to delete stamp" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setSelectedStamp(null);
    fetchStamps();
    setAlert({
      type: "success",
      message: editModalOpen
        ? "Stamp updated successfully"
        : "Stamp created successfully",
    });
  };

  // Calculate stats
  const totalStamps = stamps.length;
  const categories = [...new Set(stamps.map((s) => s.category))].length;
  const totalPhotos = stamps.reduce(
    (acc, s) => acc + (s.photos?.length || 0),
    0
  );

  if (loading) {
    return (
      <Layout>
        <Loader fullScreen />
      </Layout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <Layout>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500 rounded-full translate-x-1/3 translate-y-1/3 opacity-10 blur-3xl pointer-events-none" />

        <Container>
          <div className="relative z-10">
            {/* Alert */}
            {alert && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert(null)}
                />
              </motion.div>
            )}

            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 pt-8"
            >
              <div className="flex flex-col gap-6 mb-2">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 break-words">
                    My Stamps
                  </h1>
                  <p className="text-gray-400 text-lg">
                    View and manage all your saved locations
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-fit"
                >
                  <Button
                    onClick={handleCreate}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <AddLocationOutlined fontSize="small" />
                    New Stamp
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Stats */}
            {stamps.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12"
              >
                <motion.div variants={itemVariants}>
                  <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 h-full">
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                        <LocationOnOutlined className="text-white text-lg md:text-2xl" />
                      </div>
                      <div className="text-xs font-semibold text-blue-400 bg-blue-500/20 px-2 md:px-3 py-1 rounded-full whitespace-nowrap">
                        Total
                      </div>
                    </div>
                    <h3 className="text-gray-400 text-xs md:text-sm font-medium mb-1">
                      Stamps
                    </h3>
                    <p className="text-3xl md:text-4xl font-bold text-white">
                      {totalStamps}
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-700 hover:border-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 h-full">
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="p-2 md:p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                        <CategoryOutlined className="text-white text-lg md:text-2xl" />
                      </div>
                      <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2 md:px-3 py-1 rounded-full whitespace-nowrap">
                        Unique
                      </div>
                    </div>
                    <h3 className="text-gray-400 text-xs md:text-sm font-medium mb-1">
                      Categories
                    </h3>
                    <p className="text-3xl md:text-4xl font-bold text-white">
                      {categories}
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 h-full">
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                        <PhotoCameraOutlined className="text-white text-lg md:text-2xl" />
                      </div>
                      <div className="text-xs font-semibold text-purple-400 bg-purple-500/20 px-2 md:px-3 py-1 rounded-full whitespace-nowrap">
                        Collected
                      </div>
                    </div>
                    <h3 className="text-gray-400 text-xs md:text-sm font-medium mb-1">
                      Photos
                    </h3>
                    <p className="text-3xl md:text-4xl font-bold text-white">
                      {totalPhotos}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Alert type="error" message={error} />
              </motion.div>
            )}

            {/* Stamps Grid or Empty State */}
            {stamps.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <EmptyState
                  icon={<LocationOnOutlined style={{ fontSize: 80 }} />}
                  title="No Stamps Yet"
                  description="Start by creating your first location stamp. Save places you visit and want to remember!"
                  action="Create Your First Stamp"
                  onAction={handleCreate}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <StampGrid
                  stamps={stamps}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              </motion.div>
            )}
          </div>
        </Container>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Stamp"
        size="lg"
      >
        <StampForm
          onSuccess={handleFormSuccess}
          onCancel={() => setCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedStamp(null);
        }}
        title="Edit Stamp"
        size="lg"
      >
        <StampForm
          initialData={selectedStamp}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setEditModalOpen(false);
            setSelectedStamp(null);
          }}
        />
      </Modal>

      {/* View Modal */}
      <StampModal
        stamp={selectedStamp}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedStamp(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Layout>
  );
};

export default Dashboard;
