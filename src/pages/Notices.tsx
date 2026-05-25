import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, FileText, FileImage, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatNepaliDate } from '@/lib/utils';
import Linkify from '@/components/Linkify';


const Notices = () => {
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const { data: notices = [] } = useQuery({
    queryKey: ['noticesList'],
    queryFn: async () => {
      const { data } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: false });
      return (data as any[]) || [];
    }
  });

  return (
    <Layout>
      <div className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bell className="text-primary" size={36} />
              <h1 className="text-4xl font-bold text-primary ">Notices & Announcements</h1>
            </div>
            <p className="text-lg font-nepali  text-brandRed">सूचनाहरू</p>
          </div>

          <div className="space-y-6">
            {notices.map((notice) => (
              <Card 
                key={notice.id} 
                className="hover:shadow-lg transition-shadow border-l-4 border-primary cursor-pointer group"
                onClick={() => setSelectedNotice(notice)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-sm font-bold text-brandRed">
                          <Calendar size={14} className="mr-1.5" />
                          {formatNepaliDate(notice.date)}
                        </div>
                        {notice.attachment_url && (
                          <div className="bg-primary/5 text-primary p-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                            {notice.attachment_type === 'pdf' ? (
                              <><FileText size={14} /> PDF</>
                            ) : (
                              <><FileImage size={14} /> Image</>
                            )}
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-brandRed transition-colors">
                        <Linkify text={notice.title} />
                      </h3>
                      {notice.content && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          <Linkify text={notice.content} />
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 gap-0 rounded-3xl border-none shadow-2xl flex flex-col">
          <div className="bg-primary p-6 md:p-10 text-white">
            <DialogHeader>
              <div className="flex items-center gap-2 text-primary-foreground/70 mb-2">
                <Bell size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {selectedNotice && formatNepaliDate(selectedNotice.date)}
                </span>
              </div>
              <DialogTitle className="text-2xl md:text-4xl font-bold text-white leading-tight">
                <Linkify text={selectedNotice?.title || ''} />
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="p-6 md:p-10 overflow-y-auto bg-white flex-1">
            {selectedNotice?.content && (
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap mb-8">
                <Linkify text={selectedNotice.content} />
              </p>
            )}

            {selectedNotice?.attachment_url && (
              <div className="mt-8 pt-8 border-t border-secondary">
                {selectedNotice.attachment_type === 'image' ? (
                  <div className="rounded-2xl overflow-hidden border border-secondary shadow-xl">
                    <img src={selectedNotice.attachment_url} className="w-full h-auto" alt="Notice Attachment" />
                  </div>
                ) : (
                  <a 
                    href={selectedNotice.attachment_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full rounded-2xl flex items-center justify-center gap-3 font-bold h-16 shadow-lg hover:shadow-primary/20 transition-all text-lg">
                      <FileText size={24} /> Open PDF Document <ExternalLink size={20} />
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="p-6 bg-secondary/30 border-t border-secondary flex justify-end">
            <Button onClick={() => setSelectedNotice(null)} className="rounded-full px-8 font-bold">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Notices;
