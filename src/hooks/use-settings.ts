import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  [key: string]: any;
};

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error: fetchError } = await (supabase
        .from("site_settings" as any) as any)
        .select("*");

      if (fetchError) throw fetchError;

      const settingsMap: SiteSettings = {};
      (data as any[]).forEach((item) => {
        settingsMap[item.key] = item.value;
      });

      return settingsMap;
    }
  });

  return { settings: settings || null, loading: isLoading, error, refresh: refetch };
};
