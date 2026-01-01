import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Container from '../components/layout/Container';
import { useAuth } from '../hooks/useAuth';
import {
  LocationOnOutlined,
  PhotoCameraOutlined,
  MapOutlined,
  NavigationOutlined,
  CheckCircleOutlined,
} from '@mui/icons-material';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <LocationOnOutlined />,
      title: 'GPS Stamping',
      description: 'Save locations with precise GPS coordinates',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <PhotoCameraOutlined />,
      title: 'Photo Memories',
      description: 'Upload up to 5 photos per location',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <MapOutlined />,
      title: 'Interactive Map',
      description: 'View all your stamps on an interactive map',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <NavigationOutlined />,
      title: 'Easy Navigation',
      description: 'Navigate back to saved locations anytime',
      gradient: 'from-orange-500 to-amber-500',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Users', icon: '👥' },
    { number: '50K+', label: 'Locations Saved', icon: '📍' },
    { number: '98%', label: 'User Satisfaction', icon: '⭐' },
  ];

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
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 pt-20 pb-32">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full translate-x-1/4 translate-y-1/4 opacity-20 blur-3xl" />
        
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-4 px-4 py-2 bg-gray-800 rounded-full border border-blue-500 border-opacity-30"
            >
              <span className="text-sm font-semibold text-blue-400">✨ Welcome to Stamp</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Stamp Your
              <span className="block text-blue-500">
                Favorite Locations
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Save, organize, and revisit the places that matter most. 
              GPS-tagged locations with photos, notes, and seamless navigation.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {isAuthenticated ? (
                <Link to="/dashboard" className="inline-block">
                  <Button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="inline-block">
                    <Button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login" className="inline-block">
                    <Button className="px-8 py-3 bg-gray-800 border-2 border-blue-500 text-blue-400 hover:bg-gray-700 font-semibold rounded-lg transition-all">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-800 py-12">
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center text-white"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-400">{stat.number}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to manage and explore your favorite locations
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' }}
                className="group bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-blue-500"
              >
                <div className={`inline-flex p-3 bg-gradient-to-br ${feature.gradient} rounded-lg mb-6 group-hover:scale-110 transition-transform`}>
                  <div className="text-white text-2xl">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-800">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-8">
                Why Choose Stamp?
              </h2>
              <div className="space-y-4">
                {[
                  'Never lose a favorite location again',
                  'Beautifully organized with photos and notes',
                  'Fast, accurate GPS tracking',
                  'Works offline and online',
                  'Share locations with friends',
                  'Nostalgic memories at your fingertips',
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircleOutlined className="text-blue-500 text-2xl flex-shrink-0 mt-1" />
                    <span className="text-gray-300 text-lg font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-10 blur-2xl" />
              <div className="relative bg-gray-900 rounded-2xl p-12 border border-gray-700">
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-gray-300">Locations Saved</div>
                      <div className="text-2xl">📍</div>
                    </div>
                    <div className="text-3xl font-bold text-blue-500">247</div>
                    <div className="text-sm text-gray-500 mt-2">+32 this month</div>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-gray-300">Photos Uploaded</div>
                      <div className="text-2xl">📸</div>
                    </div>
                    <div className="text-3xl font-bold text-cyan-500">1,248</div>
                    <div className="text-sm text-gray-500 mt-2">Across all locations</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-900 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
        </div>

        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center"
          >
            <h2 className="text-5xl font-bold text-white mb-6">Ready to Start?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of travelers saving their favorite locations. Start stamping your journey today.
            </p>
            {!isAuthenticated && (
              <Link to="/login" className="inline-block">
                <Button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all text-lg">
                  Create Free Account
                </Button>
              </Link>
            )}
          </motion.div>
        </Container>
      </section>
    </Layout>
  );
};

export default Home;