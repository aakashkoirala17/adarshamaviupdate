import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import Linkify from "@/components/Linkify";

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data } = await (supabase.from("blogs" as any) as any)
        .select("*")
        .eq("id", id)
        .single();
      setBlog(data);
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center">Post not found.</div>;

  return (
    <Layout>
      <article className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/blogs">
            <Button variant="ghost" className="mb-8 group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Blogs
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-b pb-8">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-primary" />
                  <span>{blog.author_name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}>
                  <Share2 size={18} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {blog.image_url && (
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img src={blog.image_url} className="w-full h-full object-cover" alt={blog.title} />
              </div>
            )}

            <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
              <Linkify text={blog.content} />
            </div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
