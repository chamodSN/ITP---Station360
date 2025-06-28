import React from 'react';
import { motion, useInView } from 'framer-motion';
import { FaTools, FaCarSide, FaCalendarCheck, FaArrowRight } from 'react-icons/fa';
import { useRef } from 'react';
import { assets } from '../assets/assets'

const services = [
  {
    icon: <FaTools className="text-primary text-3xl mx-auto" />,
    title: 'General Maintenance',
    desc: 'Keep your vehicle in top shape with our comprehensive maintenance services.'
  },
  {
    icon: <FaCarSide className="text-primary text-3xl mx-auto" />,
    title: 'Vehicle Diagnostics',
    desc: 'Advanced diagnostics to quickly identify and resolve issues.'
  },
  {
    icon: <FaCalendarCheck className="text-primary text-3xl mx-auto" />,
    title: 'Online Booking',
    desc: 'Book your service appointments easily with our online system.'
  },
  {
    icon: <FaTools className="text-primary text-3xl mx-auto" />,
    title: 'Repairs',
    desc: 'Expert repairs for all makes and models, big or small.'
  },
  {
    icon: <FaCarSide className="text-primary text-3xl mx-auto" />,
    title: 'Fleet Services',
    desc: 'Tailored solutions for business and fleet vehicle maintenance.'
  },
  {
    icon: <FaCalendarCheck className="text-primary text-3xl mx-auto" />,
    title: 'Emergency Support',
    desc: '24/7 support to get you back on the road quickly.'
  },
];

const team = [
  {
    name: 'Camod Netmina',
    role: 'Founder & CEO',
    img: assets.chamod,
    bio: 'Passionate about revolutionizing vehicle service experiences.'
  },
  {
    name: 'Akila Herath',
    role: 'Lead Technician',
    img: assets.chamod,
    bio: 'Expert in diagnostics and repairs with 10+ years of experience.'
  },
  {
    name: 'Kavindya Sithumini',
    role: 'Customer Success',
    img: assets.chamod,
    bio: 'Ensuring every customer leaves with a smile.'
  },
  {
    name: 'Anudi Induwari',
    role: 'Service Advisor',
    img: assets.chamod,
    bio: 'Connecting customers with the right solutions for their vehicles.'
  },
  {
    name: 'Lihini Nethmini',
    role: 'Workshop Manager',
    img: assets.chamod,
    bio: 'Overseeing daily operations and ensuring top-quality service.'
  },
];

const AboutUs = () => {
  // Animation refs
  const cardsRef = useRef(null);
  const teamRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true });
  const teamInView = useInView(teamRef, { once: true });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${assets.aboutUs})`
          }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About Station360
            </motion.h1>
            <motion.p
              className="text-white text-lg md:text-xl max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Station360 is your trusted partner for seamless vehicle service booking, maintenance, and repairs. Our mission is to make car care easy, transparent, and reliable for everyone.
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2
          className="text-center text-primary font-semibold mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Features & Services
        </motion.h2>
        <motion.h3
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          A wide range of vehicle service solutions
        </motion.h3>
        <motion.div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
        >
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              className="relative bg-white rounded-2xl shadow-lg p-8 pt-14 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-full shadow p-4">
                {service.icon}
              </div>
              <h4 className="font-bold text-lg mt-4 mb-2">{service.title}</h4>
              <p className="text-gray-500 mb-6">{service.desc}</p>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200">
                <FaArrowRight />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Meet Our Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2
          className="text-center text-primary font-semibold mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Meet Our Team
        </motion.h2>
        <motion.h3
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          The people behind Station360
        </motion.h3>
        <motion.div
          ref={teamRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
        >
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary mb-4 shadow"
              />
              <h4 className="font-bold text-lg mt-2 mb-1">{member.name}</h4>
              <p className="text-primary font-semibold mb-2">{member.role}</p>
              <p className="text-gray-500 text-sm">{member.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;