"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { privateRequest } from "@/lib/privateApi";
import type { Studio } from "@/types";

interface WishlistContextValue {
  has: (studioId: string) => boolean;
  toggle: (studioId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue>({
  has: () => false,
  toggle: async () => {},
});

export const useWishlist = () => useContext(WishlistContext);

export default function WishlistProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;
  const [state, setState] = useState<{ userId: string; ids: string[] } | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    privateRequest<Studio[]>("/wishlist")
      .then((list) => {
        if (!cancelled) setState({ userId, ids: list.map((s) => s._id) });
      })
      .catch(() => {
        /* wishlist is optional, ignore load errors */
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const ids = useMemo(
    () => (userId && state?.userId === userId ? state.ids : []),
    [userId, state],
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    async (id: string) => {
      if (!userId) {
        toast.error("Please log in to save studios.");
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      const saved = ids.includes(id);
      const next = saved ? ids.filter((x) => x !== id) : [id, ...ids];
      setState({ userId, ids: next });
      try {
        await privateRequest(`/wishlist/${id}`, { method: saved ? "DELETE" : "POST" });
        toast.success(saved ? "Removed from your wishlist." : "Saved to your wishlist.");
      } catch (e) {
        setState({ userId, ids });
        toast.error(e instanceof Error ? e.message : "Could not update your wishlist.");
      }
    },
    [userId, ids, router, pathname],
  );

  const value = useMemo(() => ({ has, toggle }), [has, toggle]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}