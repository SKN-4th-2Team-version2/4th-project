'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import CommunityService from '@/services/community-service';
import type { Category, PostImage } from '@/types/community';
import { X, Upload } from 'lucide-react';

export default function NewStoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<PostImage[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // 카테고리 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await CommunityService.getCategories({ postType: 'story' });
        if (response.success) {
          setCategories(response.data);
          if (response.data.length > 0) {
            setCategoryId(response.data[0].id);
          }
        }
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
        toast({
          title: '카테고리 로드 실패',
          description: '카테고리를 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      }
    };

    loadCategories();
  }, []);

  // 이미지 파일 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast({
        title: '이미지 개수 초과',
        description: '최대 5개의 이미지만 첨부할 수 있습니다.',
        variant: 'destructive',
      });
      return;
    }

    const newImages = files.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      imageUrl: URL.createObjectURL(file),
      altText: file.name,
      order: images.length + index,
    }));

    setImages([...images, ...newImages]);
    setImageFiles([...imageFiles, ...files]);
  };

  // 이미지 제거
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  // 게시글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: '제목을 입력해주세요',
        variant: 'destructive',
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: '내용을 입력해주세요',
        variant: 'destructive',
      });
      return;
    }

    if (!categoryId) {
      toast({
        title: '카테고리를 선택해주세요',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 이미지 업로드
      const uploadedImages = await Promise.all(
        imageFiles.map(async (file, index) => {
          const formData = new FormData();
          formData.append('image', file);
          const response = await CommunityService.uploadImage(formData);
          return {
            imageUrl: response.data.url,
            altText: file.name,
            order: index,
          };
        })
      );

      const response = await CommunityService.createPost({
        post_type: 'story',
        category_id: categoryId,
        title,
        content,
        status: 'published',
        isAnonymous,
        images: uploadedImages,
      });

      if (response.success) {
        toast({
          title: '게시글이 작성되었습니다',
        });
        router.push('/community/stories');
      }
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      toast({
        title: '게시글 작성 실패',
        description: '게시글을 작성하는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">육아 이야기 작성</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="min-h-[300px]"
              maxLength={10000}
            />
          </div>

          <div className="space-y-2">
            <Label>이미지 첨부</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={image.id} className="relative aspect-square group">
                  <img
                    src={image.imageUrl}
                    alt={image.altText}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-6 w-6" />
                    <span className="text-sm">이미지 추가</span>
                  </div>
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              최대 5개의 이미지를 첨부할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous">익명으로 작성</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '작성 중...' : '작성하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
