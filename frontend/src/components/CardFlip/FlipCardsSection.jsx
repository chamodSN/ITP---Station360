import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { assets } from "../../assets/assets";

const palette = {
  blue: 'brightNavyBlue',
  blueDark: 'airForceBlue',
  blueLight: 'bleuDeFrance',
  black: 'charcoal',
  white: 'white',
};

const cardData = [
  {
    front: {
      title: 'Book a Service',
      text: 'Schedule your next vehicle checkup with ease. Choose from a variety of services and get instant confirmation. Our online booking system is fast, simple, and secure.',
      bg: assets.flip1,
      color: palette.blue,
    },
    back: {
      title: 'Fast & Reliable',
      text: 'Our experts ensure your car is road-ready in no time. We use only genuine parts and provide a detailed report after every service. Customer satisfaction is our top priority.',
      bg: assets.flip2,
      color: palette.blueDark,
    },
  },
  {
    front: {
      title: 'Premium Detailing',
      text: 'Give your car a showroom shine. Our detailing packages cover both interior and exterior, using eco-friendly products and advanced techniques for a spotless finish.',
      bg: assets.flip3,
      color: palette.blueLight,
    },
    back: {
      title: 'Interior & Exterior',
      text: 'Comprehensive cleaning for every inch of your vehicle. We restore, protect, and maintain your car\'s value with meticulous attention to detail.',
      bg: assets.flip4,
      color: palette.black,
    },
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

const FlipCardsSection = () => {
  const [flip1, setFlip1] = useState(false);
  const [flip2, setFlip2] = useState(false);

  return (
    <motion.div
      className="w-full max-w-5xl flex flex-col gap-12 mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInVariants}
    >
      {/* First Row: Text Left, Card Right */}
      <motion.div
        className="flex flex-wrap items-center justify-between gap-8"
        custom={1}
        variants={fadeInVariants}
      >
        <div className="flex-1 min-w-[260px] text-left">
          <h2 className={`text-4xl mb-3 font-bold text-${flip1 ? cardData[0].back.color : cardData[0].front.color}`}>{flip1 ? cardData[0].back.title : cardData[0].front.title}</h2>
          <p className="text-charcoal text-lg max-w-xl">{flip1 ? cardData[0].back.text : cardData[0].front.text}</p>
        </div>
        <motion.div
          className="flex-1 min-w-[400px] flex justify-center cursor-pointer"
          whileHover={{ scale: 1.04 }}
          onClick={() => setFlip1(f => !f)}
        >
          <motion.div
            className="relative w-[420px] h-[300px] rounded-xl"
            animate={{ rotateY: flip1 ? 180 : 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
            style={{ perspective: 1200 }}
          >
            <div
              className={`absolute w-full h-full rounded-xl flex flex-col justify-center items-center border-4 border-brightNavyBlue bg-cover bg-center ${flip1 ? 'hidden' : 'flex'}`}
              style={{ backgroundImage: `url(${cardData[0].front.bg})` }}
            >
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">{cardData[0].front.title}</h3>
            </div>
            <div
              className={`absolute w-full h-full rounded-xl flex flex-col justify-center items-center border-4 border-airForceBlue bg-cover bg-center ${flip1 ? 'flex' : 'hidden'}`}
              style={{ backgroundImage: `url(${cardData[0].back.bg})`, transform: 'rotateY(180deg)' }}
            >
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">{cardData[0].back.title}</h3>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Second Row: Card Left, Text Right */}
      <motion.div
        className="flex flex-wrap items-center justify-between gap-8 flex-row-reverse"
        custom={2}
        variants={fadeInVariants}
      >
        <div className="flex-1 min-w-[260px] text-left">
          <h2 className={`text-4xl mb-3 font-bold text-${flip2 ? cardData[1].back.color : cardData[1].front.color}`}>{flip2 ? cardData[1].back.title : cardData[1].front.title}</h2>
          <p className="text-charcoal text-lg max-w-xl">{flip2 ? cardData[1].back.text : cardData[1].front.text}</p>
        </div>
        <motion.div
          className="flex-1 min-w-[400px] flex justify-center cursor-pointer"
          whileHover={{ scale: 1.04 }}
          onClick={() => setFlip2(f => !f)}
        >
          <motion.div
            className="relative w-[420px] h-[300px] rounded-xl"
            animate={{ rotateY: flip2 ? 180 : 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
            style={{ perspective: 1200 }}
          >
            <div
              className={`absolute w-full h-full rounded-xl flex flex-col justify-center items-center border-4 border-bleuDeFrance bg-cover bg-center ${flip2 ? 'hidden' : 'flex'}`}
              style={{ backgroundImage: `url(${cardData[1].front.bg})` }}
            >
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">{cardData[1].front.title}</h3>
            </div>
            <div
              className={`absolute w-full h-full rounded-xl flex flex-col justify-center items-center border-4 border-charcoal bg-cover bg-center ${flip2 ? 'flex' : 'hidden'}`}
              style={{ backgroundImage: `url(${cardData[1].back.bg})`, transform: 'rotateY(180deg)' }}
            >
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">{cardData[1].back.title}</h3>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FlipCardsSection; 