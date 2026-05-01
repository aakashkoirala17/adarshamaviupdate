import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
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
      <section className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">School Blogs & Stories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest happenings, academic articles, and success stories from Adarsha Secondary School.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center">Loading blogs...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, idx) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow border-primary/10">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {blog.image_url ? (
                        <img src={blog.image_url} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" alt={blog.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground opacity-20" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(blog.published_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {blog.author_name}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2">{blog.title}</h3>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1">
                        {blog.excerpt || blog.content.substring(0, 150) + "..."}
                      </p>
                      <Link to={`/blogs/${blog.id}`}>
                        <Button variant="outline" className="w-full group">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {!loading && blogs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No blogs published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.587-1.587a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default Blogs;
