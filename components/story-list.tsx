'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 将之前的接口定义移到这里
interface UserSummary {
  userId: number | null;
  nickName: string;
  gender: string;
  headImg: string;
}

interface Story {
  storyId: number;
  category: string;
  userSummaryDto: UserSummary;
  coverImg: string | null;
  title: string;
  summary: string;
  content: string;
}

export function StoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '1';

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await api.post('/story/selectPage', {
          condition: {
            category,
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

    fetchStories();
  }, [category]);

  if (loading) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <Link 
          key={story.storyId} 
          href={{
            pathname: `/stories/${story.storyId}`,
          }}
          className="block h-full"
        >
          <Card className="hover:shadow-lg transition-shadow h-full">
            <div className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-bold">{story.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 space-y-4">
                  {story.coverImg && (
                    <img
                      src={story.coverImg}
                      alt={story.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )}
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {story.summary}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Avatar>
                    <AvatarImage src={story.userSummaryDto.headImg} />
                    <AvatarFallback>
                      {story.userSummaryDto.nickName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {story.userSummaryDto.nickName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {story.userSummaryDto.gender}
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
} 