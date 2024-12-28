'use client';

import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { MyStoryList } from '@/components/my-story-list';
import { Card, CardContent } from '@/components/ui/card';
import { StoryCardSkeleton } from '@/components/story-card-skeleton';

export default function MyStories() {
  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">我的故事</h1>
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
          <MyStoryList />
        </Suspense>
      </div>
    </main>
  );
} 