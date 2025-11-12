import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import NepaliDate from 'nepali-date-converter';


const Notices = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      const { data } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: false });
      if (data) setNotices(data);
    };

    fetchNotices();
  }, []);

  return (
    <Layout>
      <div className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bell className="text-primary" size={36} />
              <h1 className="text-4xl font-bold text-primary">Notices & Announcements</h1>
            </div>
            <p className="text-lg font-nepali text-primary">सूचनाहरू</p>
          </div>

          <div className="space-y-6">
            {notices.map((notice) => (
              <Card 
                key={notice.id} 
                className="hover:shadow-lg transition-shadow border-l-4 border-primary cursor-pointer"
                onClick={() => setSelectedNotice(notice)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar size={14} className="mr-1" />
                          {new NepaliDate(new Date(notice.date)).format("DD MMMM YYYY", "np")}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-2">{notice.title}</h3>
                      {notice.content && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{notice.content}</p>
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">{selectedNotice?.title}</DialogTitle>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Calendar size={14} className="mr-1" />
              {selectedNotice && new Date(selectedNotice.date).toLocaleDateString()}
            </div>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedNotice?.content && (
              <p className="text-foreground whitespace-pre-wrap">{selectedNotice.content}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Notices;
