import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, Calendar, ExternalLink, FileText, FileImage } from 'lucide-react';
import NepaliDate from 'nepali-date-converter';
import Linkify from '@/components/Linkify';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NoticePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [latestNotice, setLatestNotice] = useState<any>(null);

  useEffect(() => {
    const checkNotice = async () => {
      try {
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .eq('is_active', true)
          .order('date', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching notice:', error);
          }
          return;
        }

        if (data) {
          const lastSeenId = localStorage.getItem('last_seen_notice_id');
          if (lastSeenId !== data.id.toString()) {
            setLatestNotice(data);
            setIsOpen(true);
          }
        }
      } catch (err) {
        console.error('Unexpected error checking notices:', err);
      }
    };

    // Small delay to ensure the page is loaded and doesn't feel too intrusive
    const timer = setTimeout(checkNotice, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (latestNotice) {
      localStorage.setItem('last_seen_notice_id', latestNotice.id.toString());
    }
    setIsOpen(false);
  };

  if (!latestNotice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] border-t-4 border-primary p-0 gap-0 overflow-hidden rounded-3xl flex flex-col">
        <div className="bg-primary p-6 text-white shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-2 text-white/70 mb-2">
              <div className="p-1.5 bg-white/10 rounded-full">
                <Bell size={16} className="animate-bounce" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">New Notice Published</span>
            </div>
            <DialogTitle className="text-xl md:text-2xl font-black leading-tight text-white">
              <Linkify text={latestNotice.title} />
            </DialogTitle>
            <div className="flex items-center text-xs text-white/80 font-bold mt-2">
              <Calendar size={12} className="mr-1.5" />
              {new NepaliDate(new Date(latestNotice.date)).format("DD MMMM YYYY", "np")}
            </div>
          </DialogHeader>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="bg-secondary/30 p-4 rounded-2xl mb-6">
            <div className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">
              <Linkify text={latestNotice.content || ''} />
            </div>
          </div>

          {latestNotice.attachment_url && (
            <div className="mb-6">
              {latestNotice.attachment_type === 'image' ? (
                <div className="rounded-2xl overflow-hidden border-2 border-secondary shadow-md">
                  <img src={latestNotice.attachment_url} className="w-full h-auto" alt="Notice Attachment" />
                </div>
              ) : (
                <a 
                  href={latestNotice.attachment_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="block"
                >
                  <Button className="w-full rounded-2xl font-bold h-14 shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-3">
                    <FileText size={20} /> Open PDF Document <ExternalLink size={16} />
                  </Button>
                </a>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-full"
              asChild
              onClick={handleClose}
            >
              <Link to="/notices">
                View All Notices
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 font-bold h-12 rounded-full border-2"
              onClick={handleClose}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoticePopup;
