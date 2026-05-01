import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Newspaper, Clock, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Blogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await (supabase.from("blogs" as any) as any)
        .select("*")
        .eq("is_active", true)
        .order("published_at", { ascending: false });
      setBlogs(data || []);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

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
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight uppercase">School <span className="text-brandRed">Stories</span></h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto font-medium mb-4">
              Explore the latest news, academic achievements, and creative expressions from our students and faculty.
            </p>
            <p className="text-lg font-nepali text-white/60 font-bold uppercase tracking-widest">विद्यालयका ताजा गतिविधिहरू</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white relative z-20 -mt-12">
        <div className="section-container">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Fetching Latest Stories...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((blog, idx) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={`/blogs/${blog.id}`} className="block group h-full">
                    <div className="premium-card h-full overflow-hidden flex flex-col bg-white hover:border-primary/20 transition-all duration-500">
                      <div className="aspect-[16/10] relative overflow-hidden">
                        {blog.image_url ? (
                          <img 
                            src={blog.image_url} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            alt={blog.title} 
                          />
                        ) : (
                          <div className="bg-secondary/50 w-full h-full flex items-center justify-center">
                            <Newspaper size={48} className="text-primary/10" />
                          </div>
                        )}
                        <div className="absolute top-5 left-5">
                          <span className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-primary/20">
                            {blog.category || "Education"}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-brandRed" />
                            <span>{new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          <div className="w-1 h-1 bg-secondary rounded-full" />
                          <div className="flex items-center gap-1.5">
                            <User size={12} className="text-primary" />
                            <span>{blog.author_name}</span>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-4 tracking-tight leading-tight group-hover:text-brandRed transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-sm mb-8 line-clamp-3">
                          {blog.excerpt || blog.content.substring(0, 150).replace(/<[^>]*>?/gm, '') + "..."}
                        </p>
                        <div className="mt-auto pt-6 border-t border-secondary flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-primary group-hover:gap-2 flex items-center transition-all">
                            Read Story <ArrowRight size={14} className="ml-2" />
                          </span>
                          <Tag size={14} className="text-muted-foreground/30" />
                        </div>
                      </CardContent>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          
          {!loading && blogs.length === 0 && (
            <div className="text-center py-32 bg-secondary/20 rounded-[3rem] border-2 border-dashed border-secondary">
              <div className="bg-white/50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <Newspaper className="text-muted-foreground/20" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-4">No stories yet</h2>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">Our storytellers are busy capturing the moments. Check back soon for the latest updates from our campus.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="section-container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Stay <span className="text-brandRed">Connected</span></h2>
            <p className="text-xl text-primary-foreground/80 leading-relaxed font-medium">
              Join our community and get the latest news and event notifications delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 h-16 px-8 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:outline-none transition-all"
              />
              <Button size="lg" className="h-16 px-12 rounded-full bg-white text-primary hover:bg-secondary transition-all font-bold text-lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blogs;
