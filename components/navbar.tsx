'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfileDialog } from './user-profile-dialog';
import { StoryTabs } from './story-tabs';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              故事分享
            </Link>
            <StoryTabs />
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/stories/create">
                  <Button 
                    variant="outline"
                    className="transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    创建故事
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost"
                      className="transition-colors hover:bg-primary/10"
                    >
                      {user?.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
                      编辑资料
                    </DropdownMenuItem>
                    <Link href="/profile">
                      <DropdownMenuItem>
                        我的主页
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-red-600 focus:text-red-600"
                    >
                      退出登录
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <UserProfileDialog 
                  open={showProfileDialog} 
                  onOpenChange={setShowProfileDialog}
                />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">登录</Button>
                </Link>
                <Link href="/register">
                  <Button>注册</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 