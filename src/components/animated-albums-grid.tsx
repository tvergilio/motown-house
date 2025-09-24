'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import AlbumCard from './album-card';
import type { Album } from '@/lib/definitions';

interface AnimatedAlbumsGridProps {
  albums: Album[];
  showSuccessAnimation?: boolean;
}

export default function AnimatedAlbumsGrid({ albums, showSuccessAnimation }: AnimatedAlbumsGridProps) {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show success toast and clean up URL
  useEffect(() => {
    if (showSuccessAnimation) {
      toast({
        title: "🎵 Album Added!",
        description: "Your vinyl has been added to the collection.",
        duration: 4000,
      });

      // Clean up the URL after showing the toast
      const params = new URLSearchParams(searchParams);
      params.delete('success');
      const newUrl = params.toString() ? `?${params.toString()}` : '/';
      router.replace(newUrl, { scroll: false });
    }
  }, [showSuccessAnimation, toast, router, searchParams]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {albums.map((album, index) => (
        <motion.div
          key={album.id}
          initial={showSuccessAnimation && index === 0 ? {
            rotate: 0,
            scale: 1,
            y: 0
          } : { opacity: 0, y: 20 }}
          animate={showSuccessAnimation && index === 0 ? {
            rotate: [0, 360, 360],
            scale: [1, 1.1, 1],
            y: [0, -10, 0]
          } : { opacity: 1, y: 0 }}
          transition={
            showSuccessAnimation && index === 0
              ? {
                  duration: 1.2,
                  times: [0, 0.6, 1],
                  ease: [0.25, 0.46, 0.45, 0.94]
                }
              : {
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: 'easeOut'
                }
          }
        >
          <AlbumCard album={album} />
        </motion.div>
      ))}
    </div>
  );
}