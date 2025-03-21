import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

function Home() {
    const navigate = useNavigate();
    const [activeService, setActiveService] = useState(null);
    const { scrollYProgress } = useScroll();
    
    // Refs for scroll animations
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const servicesRef = useRef(null);
    const testimonialsRef = useRef(null);
    const pricingRef = useRef(null);
    
    // Scroll progress animations
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    
    // Section visibility checks
    const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
    const servicesInView = useInView(servicesRef, { once: true, amount: 0.3 });
    const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 });
    const pricingInView = useInView(pricingRef, { once: true, amount: 0.3 });

    // Animation variants
    const fadeInUp = {
      hidden: { opacity: 0, y: 60 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
      }
    };

    const floatingAnimation = {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    };

    // Services data
    const services = [
      {
        title: 'Instagram Growth',
        desc: 'Organic followers and engagement for your Instagram profile',
        icon: '📸',
        color: 'from-pink-500 to-purple-500'
      },
      {
        title: 'TikTok Famous',
        desc: 'Boost your TikTok presence with real followers and views',
        icon: '🎵',
        color: 'from-blue-500 to-teal-500'
      },
      {
        title: 'Twitter Boost',
        desc: 'Increase your Twitter following and engagement',
        icon: '🐦',
        color: 'from-indigo-500 to-blue-500'
      }
    ];

    // Stats data
    const stats = [
      { number: '10K+', label: 'Happy Clients', icon: '👥' },
      { number: '50M+', label: 'Followers Delivered', icon: '🚀' },
      { number: '99%', label: 'Success Rate', icon: '📈' },
      { number: '24/7', label: 'Support', icon: '💬' }
    ];

    // Pricing data
    const pricingPlans = [
      {
        plan: 'Basic Package',
        price: '₦15,000',
        perK: '₦15,000 per 1k followers',
        features: [
          'Delivery within 5-7 days',
          'Basic Support',
          'Real-looking profiles',
          'No password required'
        ],
        popular: false
      },
      {
        plan: 'Premium Package',
        price: '₦12,500',
        perK: '₦12,500 per 1k followers',
        features: [
          'Delivery within 2-3 days',
          '24/7 Support',
          'High-quality profiles',
          'Gradual delivery',
          'Engagement bonus'
        ],
        popular: true
      },
      {
        plan: 'Bulk Package',
        price: '₦10,000',
        perK: '₦10,000 per 1k followers',
        features: [
          'Delivery within 1-2 days',
          'Priority Support',
          'Premium profiles',
          'Custom delivery speed',
          'Engagement guarantee',
          'Replacement warranty'
        ],
        popular: false
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 relative">
        {/* Animated background gradient */}
        <motion.div 
          className="fixed inset-0 -z-10"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <Navbar />

        <main className="relative">
          {/* Hero Section */}
          <motion.section 
            ref={heroRef}
            style={{ y }}
            className="pt-40 pb-32 px-4 min-h-[90vh] flex items-center relative"
          >
            <motion.div 
              className="absolute top-20 right-20 w-20 h-20 rounded-full bg-pink-400/20 blur-xl"
              animate={floatingAnimation}
            />
            <motion.div 
              className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-blue-400/20 blur-xl"
              animate={floatingAnimation}
            />

            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative">
              <motion.div 
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="md:w-1/2 mb-10 md:mb-0"
              >
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-pink-800 to-blue-900 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Boost Your Social Presence
                </motion.h1>
                <motion.p 
                  className="text-xl md:text-2xl text-gray-600 mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Get real followers, likes, and engagement for your social media accounts. 
                  Trusted by thousands of influencers and businesses.
                </motion.p>
                <motion.button
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-8 py-4 rounded-full 
                    hover:shadow-lg transform transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(236, 72, 153, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Get Started
                </motion.button>
              </motion.div>

              <motion.div 
                className="md:w-1/2 perspective-1000"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, type: "spring", delay: 0.4 }}
              >
                <motion.div 
                  className="relative rounded-lg shadow-2xl overflow-hidden"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-gradient-to-r from-pink-200 to-blue-200 rounded-lg overflow-hidden">
                    <img 
                      src="/mmmi.jpeg" 
                      alt="Social Media Marketing" 
                      className="w-full h-full object-cover"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section 
            ref={statsRef}
            className="py-16 bg-white/80 backdrop-blur-sm relative overflow-hidden"
          >
            <motion.div 
              className="container mx-auto px-4"
              variants={staggerContainer}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-lg 
                      blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                    <div className="relative p-8 rounded-lg bg-white/80 backdrop-blur-sm border border-white/50 
                      shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <div className="text-4xl mb-4">{stat.icon}</div>
                      <motion.h3 
                        className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {stat.number}
                      </motion.h3>
                      <p className="text-gray-600 mt-2 font-medium">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.section>

          {/* Services Section */}
          <motion.section 
            ref={servicesRef}
            className="py-20 bg-white relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 20%, #ec4899 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 80%, #3b82f6 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 80%, #ec4899 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <div className="container mx-auto px-4 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 
                  to-blue-500 bg-clip-text text-transparent mb-4">
                  Our Services
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Choose from our wide range of social media growth services
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    className="relative group cursor-pointer"
                    onClick={() => setActiveService(service)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-xl 
                      blur-xl transition-all duration-500 opacity-0 group-hover:opacity-20`} />
                    <div className="relative p-8 rounded-xl bg-white border border-gray-100 shadow-xl 
                      group-hover:shadow-2xl transition-all duration-500">
                      <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-blue-500 
                        bg-clip-text text-transparent">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-6">{service.desc}</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 
                          text-white font-medium text-sm hover:shadow-lg transition-all duration-300"
                      >
                        Learn More →
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* Testimonials Section */}
          <motion.section 
            ref={testimonialsRef}
            className="py-20 bg-gradient-to-br from-pink-50 to-blue-50 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 15, repeat: Infinity }}
            />
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 
                  to-blue-500 bg-clip-text text-transparent mb-4">
                  What Our Clients Say
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Join thousands of satisfied customers who have transformed their social media presence
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
              >
                {[
                  {
                    name: "Sarah Johnson",
                    username: "@sarahcreates",
                    image: "/testimonial1.jpg",
                    text: "SocialBoost transformed my Instagram presence! Gained real, engaging followers.",
                    platform: "Instagram"
                  },
                  {
                    name: "Mike Chen",
                    username: "@miketech",
                    image: "/testimonial2.jpg",
                    text: "The best investment for my business. My TikTok following grew exponentially!",
                    platform: "TikTok"
                  },
                  {
                    name: "Lisa Wright",
                    username: "@lisawrites",
                    image: "/testimonial3.jpg",
                    text: "Professional service with amazing results. Highly recommended!",
                    platform: "Twitter"
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="flex items-center mb-6">
                      <motion.div 
                        className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-pink-300 to-blue-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div className="ml-4">
                        <h4 className="font-bold text-lg">{testimonial.name}</h4>
                        <p className="text-gray-500">{testimonial.username}</p>
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-pink-100 to-blue-100 
                          rounded-full text-sm font-medium text-gray-700 mt-1">
                          {testimonial.platform}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">{testimonial.text}</p>
                    <div className="flex text-pink-500">★★★★★</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* Interactive CTA Section */}
          <motion.section 
            className="py-20 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #EC4899 0%, #3B82F6 100%)"
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            
            <div className="container mx-auto px-4 relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center text-white"
              >
                <motion.h2 
                  className="text-4xl md:text-6xl font-bold mb-8"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Ready to Skyrocket Your Social Media?
                </motion.h2>
                <p className="text-xl md:text-2xl mb-12 opacity-90">
                  Join thousands of satisfied customers and take your social presence to new heights
                </p>
                <motion.button
                  onClick={() => navigate('/signup')}
                  className="bg-white text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500 
                    px-12 py-4 rounded-full text-lg font-bold border-2 border-white hover:bg-transparent 
                    hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.05, boxShadow: "0px 8px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Now
                </motion.button>
              </motion.div>
            </div>
          </motion.section>
        </main>
      </div>
    );
}

export default Home;