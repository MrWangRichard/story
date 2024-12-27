'use client';

import { useEffect, useState } from 'react';
import { ChevronUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BottomToolbarProps {
  wordCount: number;
  editTime: string;
  onPreview: () => void;
  onPublish: () => Promise<void>;
  scrollToSettings: () => void;
  scrollToTop: () => void;
}

export function BottomToolbar({ 
  wordCount, 
  editTime,
  onPreview, 
  onPublish, 
  scrollToSettings,
  scrollToTop,
}: BottomToolbarProps) {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom = 
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setIsAtBottom(scrolledToBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePublish = async () => {
    try {
      setPublishing(true);
      await onPublish();
      setShowDialog(false);  // 无论成功失败都关闭对话框
    } catch (error) {
      // 错误处理已经在 onPublish 中完成
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={isAtBottom ? scrollToTop : scrollToSettings}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className={`w-4 h-4 transition-transform ${isAtBottom ? 'rotate-0' : 'rotate-180'}`} />
                {isAtBottom ? '回到顶部' : '发布设置'}
              </button>
              <div className="text-sm text-muted-foreground">
                字数：{wordCount}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {editTime}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onPreview}>
                预览
              </Button>
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button>发布</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>确认发布</DialogTitle>
                    <DialogDescription>
                      发布后的文章将对所有用户可见，确定要发布吗？
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDialog(false)}
                    >
                      取消
                    </Button>
                    <Button 
                      onClick={handlePublish}
                      disabled={publishing}
                    >
                      {publishing ? '发布中...' : '确认发布'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 