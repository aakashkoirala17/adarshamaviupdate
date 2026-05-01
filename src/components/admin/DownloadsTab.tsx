import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, FileText, Upload, Save, X, Loader2, Plus, Pencil, FileDown } from "lucide-react";
import Dropzone from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const DownloadsTab = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      setIsDialogOpen(false);
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

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", file_url: "", category: "General", display_order: 0 });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description || "",
      file_url: item.file_url,
      category: item.category || "General",
      display_order: item.display_order
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-secondary shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-primary">Download Management</h2>
          <p className="text-sm text-muted-foreground">Upload and manage school documents, forms, and curriculum.</p>
        </div>
        <Button onClick={openAddDialog} className="rounded-full px-6 shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Add Document
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              {editingId ? "Edit Document" : "Add New Document"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary/40">Document Title</label>
                <Input 
                  required 
                  className="rounded-xl"
                  placeholder="e.g. Annual Calendar 2081"
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary/40">Category</label>
                <Input 
                  className="rounded-xl"
                  placeholder="e.g. Notices, Academic"
                  value={formData.category} 
                  onChange={e => setFormData({ ...formData, category: e.target.value })} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/40">Description</label>
              <Input 
                className="rounded-xl"
                placeholder="Brief description of the document..."
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary/40">File Attachment</label>
              <div className="flex gap-4 items-center">
                <Dropzone onDrop={files => handleFileUpload(files[0])} multiple={false}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="border-2 border-dashed border-secondary rounded-2xl p-8 text-center cursor-pointer hover:bg-secondary/50 hover:border-primary/20 transition-all flex-1">
                      <input {...getInputProps()} />
                      {loading ? (
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 mb-2 text-primary/40" />
                          <p className="text-sm font-bold text-primary/60">Click or drag file to upload</p>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">PDF, DOCX, XLSX, PNG, JPG</p>
                        </div>
                      )}
                    </div>
                  )}
                </Dropzone>
                {formData.file_url && (
                  <div className="flex flex-col items-center justify-center gap-2 bg-primary/5 p-6 rounded-2xl border border-primary/10 w-32 shrink-0">
                    <FileDown className="text-primary" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">File Ready</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-full px-6">Cancel</Button>
              <Button type="submit" className="rounded-full px-8 shadow-lg shadow-primary/20" disabled={loading || !formData.file_url}>
                {loading ? "Processing..." : editingId ? "Save Changes" : "Create Document"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {downloads.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-secondary">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground font-bold">No documents uploaded yet.</p>
          </div>
        ) : (
          downloads.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-3xl border border-secondary shadow-sm flex gap-6 items-center hover:shadow-md transition-all group">
              <div className="bg-secondary/50 p-4 rounded-2xl group-hover:bg-primary transition-all">
                <FileText className="text-primary group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-primary text-lg truncate">{item.title}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full">{item.category}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{item.description || "No description provided."}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-xl h-10 w-10" onClick={() => openEditDialog(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" className="rounded-xl h-10 w-10" onClick={() => deleteDownload(item.id, item.file_url)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
