'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { StoryCardSkeleton } from '@/components/story-card-skeleton';
import Link from 'next/link';
import api from '@/lib/axios';

interface Story {
  storyId: number;
  category: string;
  title: string;
  summary: string;
  content: string;
  coverImg: string | null;
  userSummaryDto: {
    userId: string;
    nickName: string;
    gender: string;
    headImg: string;
  };
}

export default function MyStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await api.post('/storyManage/selectOwnPage', {
        condition: {
          category: '',
          title: ''
        },
        pageNum: 1,
        pageSize: 10
      });

      if (response.data.errCode === '0') {
        setStories(response.data.data.list);
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">我的故事</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <StoryCardSkeleton />
                </Card>
              ))}
            </>
          ) : stories.map((story) => (
            <Link 
              key={story.storyId} 
              href={`/stories/${story.storyId}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-bold">{story.title}</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 