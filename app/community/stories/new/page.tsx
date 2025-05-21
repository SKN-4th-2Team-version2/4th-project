'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export default function NewStoryPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">육아 이야기 작성하기</h1>
        <p className="text-muted-foreground">
          다른 부모님들과 육아 경험을 공유해보세요.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>새 이야기</CardTitle>
          <CardDescription>
            육아 과정에서 경험한 특별한 순간, 고민, 성장 이야기를 공유해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" placeholder="이야기의 제목을 입력하세요" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">일상공유</SelectItem>
                <SelectItem value="growth">성장일기</SelectItem>
                <SelectItem value="travel">여행</SelectItem>
                <SelectItem value="education">교육</SelectItem>
                <SelectItem value="dad">아빠육아</SelectItem>
                <SelectItem value="mom">엄마육아</SelectItem>
                <SelectItem value="etc">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">대표 이미지</Label>
            <div className="flex items-center gap-4">
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {thumbnailPreview && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setThumbnailPreview(null)}
                >
                  삭제
                </Button>
              )}
            </div>
            {thumbnailPreview && (
              <div className="mt-2 aspect-video w-full max-w-md overflow-hidden rounded-md border">
                <img
                  src={thumbnailPreview || '/placeholder.svg'}
                  alt="썸네일 미리보기"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              이야기를 대표하는 이미지를 업로드해주세요. (선택사항)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              placeholder="이야기 내용을 작성해주세요"
              rows={15}
            />
            <p className="text-xs text-muted-foreground">
              경험, 감정, 배운 점 등을 자유롭게 공유해주세요.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">태그</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <Input
              id="tags"
              placeholder="태그를 입력하고 Enter를 누르세요 (최대 5개)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              disabled={tags.length >= 5}
            />
            <p className="text-xs text-muted-foreground">
              관련 키워드를 태그로 추가하면 다른 부모님들이 이야기를 찾기
              쉬워집니다.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" asChild>
            <Link href="/community/stories">취소</Link>
          </Button>
          <Button>이야기 등록하기</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
