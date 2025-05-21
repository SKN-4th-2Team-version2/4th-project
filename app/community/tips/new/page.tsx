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

export default function NewTipPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">육아 팁 작성하기</h1>
        <p className="text-muted-foreground">
          다른 부모님들에게 도움이 될 육아 팁을 공유해주세요.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>새 육아 팁</CardTitle>
          <CardDescription>
            실제로 효과를 본 육아 팁이나 노하우를 구체적으로 작성해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" placeholder="팁의 제목을 입력하세요" />
            <p className="text-xs text-muted-foreground">
              명확하고 구체적인 제목이 더 많은 관심을 받습니다.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="communication">의사소통</SelectItem>
                <SelectItem value="sleep">수면</SelectItem>
                <SelectItem value="nutrition">식이</SelectItem>
                <SelectItem value="relationship">관계</SelectItem>
                <SelectItem value="behavior">행동</SelectItem>
                <SelectItem value="play">놀이</SelectItem>
                <SelectItem value="etc">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">적용 연령대</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="연령대 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 연령</SelectItem>
                <SelectItem value="newborn">신생아 (0-3개월)</SelectItem>
                <SelectItem value="infant">영아기 (4-12개월)</SelectItem>
                <SelectItem value="toddler">걸음마기 (1-2세)</SelectItem>
                <SelectItem value="preschool">유아기 (3-5세)</SelectItem>
                <SelectItem value="school">학령기 (6세 이상)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">팁 내용</Label>
            <Textarea
              id="content"
              placeholder="팁 내용을 자세히 작성해주세요"
              rows={15}
            />
            <p className="text-xs text-muted-foreground">
              구체적인 방법, 효과, 주의사항 등을 포함하면 더 유용한 정보가
              됩니다. 마크다운 문법을 사용하여 글을 구조화할 수 있습니다. (##
              제목, * 목록 등)
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
              관련 키워드를 태그로 추가하면 다른 부모님들이 팁을 찾기
              쉬워집니다.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" asChild>
            <Link href="/community/tips">취소</Link>
          </Button>
          <Button>팁 등록하기</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
