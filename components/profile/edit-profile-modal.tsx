'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import apiClient from '@/services/api-client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import UserService from '@/services/user-service';

const formSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(100, '이름은 100자를 초과할 수 없습니다'),
});

type FormValues = z.infer<typeof formSchema>;

interface EditProfileModalProps {
  currentName: string;
  onSuccess?: () => void;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    profile_image: string;
    auth_provider: string;
    created_at: string;
    updated_at: string;
  };
}

export function EditProfileModal({
  currentName,
  onSuccess,
}: EditProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const updatedProfile = await UserService.updateProfile({
        name: data.name,
      });

      // NextAuth 세션 업데이트
      const updatedUser = {
        ...session?.user,
        name: updatedProfile.data.name,
        image: updatedProfile.data.profile_image,
        email: updatedProfile.data.email,
        auth_provider: updatedProfile.data.auth_provider,
      };

      // 세션 업데이트
      await updateSession({
        ...session,
        user: updatedUser,
      });

      // API 클라이언트의 세션 캐시 업데이트
      const client = apiClient as any;
      if (client.sessionCache) {
        client.sessionCache.user = updatedUser;
        client.sessionCache.lastUpdated = Date.now();
      }

      toast.success('프로필이 업데이트되었습니다');
      setOpen(false);
      onSuccess?.();

      // 페이지 갱신
      router.refresh();
    } catch (error) {
      toast.error('프로필 업데이트에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          닉네임 변경
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>닉네임 변경</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>닉네임</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="새로운 닉네임을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '변경 중...' : '변경하기'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
