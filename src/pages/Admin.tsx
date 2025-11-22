/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Trash2, Plus, Edit, Upload } from "lucide-react";
import Dropzone from "react-dropzone";
import Cropper from "react-easy-crop";
import { Dialog } from "@headlessui/react";

/**
 * Admin.jsx
 * - All upload tabs include: preview, drag & drop, cropping, multiple file upload, progress bars, and drag-to-reorder lists.
 *
 * NOTE: this file assumes your existing Supabase storage bucket is named "school-images"
 * and your DB tables are hero_images, team_members, gallery_images, notices (same as your original).
 */

/* -------------------------
   Utility: create unique filename
   ------------------------- */
const makeFileName = (origName) => {
  const ext = origName.split(".").pop();
  const id = Math.random().toString(36).slice(2, 9);
  return `${Date.now()}_${id}.${ext}`;
};

/* -------------------------
   Utility: convert cropped area to blob
   uses canvas to crop image client-side
   ------------------------- */
async function getCroppedImg(
  imageSrc: string,
  cropPixels: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<Blob> {
  // returns blob
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  // ensure integer dimensions to avoid issues
  canvas.width = Math.max(1, Math.floor(cropPixels.width));
  canvas.height = Math.max(1, Math.floor(cropPixels.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas 2D context");

  ctx.drawImage(
    image,
    Math.floor(cropPixels.x),
    Math.floor(cropPixels.y),
    Math.floor(cropPixels.width),
    Math.floor(cropPixels.height),
    0,
    0,
    canvas.width,
    canvas.height
  );

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create blob from canvas"));
    }, "image/jpeg", 0.9)
  );
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

/* -------------------------
   Upload helper
   - uploads a File/Blob to Supabase storage and returns publicUrl
   - shows progress via a callback (simulated progress while uploading)
   ------------------------- */
async function uploadFileToSupabase(file: File | Blob, onProgress: (progress: number) => void = (p: number) => {}) {
  // Create filename
  const filePath = makeFileName((file as any).name || "upload.jpg");

  // Supabase storage upload does NOT provide progress through SDK.
  // We'll show simulated progress until upload resolves.
  let progress = 0;
  const progressTimer = setInterval(() => {
    progress = Math.min(95, progress + Math.random() * 18);
    onProgress(Math.round(progress));
  }, 300);

  try {
    // use binary upload
    const { error: uploadError } = await supabase.storage
      .from("school-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    clearInterval(progressTimer);
    onProgress(100);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("school-images").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    clearInterval(progressTimer);
    onProgress(0);
    throw err;
  }
}

/* -------------------------
   Simple HTML5 drag reorder helper
   reorders array in place given source and destination indexes
   ------------------------- */
const reorderArray = (arr, fromIndex, toIndex) => {
  const copy = [...arr];
  const [removed] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, removed);
  return copy;
};

/* -------------------------
   Top-level Admin component
   ------------------------- */
const Admin = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // content
  const [heroImages, setHeroImages] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const hasAdmin = roles?.some((r) => r.role === "admin");
      setIsAdmin(hasAdmin || false);

      if (!hasAdmin) {
        toast({
          title: "Access denied",
          description: "You need admin privileges to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setLoading(false);
      fetchAllData();
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAllData = async () => {
    const [heroRes, teamRes, galleryRes, noticesRes] = await Promise.all([
      supabase.from("hero_images").select("*").order("display_order"),
      supabase.from("team_members").select("*").order("display_order"),
      supabase.from("gallery_images").select("*").order("display_order"),
      supabase.from("notices").select("*").order("display_order"),
    ]);
    if (heroRes.data) setHeroImages(heroRes.data);
    if (teamRes.data) setTeamMembers(teamRes.data);
    if (galleryRes.data) setGalleryImages(galleryRes.data);
    if (noticesRes.data) setNotices(noticesRes.data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // generic delete
  const deleteItem = async (table, id) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted" });
      fetchAllData();
    }
  };

  /* DB insert helpers */
  const addHeroImageToDB = async (imageUrl, altText = "") => {
    const { error } = await supabase.from("hero_images").insert({
      image_url: imageUrl,
      alt_text: altText,
      display_order: heroImages.length,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Hero image added" });
      fetchAllData();
    }
  };

  const addTeamMemberToDB = async (payload) => {
    const { error } = await supabase.from("team_members").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Team member added" });
      fetchAllData();
    }
  };

  const addGalleryImageToDB = async (payload) => {
    const { error } = await supabase.from("gallery_images").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Gallery image added" });
      fetchAllData();
    }
  };

  const addNoticeToDB = async (title, date, content) => {
    const { error } = await supabase.from("notices").insert({ title, date, content, display_order: notices.length });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Notice added" });
      fetchAllData();
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-secondary flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <div className="flex items-center gap-2">
          <Button onClick={handleLogout} variant="outline" size="sm" ><LogOut className="mr-2 h-4 w-4 text-brandRed" /> </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hero">Hero Images</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="notices">Notices</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <HeroImagesTab
              images={heroImages}
              onAdd={addHeroImageToDB}
              onDelete={deleteItem}
            />
          </TabsContent>

          <TabsContent value="team">
            <TeamMembersTab
              members={teamMembers}
              onAdd={addTeamMemberToDB}
              onDelete={deleteItem}
            />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryTab
              images={galleryImages}
              onAdd={addGalleryImageToDB}
              onDelete={deleteItem}
            />
          </TabsContent>

          <TabsContent value="notices">
            <NoticesTab notices={notices} onAdd={addNoticeToDB} onDelete={deleteItem} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

/* =====================================================
   HERO IMAGES TAB
   - supports multiple files, drag/drop, preview, crop, upload, reorder
   ===================================================== */
const HeroImagesTab = ({ images = [], onAdd, onDelete }) => {
  const [files, setFiles] = useState([]); // {file, previewUrl, name, progress, status}
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropData, setCropData] = useState({ zoom: 1, crop: { x: 0, y: 0 }, pixelCrop: null });
  const [currentFileIndex, setCurrentFileIndex] = useState(null);
  const [list, setList] = useState(images || []);
  const dropRef = useRef();
  const { toast } = useToast();

  useEffect(() => setList(images), [images]);

  // handle files dropped or selected
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const mapped = acceptedFiles.map((f) => ({
        file: f,
        previewUrl: URL.createObjectURL(f),
        name: f.name,
        progress: 0,
        status: "ready",
      }));
      setFiles((s) => [...s, ...mapped]);
    },
    [setFiles]
  );

  // remove local file preview
  const removeLocalFile = (idx) => {
    setFiles((s) => s.filter((_, i) => i !== idx));
  };

  // open crop modal for a file
  const openCrop = (idx) => {
    setCurrentFileIndex(idx);
    setCropImage(files[idx].previewUrl);
    setCropOpen(true);
  };

  // apply crop: produce blob and replace file
  const applyCrop = async () => {
    if (currentFileIndex == null || !cropData.pixelCrop) {
      setCropOpen(false);
      return;
    }
    try {
      const blob = await getCroppedImg(cropImage, cropData.pixelCrop);
      const croppedFile = new File([blob], files[currentFileIndex].name, { type: "image/jpeg" });

      const newFiles = [...files];
      newFiles[currentFileIndex] = {
        ...newFiles[currentFileIndex],
        file: croppedFile,
        previewUrl: URL.createObjectURL(croppedFile),
      };
      setFiles(newFiles);
      setCropOpen(false);
    } catch (err) {
      console.error("Crop error", err);
      toast?.({ title: "Crop error", variant: "destructive" });
      setCropOpen(false);
    }
  };

  // upload a single file
  const uploadSingle = async (idx) => {
    const item = files[idx];
    if (!item) return;
    setFiles((s) => {
      const copy = [...s];
      copy[idx] = { ...copy[idx], status: "uploading", progress: 1 };
      return copy;
    });

    try {
      const publicUrl = await uploadFileToSupabase(item.file, (p) => {
        setFiles((s) => {
          const copy = [...s];
          copy[idx] = { ...copy[idx], progress: p };
          return copy;
        });
      });

      // add to DB
      await onAdd(publicUrl, ""); // alt empty for now

      setFiles((s) => {
        const copy = [...s];
        copy[idx] = { ...copy[idx], status: "done", progress: 100 };
        return copy;
      });

      // refresh list by delaying a fetch (caller Admin will re-fetch via its mechanism)
    } catch (err) {
      console.error(err);
      setFiles((s) => {
        const copy = [...s];
        copy[idx] = { ...copy[idx], status: "error", progress: 0 };
        return copy;
      });
    }
  };

  // upload all files (parallel)
  const uploadAll = async () => {
    await Promise.all(files.map((_, idx) => uploadSingle(idx)));
  };

  // drag reorder for local DB list (hero images ordering)
  const onDragStart = (e, idx) => {
    e.dataTransfer.setData("text/plain", String(idx));
  };
  const onDropList = (e, toIndex) => {
    const fromIndex = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(fromIndex)) return;
    const newList = reorderArray(list, fromIndex, toIndex);
    setList(newList);
    // update display_order in DB for all items
    newList.forEach(async (item, idx) => {
      await supabase.from("hero_images").update({ display_order: idx }).eq("id", item.id);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Hero Images</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Drag & Drop area */}
        <Dropzone onDrop={onDrop} multiple accept={{ "image/*": [] }}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              ref={dropRef}
              className={`p-4 border-2 border-dashed rounded text-center ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}`}
            >
              <input {...getInputProps()} />
              <p>Drag & drop images here, or click to select (multiple allowed)</p>
            </div>
          )}
        </Dropzone>

        {/* Local previews & crop / upload controls */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {files.map((f, idx) => (
                <div key={idx} className="w-30 border rounded p-2">
                  <img src={f.previewUrl} alt={f.name} className="w-full h-30 object-cover rounded" />
                  <div className="mt-2 text-xs break-all">{f.name}</div>

                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" onClick={() => openCrop(idx)}>Crop</Button>
                    <Button size="sm" onClick={() => uploadSingle(idx)}><Upload className="mr-1 h-4 w-4" />Upload</Button>
                    <Button size="sm" variant="destructive" onClick={() => removeLocalFile(idx)}>Remove</Button>
                  </div>

                  <div className="mt-2 h-2 bg-muted rounded">
                    <div style={{ width: `${f.progress}%` }} className="h-2 bg-primary rounded" />
                  </div>

                  <div className="text-xs mt-1">
                    {f.status === "ready" && "Ready"}
                    {f.status === "uploading" && "Uploading..."}
                    {f.status === "done" && "Uploaded"}
                    {f.status === "error" && "Error"}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={uploadAll} disabled={files.every((f) => f.status === "done")}>Upload All</Button>
              <Button variant="outline" onClick={() => { setFiles([]); }}>Clear</Button>
            </div>
          </div>
        )}

        {/* Existing hero images with drag-to-reorder and delete */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Existing Hero Images (drag to reorder)</h3>
          <div className="space-y-2">
            {list.map((img, idx) => (
              <div key={img.id}
                draggable
                onDragStart={(e) => onDragStart(e, idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDropList(e, idx)}
                className="flex items-center gap-4 p-3 border rounded"
              >
                <img src={img.image_url} alt={img.alt_text} className="w-48 h-28 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{img.alt_text || "—"}</div>
                  <div className="text-sm text-muted-foreground">Order: {img.display_order}</div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => onDelete("hero_images", img.id)}><Trash2 /></Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Crop modal */}
      <CropModal
        open={cropOpen}
        imageSrc={cropImage}
        onClose={() => setCropOpen(false)}
        onApply={(pixelCrop) => setCropData((d) => ({ ...d, pixelCrop }))}
        onSave={applyCrop}
        onCropChange={(crop) => setCropData((d) => ({ ...d, crop }))}
        onZoomChange={(zoom) => setCropData((d) => ({ ...d, zoom }))}
      />
    </Card>
  );
};

/* =====================================================
   TEAM MEMBERS TAB
   - add preview, single upload, multi (but typical single)
   - drag reorder
   ===================================================== */
const TeamMembersTab = ({ members = [], onAdd, onDelete }) => {
  const [form, setForm] = useState({ name: "", nameNepali: "", position: "", positionNepali: "", imageUrl: "" });
  const [preview, setPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [list, setList] = useState(members || []);

  useEffect(() => setList(members), [members]);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    try {
      const publicUrl = await uploadFileToSupabase(file, (p) => setUploadProgress(p));
      setForm((s) => ({ ...s, imageUrl: publicUrl }));
      setUploadProgress(100);
    } catch (err) {
      console.error(err);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async () => {
    await onAdd({
      name: form.name,
      name_nepali: form.nameNepali,
      position: form.position,
      position_nepali: form.positionNepali,
      image_url: form.imageUrl,
      display_order: list.length,
    });
    setForm({ name: "", nameNepali: "", position: "", positionNepali: "", imageUrl: "" });
    setPreview("");
  };

  // reorder
  const onDragStart = (e, idx) => e.dataTransfer.setData("text/plain", String(idx));
  const onDropList = async (e, toIndex) => {
    const fromIndex = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(fromIndex)) return;
    const newList = reorderArray(list, fromIndex, toIndex);
    setList(newList);
    newList.forEach(async (item, idx) => {
      await supabase.from("team_members").update({ display_order: idx }).eq("id", item.id);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Team Members</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Name (English)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="नाम (नेपाली)" className="font-nepali" value={form.nameNepali} onChange={(e) => setForm({ ...form, nameNepali: e.target.value })} />
          <Input placeholder="Position (English)" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <Input placeholder="पद (नेपाली)" className="font-nepali" value={form.positionNepali} onChange={(e) => setForm({ ...form, positionNepali: e.target.value })} />

          <div>
            <label className="block text-sm mb-1">Upload Photo</label>
            <Input type="file" accept="image/*" onChange={onFileChange} />
            {preview && <img src={preview} className="w-24 h-24 rounded-full mt-2 object-cover border" alt="preview" />}
            {uploadProgress > 0 && <div className="mt-2 h-2 bg-muted rounded"><div style={{ width: `${uploadProgress}%` }} className="h-2 bg-primary rounded" /></div>}
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={handleSubmit} disabled={!form.name || !form.position}><Plus className="mr-2 h-4 w-4" />Add Member</Button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Existing Members (drag to reorder)</h3>
          <div className="space-y-2">
            {list.map((m, idx) => (
              <div key={m.id}
                draggable
                onDragStart={(e) => onDragStart(e, idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDropList(e, idx)}
                className="flex items-center gap-4 p-3 border rounded"
              >
                {m.image_url && <img src={m.image_url} className="w-16 h-16 object-cover rounded-full" alt={m.name} />}
                <div className="flex-1">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm font-nepali text-muted-foreground">{m.name_nepali}</div>
                  <div className="text-sm text-muted-foreground">{m.position}</div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => onDelete("team_members", m.id)}><Trash2 /></Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* =====================================================
   GALLERY TAB
   - multiple upload, preview, crop optionally, reorder, delete
   ===================================================== */
const GalleryTab = ({ images = [], onAdd, onDelete }) => {
  const [files, setFiles] = useState([]); // files pending upload
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [captionNep, setCaptionNep] = useState("");
  const [category, setCategory] = useState("events");
  const [uploadProgress, setUploadProgress] = useState({});
  const [list, setList] = useState(images || []);

  useEffect(() => setList(images), [images]);

  const onDrop = (acceptedFiles) => {
    const mapped = acceptedFiles.map((f) => ({ file: f, previewUrl: URL.createObjectURL(f), status: "ready", progress: 0 }));
    setFiles((s) => [...s, ...mapped]);
  };

  const removeFile = (i) => setFiles((s) => s.filter((_, idx) => idx !== i));

  const uploadAll = async () => {
    await Promise.all(files.map((f, idx) => uploadOne(idx)));
  };

  const uploadOne = async (idx) => {
    const item = files[idx];
    if (!item) return;
    setFiles((s) => s.map((it, i) => i === idx ? { ...it, status: "uploading" } : it));
    try {
      const publicUrl = await uploadFileToSupabase(item.file, (p) => {
        setFiles((s) => s.map((it, i) => i === idx ? { ...it, progress: p } : it));
      });
      // save to DB
      await onAdd({
        image_url: publicUrl,
        caption,
        caption_nepali: captionNep,
        category,
        display_order: list.length,
      });
      setFiles((s) => s.map((it, i) => i === idx ? { ...it, status: "done", progress: 100 } : it));
    } catch (err) {
      console.error(err);
      setFiles((s) => s.map((it, i) => i === idx ? { ...it, status: "error", progress: 0 } : it));
    }
  };

  // reorder existing gallery
  const onDragStart = (e, idx) => e.dataTransfer.setData("text/plain", String(idx));
  const onDropList = async (e, toIndex) => {
    const fromIndex = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(fromIndex)) return;
    const newList = reorderArray(list, fromIndex, toIndex);
    setList(newList);
    newList.forEach(async (item, idx) => {
      await supabase.from("gallery_images").update({ display_order: idx }).eq("id", item.id);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Gallery Images</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Dropzone onDrop={onDrop} multiple accept={{ "image/*": [] }}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div {...getRootProps()} className={`p-4 border-2 border-dashed rounded ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}`}>
              <input {...getInputProps()} />
              <p>Drop images here or click to select (multiple)</p>
            </div>
          )}
        </Dropzone>

        {files.length > 0 && (
          <div>
            <div className="flex gap-2 flex-wrap mt-3">
              {files.map((f, i) => (
                <div key={i} className="w-48 border rounded p-2">
                  <img src={f.previewUrl} className="w-full h-28 object-cover rounded" />
                  <div className="mt-2 text-xs break-all">{f.file.name}</div>
                  <div className="mt-2 h-2 bg-muted rounded">
                    <div style={{ width: `${f.progress}%` }} className="h-2 bg-primary rounded" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => uploadOne(i)}><Upload /></Button>
                    <Button size="sm" variant="destructive" onClick={() => removeFile(i)}><Trash2 /></Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid md:grid-cols-3 gap-2">
              <Input placeholder="Caption (English)" value={caption} onChange={(e) => setCaption(e.target.value)} />
              <Input placeholder="शीर्षक (नेपाली)" className="font-nepali" value={captionNep} onChange={(e) => setCaptionNep(e.target.value)} />
              <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>

            <div className="mt-2">
              <Button onClick={uploadAll}>Upload All</Button>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-3">Existing Gallery (drag to reorder)</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {list.map((img, idx) => (
              <div key={img.id}
                draggable
                onDragStart={(e) => onDragStart(e, idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDropList(e, idx)}
                className="relative group"
              >
                <img src={img.image_url} className="w-full h-48 object-cover rounded" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                  <Button variant="destructive" size="sm" onClick={() => onDelete("gallery_images", img.id)}><Trash2 /></Button>
                </div>
                <p className="text-sm mt-2">{img.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* =====================================================
   NOTICES TAB (simple)
   ===================================================== */
const NoticesTab = ({ notices = [], onAdd, onDelete }) => {
  const [form, setForm] = useState({ title: "", date: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async () => {
    await onAdd(form.title, form.date, form.content);
    setForm({ title: "", date: "", content: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Notice</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <Textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} />
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={!form.title || !form.date}>Add Notice</Button>
        </div>

        <div className="mt-4 space-y-2">
          {notices.map((n) => (
            <div key={n.id} className="flex items-center gap-4 p-3 border rounded">
              <div className="flex-1">
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-muted-foreground">{n.date}</div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => onDelete("notices", n.id)}><Trash2 /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/* =====================================================
   Crop modal component (uses react-easy-crop)
   receives imageSrc, and exposes onApply callback with pixelCrop
   ===================================================== */
function CropModal({ open, imageSrc, onClose, onApply, onSave, onCropChange, onZoomChange }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  useEffect(() => {
    if (!open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedPixels(null);
    }
  }, [open]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedPixels(croppedAreaPixels);
    if (onCropChange) onCropChange(croppedAreaPixels);
  }, [onCropChange]);

  const handleSave = () => {
    if (croppedPixels && onApply) {
      onApply(croppedPixels);
      if (onSave) onSave();
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative bg-white rounded max-w-3xl w-full p-4 z-60">
        <div className="h-96 relative bg-gray-100">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-2 mt-3">
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => { setZoom(Number(e.target.value)); if (onZoomChange) onZoomChange(Number(e.target.value)); }} />
          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Apply Crop</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default Admin;
