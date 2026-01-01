import {
  LocationOnOutlined,
  GitHub,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  // Hide footer on login page
  if (location.pathname === "/login") {
    return null;
  }

  const socialLinks = [
    { icon: GitHub, label: "GitHub", href: "https://github.com/chimaangwe" },
    { icon: Twitter, label: "Twitter", href: "https://x.com/chimaangwe" },
    {
      icon: LinkedIn,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/angwe-chima-679560274/",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800 mt-auto overflow-hidden py-10">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full translate-x-1/2 translate-y-1/2 opacity-5 blur-3xl" />

      <div className="relative z-10 container-custom py-16">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-8"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 text-2xl font-bold mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <LocationOnOutlined className="text-white text-2xl" />
              </div>
              <span className="text-white">Stamp</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Save and revisit your favorite locations with GPS-tagged stamps,
              photos, and notes. Never lose a memory again.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ scale: 1.15 }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-all duration-300"
                  title={social.label}
                >
                  <Icon className="text-xl" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 mb-8" />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Location Stamper. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
