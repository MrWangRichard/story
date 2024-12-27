'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Editor } from '@/components/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import TurndownService from 'turndown';

export default function CreateStory() {
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [content, setContent] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
  });

  const handlePreview = (content: { title: string; content: string; coverUrl?: string }) => {
    setContent(content.content);
    setEditorContent(content.content);
    setIsPreview(true);
  };

  const handlePublish = async (content: { title: string; content: string; coverUrl?: string }) => {
    try {
      setLoading(true);
      // 将 HTML 转换为 Markdown
      const markdownContent = turndownService.turndown(content.content);
      
      const response = await api.post('/storyManage/add', {
        title: content.title,
        content: markdownContent,  // 发送 Markdown 格式的内容
        coverImg: content.coverUrl || '',
        category: '1',
        summary: content.content.slice(0, 200).replace(/<[^>]+>/g, ''),  // 移除 HTML 标签
      });
      
      if (response.data.errCode === '0' && response.data.data === true) {
        toast({
          title: '发布成功',
          description: '故事已成功发布',
        });
        router.push('/my/stories');
      } else {
        throw new Error(response.data.errMsg || '发布失败');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '发布失败',
        description: error.message || '请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <article className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>
            {coverUrl && (
              <img
                src={coverUrl}
                alt={title}
                className="w-full max-h-[400px] object-cover rounded-lg mb-8"
              />
            )}
            <div 
              className="prose dark:prose-invert" 
              dangerouslySetInnerHTML={{ __html: content }}
            />
            <div className="flex justify-center mt-8">
              <Button onClick={() => setIsPreview(false)}>
                返回编辑
              </Button>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <Input
            type="text"
            placeholder="请输入标题（最多100个字）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold border-none focus-visible:ring-0 px-0"
            maxLength={100}
          />
          <Editor 
            title={title}
            onCoverChange={setCoverUrl}
            coverUrl={coverUrl}
            onPreview={handlePreview}
            onPublish={handlePublish}
            initialContent={editorContent}
          />
        </div>
      </div>
    </div>
  );
} 