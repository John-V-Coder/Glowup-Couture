import { motion } from "framer-motion";
import { Heart, Users, Award, Sparkles } from "lucide-react";
import heroBackground from "@/assets/images/hero-bg.jpg";
import { Phone } from "lucide-react";
import { MessageSquare } from "lucide-react";import WhatsAppButton from "@/components/common/whatsApp";
;
import PageWrapper from "@/components/common/page-wrapper";

function AboutUs() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <PageWrapper message="Loading about page...">
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-cream-50">
      {/* Hero Section */}
   <motion.section 
  className="relative py-28 px-4 text-center min-h-[80vh] flex items-center justify-center"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  {/* Background image with golden overlay */}
  <div className="absolute inset-0 overflow-hidden">
    <img
      src={heroBackground}
      alt="Luxury golden fashion background"
      className="w-full h-full object-cover object-center"
      loading="eager"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-amber-900/30 to-amber-900/40" />
  </div>
  {/* Quick action buttons - top right */}
  <div className="absolute top-6 right-6 flex gap-3 z-10">
    <button className="bg-amber-600/90 hover:bg-amber-700 text-white p-2 rounded-full">
      <Phone className="w-5 h-5" />
    </button>
    <a 
      href="https://wa.me/254797613671" 
      className="bg-green-600/90 hover:bg-green-700 text-white p-2 rounded-full"
    >
      <MessageSquare className="w-5 h-5" />
    </a>
  </div>
  {/* Main content */}
  <div className="max-w-4xl mx-auto relative z-10 px-4">
    <motion.h1 
      className="text-5xl md:text-6xl font-bold text-amber-50 mb-6 drop-shadow-lg"
      {...fadeInUp}
    >
      Glowup Couture
    </motion.h1> 
    <motion.p 
      className="text-xl md:text-2xl text-amber-100 mb-8 leading-relaxed font-medium"
      {...fadeInUp}
      transition={{ delay: 0.2 }}
    >
      Where luxury meets timeless elegance
    </motion.p> 
    <motion.div 
      className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-300 mx-auto rounded-full mb-10"
      {...fadeInUp}
      transition={{ delay: 0.4 }}
    />
  </div>

</motion.section>

      {/* Story Section */}
      <motion.section 
        className="py-16 px-4"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl font-bold text-amber-900 mb-6">Our Legacy</h2>
              <p className="text-lg text-amber-800/90 mb-6 leading-relaxed">
                Founded on the principles of luxury and transformation, Glowup Couture redefines modern elegance. 
                Each piece is a testament to craftsmanship that stands the test of time.
              </p>
              <p className="text-lg text-amber-800/90 mb-6 leading-relaxed">
                We blend contemporary design with timeless sophistication, creating collections that 
                empower you to shine with quiet confidence. Our journey began with a single golden 
                thread and has grown into a tapestry of refined style.
              </p>
              <p className="text-lg text-amber-800/90 leading-relaxed">
                Every garment carries our commitment to ethical sourcing and meticulous attention 
                to detail—because true luxury should feel as good as it looks.
              </p>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="relative"
            >
              <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-8 text-cream-50 shadow-xl">
                <Sparkles className="w-12 h-12 mb-4 text-amber-200" />
                <h3 className="text-2xl font-bold mb-4 text-white">Our Philosophy</h3>
                <p className="text-lg text-amber-100">
                  To craft not just clothing, but wearable art that celebrates your unique radiance. 
                  We believe in fashion that elevates without shouting.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      {/* Values Section */}
      <motion.section 
        className="py-16 px-4 bg-cream-50"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center text-amber-900 mb-12"
            variants={fadeInUp}
          >
            Standard
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center p-8 rounded-xl bg-cream-50 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Heart className="w-8 h-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">Artisan Passion</h3>
              <p className="text-amber-800/90">
                Each stitch carries intention, every detail reflects our devotion to the craft of 
                exceptional fashion.
              </p>
            </motion.div>            
            <motion.div 
              className="text-center p-8 rounded-xl bg-cream-50 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Users className="w-8 h-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">Discerning Community</h3>
              <p className="text-amber-800/90">
                A collective of individuals who appreciate the language of fine materials and 
                understated luxury.
              </p>
            </motion.div>
            <motion.div 
              className="text-center p-8 rounded-xl bg-cream-50 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Award className="w-8 h-8 text-cream-50" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">Uncompromising Quality</h3>
              <p className="text-amber-800/90">
                We source only the finest materials, upholding standards that transcend seasonal 
                trends.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      {/* CTA Section */}
      <motion.section 
        className="py-24 px-4 bg-gradient-to-b from-amber-50 to-cream-50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-amber-900 mb-6">
            Begin Your Golden Chapter
          </h2>
          <p className="text-xl text-amber-800/90 mb-8">
            Join those who have discovered the quiet power of considered elegance.
          </p>
          <motion.button 
            className="bg-gradient-to-r from-amber-600 to-amber-700 text-cream-50 px-10 py-5 rounded-full text-lg font-medium tracking-wide hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Discover Timeless Pieces
          </motion.button>
        </div>
      </motion.section>
    </div>
    </PageWrapper>
  );
}
export default AboutUs;