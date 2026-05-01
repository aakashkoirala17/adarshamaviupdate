import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  [key: string]: any;
};

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await (supabase
        .from("site_settings" as any) as any)
        .select("*");

      if (fetchError) throw fetchError;

      const settingsMap: SiteSettings = {};
      (data as any[]).forEach((item) => {
        settingsMap[item.key] = item.value;
      });

      setSettings(settingsMap);
    } catch (err) {
      console.error("Error fetching site settings:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, error, refresh: fetchSettings };
};
