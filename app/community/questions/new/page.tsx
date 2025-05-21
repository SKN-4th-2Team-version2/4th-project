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

export default function NewQuestionPage() {
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
        <h1 className="text-3xl font-bold mb-2">질문 작성하기</h1>
        <p className="text-muted-foreground">
          다른 부모님들에게 질문하고 육아의 부담을 함께 나누세요.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>새 질문</CardTitle>
          <CardDescription>
            구체적인 질문을 작성하면 더 정확한 답변을 받아 육아 부담을 덜 수
            있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" placeholder="질문의 제목을 입력하세요" />
            <p className="text-xs text-muted-foreground">
              명확하고 구체적인 제목이 더 많은 답변을 받는데 도움이 됩니다.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="development">발달</SelectItem>
                <SelectItem value="nutrition">식이</SelectItem>
                <SelectItem value="sleep">수면</SelectItem>
                <SelectItem value="behavior">행동</SelectItem>
                <SelectItem value="education">교육</SelectItem>
                <SelectItem value="health">건강</SelectItem>
                <SelectItem value="etc">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">자녀 연령대</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="연령대 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newborn">신생아 (0-3개월)</SelectItem>
                <SelectItem value="infant">영아기 (4-12개월)</SelectItem>
                <SelectItem value="toddler">걸음마기 (1-2세)</SelectItem>
                <SelectItem value="preschool">유아기 (3-5세)</SelectItem>
                <SelectItem value="school">학령기 (6세 이상)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">질문 내용</Label>
            <Textarea
              id="content"
              placeholder="질문 내용을 자세히 작성해주세요"
              rows={10}
            />
            <p className="text-xs text-muted-foreground">
              상황, 시도해본 방법, 구체적인 고민 등을 포함하면 더 도움이 됩니다.
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
              관련 키워드를 태그로 추가하면 비슷한 고민을 가진 부모님들이 질문을
              찾기 쉬워집니다.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" asChild>
            <Link href="/community/questions">취소</Link>
          </Button>
          <Button>질문 등록하기</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
