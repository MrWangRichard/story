'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import api from '@/lib/axios';
import { marked } from 'marked';
import '@/styles/prose.css';

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

export default function StoryDetail() {
  const [story, setStory] = useState<Story | null>(null);
  const params = useParams();
  const storyId = params.id;

  useEffect(() => {
    const fetchStoryDetail = async () => {
      try {
        const response = await api.post(`/story/detail?storyId=${storyId}`);
        
        if (response.data.errCode === '0') {
          const htmlContent = marked(response.data.data.content, {
            mangle: false,
            headerIds: false,
          });
          
          setStory({
            ...response.data.data,
            content: htmlContent,
          });
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
    return null;
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