'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CurrentUser {
  name: string;
  email: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        setIsLoading(false);
        return;
      }

      // Get profile data for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', authUser.id)
        .single();

      const displayName = profile?.first_name
        ? `${profile.first_name} ${profile.last_name || ''}`.trim()
        : authUser.email?.split('@')[0] || '';

      setUser({
        name: displayName,
        email: authUser.email || '',
      });
      setIsLoading(false);
    }

    fetchUser();
  }, []);

  return { user, isLoading };
}
