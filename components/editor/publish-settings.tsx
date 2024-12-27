'use client';

import { forwardRef } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PublishSettingsProps {
  onCoverChange: (coverUrl: string) => void;
  coverUrl?: string;
}

export const PublishSettings = forwardRef<HTMLDivElement, PublishSettingsProps>(
  ({ onCoverChange, coverUrl }, ref) => {
    const handleImageUpload = () => {
      const url = window.prompt('输入封面图片URL');
      if (url) {
        onCoverChange(url);
      }
    };

    return (
      <div ref={ref} className="border-t">
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">发布设置</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">添加封面</p>
              {coverUrl ? (
                <div className="relative group">
                  <img
                    src={coverUrl}
                    alt="封面"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleImageUpload}
                    >
                      更换封面
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleImageUpload}
                  className={cn(
                    "w-full h-48 rounded-lg border-2 border-dashed",
                    "flex flex-col items-center justify-center gap-2",
                    "text-muted-foreground hover:text-foreground",
                    "hover:border-primary transition-colors"
                  )}
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-sm">添加文章封面</span>
                  <span className="text-xs text-muted-foreground">
                    图片上传格式支持 JPEG、JPG、PNG
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PublishSettings.displayName = 'PublishSettings'; 