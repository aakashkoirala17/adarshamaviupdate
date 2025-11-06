import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Layout from '../components/Layout';
import { supabase } from '@/integrations/supabase/client';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchGalleryImages = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (data) setGalleryImages(data);
    };

    fetchGalleryImages();
  }, []);

  const categories = ["All", ...Array.from(new Set(galleryImages.map(img => img.category)))];

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">School Gallery</h1>
            <p className="text-lg font-nepali text-primary mb-2">विद्यालय ग्यालरी</p>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Take a visual journey through our school facilities, activities, and academic programs
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div 
                key={image.id}
                className="group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => setSelectedImage(image.image_url)}
              >
                <div className="relative">
                  <img 
                    src={image.image_url}
                    alt={image.caption || 'Gallery image'}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                      {image.caption && <p className="text-lg font-semibold">{image.caption}</p>}
                      {image.caption_nepali && <p className="text-sm font-nepali mt-1">{image.caption_nepali}</p>}
                      <p className="text-sm bg-primary px-3 py-1 rounded-full mt-2 inline-block">
                        {image.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImage}
              alt="Enlarged view"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Photo Statistics */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Visual Story</h2>
            <p className="text-lg text-muted-foreground">
              Capturing moments of learning, growth, and achievement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">15+</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Years of Excellence</h3>
              <p className="text-muted-foreground">Serving the community with quality education</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">500+</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Happy Students</h3>
              <p className="text-muted-foreground">Students enrolled across all programs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Academic Programs</h3>
              <p className="text-muted-foreground">Comprehensive education offerings</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
