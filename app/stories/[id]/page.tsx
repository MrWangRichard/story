'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import api from '@/lib/axios';
import '@/styles/prose.css';

interface Story {
  storyId: number;
  category: string;
  userSummaryDto: {
    userId: number | null;
    nickName: string;
    gender: string;
    headImg: string;
  };
  coverImg: string | null;
  title: string;
  summary: string;
  content: string;
}

export default function StoryDetail() {
  const [story, setStory] = useState<Story | null>(null);
  const params = useParams();
  const storyId = params.id;

  useEffect(() => {
    const fetchStoryDetail = async () => {
      try {
        const response = await api.post(`/story/detail?storyId=${storyId}`);
        
        if (response.data.errCode === '0') {
          setStory(response.data.data);
        } else {
          throw new Error(response.data.errMsg);
        }
      } catch (error) {
        console.error('Failed to fetch story detail:', error);
      }
    };

    if (storyId) {
      fetchStoryDetail();
    }
  }, [storyId]);

  if (!story) {
    return null; // 或者显示加载状态
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">{story.title}</h1>
          {story.coverImg && (
            <img
              src={story.coverImg}
              alt={story.title}
              className="w-full max-h-[400px] object-cover rounded-lg mb-8"
            />
          )}
          <div 
            className="prose dark:prose-invert" 
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        </article>
      </div>
    </div>
  );
} 