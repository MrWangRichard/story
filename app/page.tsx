'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Navbar } from '@/components/navbar';
import { StoryTabs } from '@/components/story-tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';

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

interface StoryResponse {
  pageSize: number;
  pageNum: number;
  totalSize: number;
  list: Story[];
}

function StoryCardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-3 w-[60px]" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '1';

  const fetchStories = async (category: string) => {
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

  useEffect(() => {
    fetchStories(category);
  }, [category]);

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <StoryCardSkeleton />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : stories.map((story) => (
            <Link 
              key={story.storyId} 
              href={{
                pathname: `/stories/${story.storyId}`,
              }}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-bold">{story.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                    <div className="flex items-center gap-2">
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
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
