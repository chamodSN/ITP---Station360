import { FaPhoneAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const fadeInVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: 'spring' } },
};

const EmergencyBanner = () => (
  <motion.div
    className="w-full bg-brightNavyBlue text-white flex flex-col md:flex-row items-center justify-between px-6 py-6 rounded-xl shadow-lg my-12 max-w-5xl mx-auto"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={fadeInVariants}
  >
    <div className="flex items-center gap-4">
      <FaPhoneAlt className="text-3xl text-white animate-pulse" />
      <div>
        <div className="text-xl font-bold">Breakdown? Call Us 24/7!</div>
        <div className="text-lg">Emergency Roadside Assistance</div>
      </div>
    </div>
    <a href="tel:18003604357" className="mt-4 md:mt-0 bg-white text-brightNavyBlue font-bold px-6 py-2 rounded-full shadow hover:bg-bleuDeFrance hover:text-white transition">Call 1800-360-4357</a>
  </motion.div>
);

export default EmergencyBanner; 