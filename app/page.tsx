'use client';

import { Suspense } from 'react';
import { StoryList } from '@/components/story-list';
import { Navbar } from '@/components/navbar';
import { Card, CardContent } from '@/components/ui/card';
import { StoryCardSkeleton } from '@/components/story-card-skeleton';

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <StoryCardSkeleton />
                </CardContent>
              </Card>
            ))}
          </div>
        }>
          <StoryList />
        </Suspense>
      </div>
    </main>
  );
}
