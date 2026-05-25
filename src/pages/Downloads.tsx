import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search, Filter, ArrowRight, FileDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Downloads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: downloads = [], isLoading: loading } = useQuery({
    queryKey: ['downloadsList'],
    queryFn: async () => {
      const { data } = await (supabase.from("downloads" as any) as any)
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      return data || [];
    }
  });

  const categories = ["All", ...Array.from(new Set(downloads.map(d => d.category || "General")))] as string[];

  const filteredDownloads = downloads.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight uppercase">Document <span className="text-brandRed">Center</span></h1>
            <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto font-medium mb-4">
              Access and download essential academic materials, forms, and official documents from our repository.
            </p>
            <p className="text-lg font-nepali text-white/60 font-bold uppercase tracking-widest">शैक्षिक सामग्री र कागजातहरू</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white relative z-20 -mt-12">
        <div className="section-container">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-primary/5 mb-16">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                <Input 
                  className="pl-14 h-16 rounded-2xl border-secondary bg-secondary/20 focus:bg-white transition-all text-lg font-medium" 
                  placeholder="Search documents by title..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 scrollbar-hide">
                <div className="flex items-center gap-2 mr-4 text-primary/40">
                  <Filter size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Filter:</span>
                </div>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-8 h-12 font-bold uppercase tracking-widest text-xs transition-all ${
                      selectedCategory === cat ? "shadow-lg shadow-primary/20" : "border-secondary text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Accessing Database...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredDownloads.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="premium-card p-6 flex flex-col sm:flex-row items-center gap-8 group hover:border-primary/20 bg-white">
                    <div className="flex-shrink-0 bg-secondary/50 p-6 rounded-3xl group-hover:bg-primary transition-all duration-500">
                      <FileText className="text-primary group-hover:text-white transition-colors" size={40} />
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-brandRed text-white px-3 py-1 rounded-full">
                          {item.category || "General"}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-secondary text-primary/60 px-3 py-1 rounded-full">
                          PDF Document
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-primary mb-2 tracking-tight group-hover:text-brandRed transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description || "Official school document available for public download."}
                      </p>
                    </div>
                    <div className="w-full sm:w-auto">
                      <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full sm:w-auto h-16 rounded-2xl px-10 flex items-center gap-3 shadow-lg shadow-primary/10 group/btn">
                          <FileDown size={24} className="group-hover/btn:-translate-y-1 transition-transform" />
                          <span className="font-bold text-lg">Download</span>
                        </Button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {filteredDownloads.length === 0 && (
                <div className="text-center py-32 bg-secondary/20 rounded-[2.5rem] border-2 border-dashed border-secondary">
                  <div className="bg-white/50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-muted-foreground/30" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">No documents found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">We couldn't find any documents matching your search term. Try checking a different category.</p>
                  <Button 
                    variant="link" 
                    className="mt-4 text-primary font-bold uppercase tracking-widest text-xs"
                    onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-secondary/10 border-t border-secondary">
        <div className="section-container">
          <div className="bg-[#0f172a] text-white p-12 md:p-16 rounded-[3rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Can't find what you're looking for?</h2>
              <p className="text-white/60 text-lg leading-relaxed">If there's a specific form or document missing, please contact the administration office directly.</p>
            </div>
            <div className="relative z-10">
              <a href="/contact">
                <Button className="h-16 px-12 rounded-2xl text-lg font-bold bg-white text-primary hover:bg-secondary transition-all">
                  Contact Office
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Downloads;
