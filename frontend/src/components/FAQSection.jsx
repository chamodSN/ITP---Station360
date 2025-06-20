import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'How do I book a service with Station360?',
    answer: 'Simply click on the Book Appointment section, choose your service, select a date and time, and confirm your booking online.',
  },
  {
    question: 'What should I do if my car breaks down?',
    answer: 'Call our 24/7 emergency hotline at 1800-360-HELP and our team will assist you immediately.',
  },
  {
    question: 'Can I reschedule or cancel my booking?',
    answer: 'Yes, you can easily reschedule or cancel your booking from your account dashboard or by contacting our support team.',
  },
  {
    question: 'Do you offer pick-up and drop-off services?',
    answer: 'Absolutely! We provide convenient pick-up and drop-off for your vehicle at your preferred location.',
  },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: 'spring' } },
};

const FAQSection = () => {
  return (
    <motion.section
      className="w-full max-w-6xl mx-auto my-16 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInVariants}
    >
      <h2 className="text-3xl font-bold text-brightNavyBlue mb-12 text-center">Frequently Asked Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            className="group relative h-[200px] bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brightNavyBlue to-bleuDeFrance opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative h-full p-6 flex flex-col justify-between">
              <h3 className="text-xl font-semibold text-charcoal group-hover:text-white transition-colors duration-300">
                {faq.question}
              </h3>
              <p className="text-charcoal/80 group-hover:text-white/90 transition-colors duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default FAQSection; 