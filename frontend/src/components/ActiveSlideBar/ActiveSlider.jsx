import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { FreeMode, Pagination } from "swiper/modules";
import { RxArrowTopRight } from "react-icons/rx";
import { FaOilCan, FaCarCrash, FaTools, FaBatteryFull, FaCarSide } from "react-icons/fa";
import { motion } from 'framer-motion';
import { assets } from "../../assets/assets";


const palette = {
  red: '#E22227',
  darkRed: '#C7080C',
  deepRed: '#6C0102',
  darkestRed: '#440101',
  darkBlue: '#222B31',
  gray: '#55666E',
};

// Service Data Array
const ServiceData = [
  {
    title: "Oil Change",
    content: "Keep your engine running smoothly with our quick and efficient oil change service.",
    icon: FaOilCan,
    backgroundImage: assets.OilChangeImg,
    color: palette.red,
  },
  {
    title: "Full Service",
    content: "A comprehensive vehicle checkup including engine diagnostics, filters, and fluids.",
    icon: FaTools,
    backgroundImage: assets.FullServiceImg,
    color: palette.darkRed,
  },
  {
    title: "Battery Check",
    content: "Ensure your battery is in top condition with our professional testing and replacement.",
    icon: FaBatteryFull,
    backgroundImage: assets.BatteryCheckImg,
    color: palette.gray,
  },
  {
    title: "Collision Repair",
    content: "Accident damage? Let us restore your vehicle's appearance and safety.",
    icon: FaCarCrash,
    backgroundImage: assets.CollisionRepairImg,
    color: palette.deepRed,
  },
  {
    title: "Car Wash & Detailing",
    content: "Give your car a showroom shine with our premium wash and detailing packages.",
    icon: FaCarSide,
    backgroundImage: assets.CarWashImg,
    color: palette.darkBlue,
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

const slideInVariants = {
  hiddenLeft: { opacity: 0, x: -80 },
  hiddenRight: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, type: 'spring' } },
};

// Slider Component
const ActiveSlider = () => {
  return (
    <motion.div
      style={{ background: '#fff', padding: '48px 0', width: '100%' }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInVariants}
    >
      <motion.h2
        style={{ color: palette.red, textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 32 }}
        custom={0}
        variants={fadeInVariants}
      >Our Services</motion.h2>
      <Swiper
        breakpoints={{
          340: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          700: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
        }}
        freeMode={true}
        pagination={{ clickable: true }}
        modules={[FreeMode, Pagination]}
        className="max-w-[90%] lg:max-w-[80%]"
      >
        {ServiceData.map((item, idx) => (
          <SwiperSlide key={item.title}>
            <motion.div
              style={{
                position: 'relative',
                borderRadius: 18,
                overflow: 'hidden',
                height: 320,
                width: 300,
                margin: '0 auto',
                boxShadow: '0 4px 24px rgba(34,43,49,0.10)',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 0,
              }}
              initial={idx % 2 === 0 ? 'hiddenLeft' : 'hiddenRight'}
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideInVariants}
              whileHover={{ scale: 1.06, boxShadow: '0 8px 32px rgba(34,43,49,0.18)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(120deg, ${item.color}99 0%, #fff0 100%)`,
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${item.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.18,
                  zIndex: 0,
                }}
              />
              <div style={{ position: 'relative', zIndex: 2, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <item.icon style={{ color: item.color, width: 36, height: 36 }} />
                <h3 style={{ color: palette.darkBlue, fontSize: 22, fontWeight: 700 }}>{item.title}</h3>
                <p style={{ color: palette.gray, fontSize: 16 }}>{item.content}</p>
              </div>
              <RxArrowTopRight style={{ position: 'absolute', bottom: 18, left: 18, width: 32, height: 32, color: palette.red, zIndex: 2 }} />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};

export default ActiveSlider;
