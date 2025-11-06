import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Upload, Trash2, Plus, Edit } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for all content types
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Check if user is admin
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      const hasAdminRole = roles?.some(r => r.role === 'admin');
      setIsAdmin(hasAdminRole || false);

      if (!hasAdminRole) {
        toast({
          title: "Access denied",
          description: "You need admin privileges to access this page.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setLoading(false);
      fetchAllData();
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const fetchAllData = async () => {
    const [heroRes, teamRes, galleryRes, noticesRes] = await Promise.all([
      supabase.from('hero_images').select('*').order('display_order'),
      supabase.from('team_members').select('*').order('display_order'),
      supabase.from('gallery_images').select('*').order('display_order'),
      supabase.from('notices').select('*').order('display_order'),
    ]);

    if (heroRes.data) setHeroImages(heroRes.data);
    if (teamRes.data) setTeamMembers(teamRes.data);
    if (galleryRes.data) setGalleryImages(galleryRes.data);
    if (noticesRes.data) setNotices(noticesRes.data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'gallery' | 'team') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('school-images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('school-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const addHeroImage = async (imageUrl: string, altText: string = '') => {
    const { error } = await supabase.from('hero_images').insert({
      image_url: imageUrl,
      alt_text: altText,
      display_order: heroImages.length,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Hero image added!" });
      fetchAllData();
    }
  };

  const deleteItem = async (table: string, id: string) => {
    const { error } = await (supabase as any).from(table).delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Item deleted!" });
      fetchAllData();
    }
  };

  const addNotice = async (title: string, date: string, content: string) => {
    const { error } = await supabase.from('notices').insert({
      title,
      date,
      content,
      display_order: notices.length,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Notice added!" });
      fetchAllData();
    }
  };

  const updateNotice = async (id: string, title: string, date: string, content: string) => {
    const { error } = await supabase.from('notices').update({
      title,
      date,
      content,
    }).eq('id', id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Notice updated!" });
      fetchAllData();
    }
  };

  const addTeamMember = async (name: string, nameNepali: string, position: string, positionNepali: string, imageUrl: string) => {
    const { error } = await supabase.from('team_members').insert({
      name,
      name_nepali: nameNepali,
      position,
      position_nepali: positionNepali,
      image_url: imageUrl,
      display_order: teamMembers.length,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Team member added!" });
      fetchAllData();
    }
  };

  const addGalleryImage = async (imageUrl: string, caption: string, captionNepali: string, category: string) => {
    const { error } = await supabase.from('gallery_images').insert({
      image_url: imageUrl,
      caption,
      caption_nepali: captionNepali,
      category,
      display_order: galleryImages.length,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Gallery image added!" });
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
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
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
            <HeroImagesTab images={heroImages} onAdd={addHeroImage} onDelete={deleteItem} onUpload={handleImageUpload} />
          </TabsContent>

          <TabsContent value="team">
            <TeamMembersTab members={teamMembers} onAdd={addTeamMember} onDelete={deleteItem} onUpload={handleImageUpload} />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryTab images={galleryImages} onAdd={addGalleryImage} onDelete={deleteItem} onUpload={handleImageUpload} />
          </TabsContent>

          <TabsContent value="notices">
            <NoticesTab notices={notices} onAdd={addNotice} onUpdate={updateNotice} onDelete={deleteItem} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Component for Hero Images Tab
const HeroImagesTab = ({ images, onAdd, onDelete, onUpload }: any) => {
  const [altText, setAltText] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url: string | undefined = await onUpload(e, 'hero');
    if (url) setUploadedUrl(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Hero Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Upload Image</label>
            <Input type="file" accept="image/*" onChange={handleUpload} />
          </div>
          {uploadedUrl && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Alt Text</label>
                <Input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="School building" />
              </div>
              <Button onClick={() => { onAdd(uploadedUrl, altText); setUploadedUrl(''); setAltText(''); }}>
                <Plus className="mr-2 h-4 w-4" /> Add Hero Image
              </Button>
            </>
          )}
        </div>

        <div className="grid gap-4 mt-8">
          {images.map((img: any) => (
            <div key={img.id} className="flex items-center gap-4 p-4 border rounded">
              <img src={img.image_url} alt={img.alt_text} className="w-32 h-20 object-cover rounded" />
              <div className="flex-1">
                <p className="font-medium">{img.alt_text}</p>
                <p className="text-sm text-muted-foreground">Order: {img.display_order}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => onDelete('hero_images', img.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for Team Members Tab
const TeamMembersTab = ({ members, onAdd, onDelete, onUpload }: any) => {
  const [form, setForm] = useState({ name: '', nameNepali: '', position: '', positionNepali: '', imageUrl: '' });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url: string | undefined = await onUpload(e, 'team');
    if (url) setForm({ ...form, imageUrl: url });
  };

  const handleSubmit = () => {
    onAdd(form.name, form.nameNepali, form.position, form.positionNepali, form.imageUrl);
    setForm({ name: '', nameNepali: '', position: '', positionNepali: '', imageUrl: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Team Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Input placeholder="Name (English)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="नाम (नेपाली)" value={form.nameNepali} onChange={(e) => setForm({ ...form, nameNepali: e.target.value })} className="font-nepali" />
          <Input placeholder="Position (English)" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <Input placeholder="पद (नेपाली)" value={form.positionNepali} onChange={(e) => setForm({ ...form, positionNepali: e.target.value })} className="font-nepali" />
          <Input type="file" accept="image/*" onChange={handleUpload} />
          <Button onClick={handleSubmit} disabled={!form.name || !form.position}>
            <Plus className="mr-2 h-4 w-4" /> Add Team Member
          </Button>
        </div>

        <div className="grid gap-4 mt-8">
          {members.map((member: any) => (
            <div key={member.id} className="flex items-center gap-4 p-4 border rounded">
              {member.image_url && <img src={member.image_url} alt={member.name} className="w-16 h-16 object-cover rounded-full" />}
              <div className="flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm font-nepali text-muted-foreground">{member.name_nepali}</p>
                <p className="text-sm text-muted-foreground">{member.position}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => onDelete('team_members', member.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for Gallery Tab
const GalleryTab = ({ images, onAdd, onDelete, onUpload }: any) => {
  const [form, setForm] = useState({ caption: '', captionNepali: '', category: 'events', imageUrl: '' });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url: string | undefined = await onUpload(e, 'gallery');
    if (url) setForm({ ...form, imageUrl: url });
  };

  const handleSubmit = () => {
    onAdd(form.imageUrl, form.caption, form.captionNepali, form.category);
    setForm({ caption: '', captionNepali: '', category: 'events', imageUrl: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Gallery Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Input type="file" accept="image/*" onChange={handleUpload} />
          <Input placeholder="Caption (English)" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
          <Input placeholder="शीर्षक (नेपाली)" value={form.captionNepali} onChange={(e) => setForm({ ...form, captionNepali: e.target.value })} className="font-nepali" />
          <Input placeholder="Category (e.g., events, facilities, academic)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Button onClick={handleSubmit} disabled={!form.imageUrl}>
            <Plus className="mr-2 h-4 w-4" /> Add Gallery Image
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {images.map((img: any) => (
            <div key={img.id} className="relative group">
              <img src={img.image_url} alt={img.caption} className="w-full h-48 object-cover rounded" />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="sm" onClick={() => onDelete('gallery_images', img.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm mt-2">{img.caption}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for Notices Tab
const NoticesTab = ({ notices, onAdd, onUpdate, onDelete }: any) => {
  const [form, setForm] = useState({ id: '', title: '', date: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    if (isEditing) {
      onUpdate(form.id, form.title, form.date, form.content);
      setIsEditing(false);
    } else {
      onAdd(form.title, form.date, form.content);
    }
    setForm({ id: '', title: '', date: '', content: '' });
  };

  const handleEdit = (notice: any) => {
    setForm({ 
      id: notice.id, 
      title: notice.title, 
      date: notice.date, 
      content: notice.content || '' 
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm({ id: '', title: '', date: '', content: '' });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Notice' : 'Add New Notice'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Notice Title</label>
            <Input 
              placeholder="Enter notice title" 
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notice Date</label>
            <Input 
              type="date" 
              value={form.date} 
              onChange={(e) => setForm({ ...form, date: e.target.value })} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notice Body</label>
            <Textarea 
              placeholder="Enter the full notice body/content here..." 
              value={form.content} 
              onChange={(e) => setForm({ ...form, content: e.target.value })} 
              rows={8}
              className="resize-y"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={!form.title || !form.date} className="flex-1">
              {isEditing ? (
                <>
                  <Edit className="mr-2 h-4 w-4" /> Update Notice
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Add Notice
                </>
              )}
            </Button>
            {isEditing && (
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 mt-8">
          {notices.map((notice: any) => (
            <div key={notice.id} className="flex items-center gap-4 p-4 border rounded">
              <div className="flex-1">
                <p className="font-medium">{notice.title}</p>
                <p className="text-sm text-muted-foreground">{notice.date}</p>
                {notice.content && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notice.content}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(notice)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete('notices', notice.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;