'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileSchema = z.object({
  phoneNum: z.string().min(11, '请输入正确的手机号'),
  userName: z.string().min(2, '用户名至少2个字符'),
  nickName: z.string().min(2, '昵称至少2个字符'),
  gender: z.string(),
  summary: z.string().optional(),
  headImg: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNum: user?.phoneNum || '',
      userName: user?.username || '',
      nickName: user?.username || '',
      gender: user?.gender || '男',
      summary: '',
      headImg: user?.headImg || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/update', data);
      
      if (response.data.errCode === '0') {
        // 更新本地用户信息
        const token = localStorage.getItem('token') || '';
        login(token, {
          ...user!,
          username: data.nickName,
          phoneNum: data.phoneNum,
          gender: data.gender,
          headImg: data.headImg || '',
        });

        toast({
          title: '更新成功',
          description: '个人信息已更新',
        });
        
        onOpenChange(false);
      } else {
        throw new Error(response.data.errMsg);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '更新失败',
        description: error.message || '请检查输入信息',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑个人信息</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phoneNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>手机号</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入手机号" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>昵称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入昵称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>性别</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择性别" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="男">男</SelectItem>
                      <SelectItem value="女">女</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>个人简介</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入个人简介（选填）" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 