import React from 'react';
import { FaCalendarCheck, FaSearch, FaTools, FaCarSide } from 'react-icons/fa';
import { motion } from 'framer-motion';

const palette = {
  red: '#E22227',
  yellow: '#C7080C',
  gray: '#55666E',
  blue: '#222B31',
};

const steps = [
  {
    icon: <FaCalendarCheck size={32} color={palette.red} />, 
    title: 'Book Appointment',
    desc: 'Choose your service and schedule a visit.',
    bg: '#FDECEC',
  },
  {
    icon: <FaSearch size={32} color={palette.yellow} />, 
    title: 'Vehicle Inspection',
    desc: 'We inspect your vehicle for a thorough checkup.',
    bg: '#FFF5E5',
  },
  {
    icon: <FaTools size={32} color={palette.gray} />, 
    title: 'Service & Repair',
    desc: 'Our experts perform the required services.',
    bg: '#EAF3F7',
  },
  {
    icon: <FaCarSide size={32} color={palette.blue} />, 
    title: 'Pickup & Delivery',
    desc: 'Get your car back, serviced and ready.',
    bg: '#F3F3F3',
  },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.7,
      type: 'spring',
    },
  }),
};

const ProcessSection = () => (
  <motion.section
    style={{ width: '100%', background: '#fff', padding: '56px 0 32px 0' }}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={fadeInVariants}
  >
    <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
      <motion.h2
        style={{ fontSize: 32, fontWeight: 700, color: palette.red, marginBottom: 8 }}
        custom={0}
        variants={fadeInVariants}
      >
        The process we follow
      </motion.h2>
      <motion.p
        style={{ color: palette.gray, fontSize: 16, marginBottom: 40 }}
        custom={0.5}
        variants={fadeInVariants}
      >
        Our streamlined process ensures your vehicle gets the best care, every step of the way.
      </motion.p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            style={{ background: step.bg, borderRadius: 16, padding: '32px 24px', minWidth: 200, maxWidth: 240, flex: 1, margin: '0 8px', boxShadow: '0 2px 8px rgba(34,43,49,0.06)' }}
            custom={idx + 1}
            variants={fadeInVariants}
            whileHover={{ scale: 1.07, boxShadow: '0 8px 32px rgba(34,43,49,0.18)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div style={{ marginBottom: 16 }}>{step.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: palette.blue, marginBottom: 8 }}>{step.title}</h3>
            <p style={{ color: palette.gray, fontSize: 15 }}>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default ProcessSection; 