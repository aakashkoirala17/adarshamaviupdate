import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Search, Filter, Camera, Maximize2, Award, Users, BookOpen } from 'lucide-react';
import Layout from '../components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: galleryImages = [] } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      return data || [];
    }
  });

  const categories = ["All", ...Array.from(new Set(galleryImages.map((img: any) => img.category).filter(Boolean)))] as string[];

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-primary pt-24 pb-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight uppercase">Visual <span className="text-brandRed">Gallery</span></h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto font-medium mb-4">
              Explore the vibrant life at Adarsha through our collection of photos capturing moments of achievement, creativity, and community.
            </p>
            <p className="text-lg font-nepali text-white/60 font-bold uppercase tracking-widest">हाम्रो दृश्य यात्रा</p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative z-20 -mt-12">
        <div className="section-container">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-primary/5 border border-primary/5">
            <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              <div className="flex items-center gap-2 mr-4 text-primary/40 hidden md:flex">
                <Filter size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Filter By:</span>
              </div>
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`rounded-full px-8 h-12 font-bold uppercase tracking-widest text-xs transition-all ${
                    selectedCategory === category 
                      ? "shadow-lg shadow-primary/20" 
                      : "border-secondary text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div 
                  layout
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(image.image_url)}
                >
                  <div className="premium-card overflow-hidden bg-white aspect-[4/3] relative">
                    <img 
                      src={image.image_url}
                      alt={image.caption || 'Gallery image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center">
                      <div className="bg-white/20 p-4 rounded-full mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Maximize2 className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                        {image.caption || "Campus Moment"}
                      </h3>
                      {image.caption_nepali && (
                        <p className="text-sm font-nepali text-white/70 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                          {image.caption_nepali}
                        </p>
                      )}
                      <div className="mt-6 px-4 py-1 bg-brandRed rounded-full text-[10px] font-black uppercase tracking-widest text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                        {image.category}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredImages.length === 0 && (
            <div className="text-center py-32 bg-secondary/20 rounded-[3rem] border-2 border-dashed border-secondary">
              <div className="bg-white/50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <Camera className="text-muted-foreground/20" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">No images found</h2>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">We haven't added photos to this category yet. Please check back later!</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0f172a]/95 z-[200] flex items-center justify-center p-8 md:p-16 backdrop-blur-xl"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-all h-14 w-14 rounded-full bg-white/5 flex items-center justify-center"
            >
              <X size={32} />
            </button>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-6xl w-full h-full flex items-center justify-center"
            >
              <img 
                src={selectedImage}
                alt="Full preview"
                className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl ring-1 ring-white/10"
                decoding="async"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Section */}
      <section className="py-24 bg-secondary/30">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { label: "Years of Heritage", val: "75+", icon: Award },
              { label: "Total Students", val: "1500+", icon: Users },
              { label: "Graduated Alumni", val: "10,000+", icon: BookOpen },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="bg-white w-20 h-20 rounded-3xl shadow-xl shadow-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-all duration-500 border border-primary/5 group-hover:-translate-y-2">
                  <stat.icon className="text-primary group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-4xl font-black text-primary mb-2 tracking-tight group-hover:text-brandRed transition-colors">{stat.val}</h3>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
