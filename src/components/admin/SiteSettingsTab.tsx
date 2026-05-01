import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListEditor } from "./SettingsComponents";
import { Trash2, Plus, Save } from "lucide-react";

export const SiteSettingsTab = () => {
  const { settings, loading, refresh } = useSettings();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState<any>(null);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  if (loading || !localSettings) return <div className="p-8 text-center">Loading site settings...</div>;

  const handleUpdate = async (key: string, value: any) => {
    const { error } = await (supabase.from("site_settings" as any) as any).upsert({ key, value });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `${key} has been updated successfully.` });
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="general">General & Contact</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="academics">Academics</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label>School Name (English)</label>
                  <Input value={localSettings.general_info?.schoolName || ""} 
                    onChange={e => setLocalSettings({...localSettings, general_info: {...localSettings.general_info, schoolName: e.target.value}})} />
                </div>
                <div className="grid gap-2">
                  <label>School Name (Nepali)</label>
                  <Input className="font-nepali" value={localSettings.general_info?.schoolNameNepali || ""} 
                    onChange={e => setLocalSettings({...localSettings, general_info: {...localSettings.general_info, schoolNameNepali: e.target.value}})} />
                </div>
                <Button onClick={() => handleUpdate("general_info", localSettings.general_info)}><Save className="mr-2 h-4 w-4" /> Save General Info</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label>Phone</label>
                    <Input value={localSettings.contact_info?.phone || ""} 
                      onChange={e => setLocalSettings({...localSettings, contact_info: {...localSettings.contact_info, phone: e.target.value}})} />
                  </div>
                  <div className="grid gap-2">
                    <label>Email</label>
                    <Input value={localSettings.contact_info?.email || ""} 
                      onChange={e => setLocalSettings({...localSettings, contact_info: {...localSettings.contact_info, email: e.target.value}})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label>Address</label>
                  <Input value={localSettings.contact_info?.address || ""} 
                    onChange={e => setLocalSettings({...localSettings, contact_info: {...localSettings.contact_info, address: e.target.value}})} />
                </div>
                <div className="grid gap-2">
                  <label>Office Hours</label>
                  <Input value={localSettings.contact_info?.officeHours || ""} 
                    onChange={e => setLocalSettings({...localSettings, contact_info: {...localSettings.contact_info, officeHours: e.target.value}})} />
                </div>
                <div className="grid gap-2">
                  <label>Google Maps Embed Link (src)</label>
                  <Textarea value={localSettings.contact_info?.mapLink || ""} 
                    onChange={e => setLocalSettings({...localSettings, contact_info: {...localSettings.contact_info, mapLink: e.target.value}})} />
                </div>
                <Button onClick={() => handleUpdate("contact_info", localSettings.contact_info)}><Save className="mr-2 h-4 w-4" /> Save Contact Details</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="homepage">
          <div className="grid gap-6">
            <Card>
              <CardHeader><CardTitle>Principal Message</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label>Name</label>
                    <Input value={localSettings.principal_message?.name || ""} 
                      onChange={e => setLocalSettings({...localSettings, principal_message: {...localSettings.principal_message, name: e.target.value}})} />
                  </div>
                  <div className="grid gap-2">
                    <label>Title</label>
                    <Input value={localSettings.principal_message?.title || ""} 
                      onChange={e => setLocalSettings({...localSettings, principal_message: {...localSettings.principal_message, title: e.target.value}})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label>Message</label>
                  <Textarea rows={4} value={localSettings.principal_message?.message || ""} 
                    onChange={e => setLocalSettings({...localSettings, principal_message: {...localSettings.principal_message, message: e.target.value}})} />
                </div>
                <Button onClick={() => handleUpdate("principal_message", localSettings.principal_message)}><Save className="mr-2 h-4 w-4" /> Save Message</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Why Choose Us (Homepage)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {localSettings.homepage_content?.whyChooseUs.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Point {idx + 1}</span>
                      <Button variant="destructive" size="sm" onClick={() => {
                        const newList = [...localSettings.homepage_content.whyChooseUs];
                        newList.splice(idx, 1);
                        setLocalSettings({...localSettings, homepage_content: {...localSettings.homepage_content, whyChooseUs: newList}});
                      }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <Input placeholder="Title" value={item.title} onChange={e => {
                      const newList = [...localSettings.homepage_content.whyChooseUs];
                      newList[idx].title = e.target.value;
                      setLocalSettings({...localSettings, homepage_content: {...localSettings.homepage_content, whyChooseUs: newList}});
                    }} />
                    <Input placeholder="Description" value={item.desc} onChange={e => {
                      const newList = [...localSettings.homepage_content.whyChooseUs];
                      newList[idx].desc = e.target.value;
                      setLocalSettings({...localSettings, homepage_content: {...localSettings.homepage_content, whyChooseUs: newList}});
                    }} />
                  </div>
                ))}
                <Button variant="outline" onClick={() => {
                  const newList = [...localSettings.homepage_content.whyChooseUs, {title: "", desc: ""}];
                  setLocalSettings({...localSettings, homepage_content: {...localSettings.homepage_content, whyChooseUs: newList}});
                }}><Plus className="mr-2 h-4 w-4" /> Add Point</Button>
                <div className="pt-4">
                  <Button onClick={() => handleUpdate("homepage_content", localSettings.homepage_content)}><Save className="mr-2 h-4 w-4" /> Save Homepage Content</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="about">
          <div className="grid gap-6">
            <Card>
              <CardHeader><CardTitle>About Content</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="font-bold">History (One paragraph per line)</label>
                  <Textarea rows={6} value={localSettings.about_content?.history.join("\n\n") || ""} 
                    onChange={e => setLocalSettings({...localSettings, about_content: {...localSettings.about_content, history: e.target.value.split("\n\n").filter(p => p.trim())}})} />
                </div>
                
                <ListEditor label="Objectives" items={localSettings.about_content?.objectives || []} 
                  onChange={newItems => setLocalSettings({...localSettings, about_content: {...localSettings.about_content, objectives: newItems}})} />
                
                <ListEditor label="Facilities" items={localSettings.about_content?.facilities || []} 
                  onChange={newItems => setLocalSettings({...localSettings, about_content: {...localSettings.about_content, facilities: newItems}})} />

                <div className="pt-4">
                  <Button onClick={() => handleUpdate("about_content", localSettings.about_content)}><Save className="mr-2 h-4 w-4" /> Save About Page</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academics">
           <Card>
              <CardHeader><CardTitle>Academic Programs</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {localSettings.academics_programs?.map((program, pIdx) => (
                  <div key={pIdx} className="p-6 border-2 rounded-xl space-y-4 bg-muted/30">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">{program.title}</h3>
                      <Button variant="destructive" size="sm" onClick={() => {
                        const newList = [...localSettings.academics_programs];
                        newList.splice(pIdx, 1);
                        setLocalSettings({...localSettings, academics_programs: newList});
                      }}><Trash2 className="h-4 w-4" /> Remove Program</Button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-semibold">Title</label>
                        <Input value={program.title} onChange={e => {
                          const newList = [...localSettings.academics_programs];
                          newList[pIdx].title = e.target.value;
                          setLocalSettings({...localSettings, academics_programs: newList});
                        }} />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-semibold">Duration</label>
                        <Input value={program.duration} onChange={e => {
                          const newList = [...localSettings.academics_programs];
                          newList[pIdx].duration = e.target.value;
                          setLocalSettings({...localSettings, academics_programs: newList});
                        }} />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-semibold">Description</label>
                      <Textarea value={program.description} onChange={e => {
                        const newList = [...localSettings.academics_programs];
                        newList[pIdx].description = e.target.value;
                        setLocalSettings({...localSettings, academics_programs: newList});
                      }} />
                    </div>

                    {program.subjects && (
                      <ListEditor label="Core Subjects" items={program.subjects} onChange={newSubs => {
                        const newList = [...localSettings.academics_programs];
                        newList[pIdx].subjects = newSubs;
                        setLocalSettings({...localSettings, academics_programs: newList});
                      }} />
                    )}

                    {program.substreams && (
                      <div className="space-y-3">
                        <label className="font-bold">Sub-streams</label>
                        {program.substreams.map((sub, sIdx) => (
                          <div key={sIdx} className="p-3 border rounded bg-background space-y-2">
                            <Input placeholder="Stream Name" value={sub.name} onChange={e => {
                              const newList = [...localSettings.academics_programs];
                              newList[pIdx].substreams[sIdx].name = e.target.value;
                              setLocalSettings({...localSettings, academics_programs: newList});
                            }} />
                            <Textarea placeholder="Description" value={sub.description} onChange={e => {
                              const newList = [...localSettings.academics_programs];
                              newList[pIdx].substreams[sIdx].description = e.target.value;
                              setLocalSettings({...localSettings, academics_programs: newList});
                            }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={() => {
                  const newProgram = { id: Date.now().toString(), title: "New Program", description: "", duration: "", certification: "", subjects: [] };
                  setLocalSettings({...localSettings, academics_programs: [...localSettings.academics_programs, newProgram]});
                }}><Plus className="mr-2 h-4 w-4" /> Add New Program</Button>
                <div className="pt-4">
                  <Button onClick={() => handleUpdate("academics_programs", localSettings.academics_programs)}><Save className="mr-2 h-4 w-4" /> Save Academics Programs</Button>
                </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
