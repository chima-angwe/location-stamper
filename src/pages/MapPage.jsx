import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import Container from "../components/layout/Container";
import PageHeader from "../components/layout/PageHeader";
import MapView from "../components/map/MapView";
import StampModal from "../components/stamps/StampModal";
import Select from "../components/common/Select";
import Loader from "../components/common/Loader";
import EmptyState from "../components/layout/EmptyState";
import { useStamps } from "../hooks/useStamps";
import { CATEGORIES } from "../utils/constants";
import { MapOutlined } from "@mui/icons-material";

const MapPage = () => {
  const { stamps, loading, error, deleteStamp, fetchStamps } = useStamps();
  const [selectedStamp, setSelectedStamp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleStampClick = (stamp) => {
    setSelectedStamp(stamp);
    setModalOpen(true);
  };

  const handleDelete = async (stamp) => {
    if (!window.confirm(`Are you sure you want to delete "${stamp.title}"?`)) {
      return;
    }
    setDeleteLoading(true);
    try {
      await deleteStamp(stamp._id);
      setModalOpen(false);
    } catch (err) {
      console.error("Error deleting stamp:", err);
      alert("Failed to delete stamp");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter stamps by category
  const filteredStamps =
    categoryFilter === "all"
      ? stamps
      : stamps.filter((s) => s.category === categoryFilter);

  if (loading) {
    return (
      <Layout>
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[600px]">
            <Loader />
            <p className="text-gray-400 mt-4">Loading map...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title="Map View"
            subtitle="Explore all your stamps on an interactive map"
            action={
              <Select
                name="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Categories" },
                  ...CATEGORIES,
                ]}
              />
            }
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300"
            >
              <p className="font-semibold mb-2">Error Loading Stamps</p>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={fetchStamps}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {stamps.length === 0 ? (
            <EmptyState
              icon={<MapOutlined style={{ fontSize: 80 }} />}
              title="No Stamps to Display"
              description="Create your first stamp to see it on the map!"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-xl"
            >
              <MapView
                stamps={filteredStamps}
                onStampClick={handleStampClick}
                center={[20, 0]}
                zoom={3}
              />
            </motion.div>
          )}
        </motion.div>

        {/* View Modal */}
        <StampModal
          stamp={selectedStamp}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedStamp(null);
          }}
          onEdit={(stamp) => {
            setModalOpen(false);
          }}
          onDelete={handleDelete}
        />
      </Container>
    </Layout>
  );
};

export default MapPage;
