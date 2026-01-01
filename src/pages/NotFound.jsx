import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import { LocationOffOutlined, HomeOutlined } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Layout>
      <Container className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <LocationOffOutlined
            className="text-gray-600 mb-6"
            style={{ fontSize: 120 }}
          />
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-4">Location Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Looks like this page has wandered off the map. Let's get you back on track!
          </p>
          <Link to="/">
            <Button>
              <HomeOutlined fontSize="small" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default NotFound;