import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, FileText, Upload, Save, X, Loader2 } from "lucide-react";
import Dropzone from "react-dropzone";

export const DownloadsTab = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
    category: "General",
    display_order: 0
  });

  const fetchDownloads = async () => {
    const { data } = await (supabase.from("downloads" as any) as any)
      .select("*")
      .order("display_order", { ascending: true });
    setDownloads(data || []);
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `downloads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('school-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('school-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, file_url: publicUrl });
      toast({ title: "File uploaded successfully" });
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
        const { error } = await (supabase.from("downloads" as any) as any).update(formData).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Download updated" });
      } else {
        const { error } = await (supabase.from("downloads" as any) as any).insert([formData]);
        if (error) throw error;
        toast({ title: "Download added" });
      }
      setEditingId(null);
      setFormData({ title: "", description: "", file_url: "", category: "General", display_order: 0 });
      fetchDownloads();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const deleteDownload = async (id: string, fileUrl: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const { error } = await (supabase.from("downloads" as any) as any).delete().eq("id", id);
      if (error) throw error;

      const path = fileUrl.split('school-images/')[1];
      if (path) {
        await supabase.storage.from('school-images').remove([path]);
      }

      toast({ title: "Download removed" });
      fetchDownloads();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{editingId ? "Edit Download" : "Add New Download"}</h3>
              {editingId && (
                <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}><X className="mr-2 h-4 w-4" /> Cancel</Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>Document Title</label>
                <Input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label>Category</label>
                <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label>Description</label>
              <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label>File</label>
              <div className="flex gap-4 items-center">
                <Dropzone onDrop={files => handleFileUpload(files[0])} multiple={false}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/50 flex-1">
                      <input {...getInputProps()} />
                      {loading ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : <Upload className="mx-auto h-6 w-6 mb-1 text-muted-foreground" />}
                      <p className="text-xs">Click or drag file to upload (PDF, Doc, etc.)</p>
                    </div>
                  )}
                </Dropzone>
                {formData.file_url && (
                  <div className="flex items-center gap-2 bg-secondary p-3 rounded-lg border">
                    <FileText className="text-primary" />
                    <span className="text-xs truncate max-w-[200px]">File Ready</span>
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !formData.file_url}>
              {loading ? "Processing..." : editingId ? "Update Download" : "Add Download"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h3 className="text-xl font-bold">Manage Downloads</h3>
        {downloads.map(item => (
          <Card key={item.id}>
            <CardContent className="p-4 flex gap-4 items-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.category} • {item.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingId(item.id);
                  setFormData({
                    title: item.title,
                    description: item.description || "",
                    file_url: item.file_url,
                    category: item.category || "General",
                    display_order: item.display_order
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => deleteDownload(item.id, item.file_url)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
