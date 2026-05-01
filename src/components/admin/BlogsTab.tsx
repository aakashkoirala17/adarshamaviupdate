import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Edit, Image as ImageIcon, Save, X } from "lucide-react";
import Dropzone from "react-dropzone";

export const BlogsTab = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    author_name: "",
    published_at: new Date().toISOString().split('T')[0],
    image_url: ""
  });

  const fetchBlogs = async () => {
    const { data } = await (supabase.from("blogs" as any) as any).select("*").order("published_at", { ascending: false });
    setBlogs(data || []);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blogs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('school-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('school-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      toast({ title: "Image uploaded" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        const { error } = await (supabase.from("blogs" as any) as any).update(formData).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Blog updated" });
      } else {
        const { error } = await (supabase.from("blogs" as any) as any).insert([formData]);
        if (error) throw error;
        toast({ title: "Blog published" });
      }
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        author_name: "",
        published_at: new Date().toISOString().split('T')[0],
        image_url: ""
      });
      fetchBlogs();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string, imageUrl: string | null) => {
    if (!confirm("Are you sure?")) return;
    try {
      const { error } = await (supabase.from("blogs" as any) as any).delete().eq("id", id);
      if (error) throw error;

      if (imageUrl) {
        const path = imageUrl.split('school-images/')[1];
        if (path) {
          await supabase.storage.from('school-images').remove([path]);
        }
      }

      toast({ title: "Blog deleted" });
      fetchBlogs();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  const startEdit = (blog: any) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || "",
      author_name: blog.author_name,
      published_at: blog.published_at,
      image_url: blog.image_url || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingId ? "Edit Blog Post" : "Create New Blog Post"}</h3>
              {editingId && (
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: "",
                    content: "",
                    excerpt: "",
                    author_name: "",
                    published_at: new Date().toISOString().split('T')[0],
                    image_url: ""
                  });
                }}><X className="mr-2 h-4 w-4" /> Cancel</Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>Blog Title</label>
                <Input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label>Author Name</label>
                <Input required value={formData.author_name} onChange={e => setFormData({ ...formData, author_name: e.target.value })} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>Publish Date</label>
                <Input type="date" required value={formData.published_at} onChange={e => setFormData({ ...formData, published_at: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label>Excerpt (Short Summary)</label>
                <Input value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label>Content</label>
              <Textarea required rows={10} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label>Featured Image</label>
              <div className="flex gap-4 items-start">
                <Dropzone onDrop={files => handleUpload(files[0])} multiple={false}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 flex-1">
                      <input {...getInputProps()} />
                      <ImageIcon className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-sm">Click or drag image to upload</p>
                    </div>
                  )}
                </Dropzone>
                {formData.image_url && (
                  <div className="w-32 h-32 rounded-lg overflow-hidden border">
                    <img src={formData.image_url} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : editingId ? "Update Blog Post" : "Publish Blog Post"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h3 className="text-xl font-bold">Manage Blogs</h3>
        {blogs.map(blog => (
          <Card key={blog.id}>
            <CardContent className="p-4 flex gap-4 items-center">
              {blog.image_url && (
                <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                  <img src={blog.image_url} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-bold">{blog.title}</h4>
                <p className="text-xs text-muted-foreground">By {blog.author_name} • {new Date(blog.published_at).toLocaleDateString()}</p>
                <p className="text-sm line-clamp-1 text-muted-foreground">{blog.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(blog)}><Edit className="h-4 w-4" /></Button>
                <Button variant="destructive" size="sm" onClick={() => deleteBlog(blog.id, blog.image_url)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
