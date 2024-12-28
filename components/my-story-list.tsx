'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

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

export function MyStoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [storyToDelete, setStoryToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await api.post('/storyManage/selectOwnPage', {
        condition: {
          category: '1',
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

  const handleDelete = async (storyId: number) => {
    try {
      const response = await api.post(`/storyManage/remove?storyId=${storyId}`);

      if (response.data.errCode === '0') {
        toast({
          title: "删除成功",
          description: "故事已被删除",
        });
        // 重新获取列表
        fetchStories();
      } else {
        throw new Error(response.data.errMsg || '删除失败');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "删除失败",
        description: error.message || "请稍后重试",
      });
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  if (loading) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Link 
            key={story.storyId} 
            href={`/stories/${story.storyId}`}
            className="block h-full"
          >
            <Card className="hover:shadow-lg transition-shadow h-full">
              <div className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    {story.title}
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
                  <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={story.userSummaryDto?.headImg} />
                        <AvatarFallback>
                          {story.userSummaryDto?.nickName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {story.userSummaryDto?.nickName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {story.userSummaryDto?.gender}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setStoryToDelete(story.storyId);
                      }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <AlertDialog open={storyToDelete !== null} onOpenChange={() => setStoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个故事吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStoryToDelete(null)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (storyToDelete) {
                  handleDelete(storyToDelete);
                  setStoryToDelete(null);
                }
              }}
              className="bg-red-500 hover:bg-red-700"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 