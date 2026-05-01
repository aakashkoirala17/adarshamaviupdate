import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Downloads = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchDownloads = async () => {
      const { data } = await (supabase.from("downloads" as any) as any)
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      setDownloads(data || []);
      setLoading(false);
    };
    fetchDownloads();
  }, []);

  const categories = ["All", ...Array.from(new Set(downloads.map(d => d.category || "General")))];

  const filteredDownloads = downloads.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="bg-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Downloads</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-nepali">
            शैक्षिक सामग्री, फारमहरू र अन्य आवश्यक कागजातहरू यहाँबाट डाउनलोड गर्नुहोस्।
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                className="pl-10" 
                placeholder="Search documents..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <Filter size={18} className="text-muted-foreground flex-shrink-0" />
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading documents...</div>
          ) : (
            <div className="grid gap-4">
              {filteredDownloads.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="bg-primary/10 p-4 rounded-xl">
                        <FileText className="text-primary" size={28} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-primary truncate">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                        <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full mt-1 inline-block">
                          {item.category || "General"}
                        </span>
                      </div>
                      <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                        <Button className="flex items-center gap-2 group">
                          <Download size={18} className="group-hover:translate-y-1 transition-transform" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {filteredDownloads.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed rounded-xl">
                  <p className="text-muted-foreground">No documents found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Downloads;
