'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { saveDevelopmentRecord } from '@/app/actions/development-record';
import { toast } from '@/components/ui/use-toast';
import { CalendarIcon, Loader2, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ImageUpload } from './image-upload';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DevelopmentRecordFormProps {
  initialAgeGroup?: number;
}

export function DevelopmentRecordForm({
  initialAgeGroup,
}: DevelopmentRecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [ageGroup, setAgeGroup] = useState<string>(
    initialAgeGroup?.toString() || '',
  );
  const [developmentArea, setDevelopmentArea] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [recordType, setRecordType] = useState<string>('development');

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !ageGroup || !title || !description) {
      toast({
        title: '입력 오류',
        description: '필수 필드를 모두 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    // 발달 영역은 발달 기록 유형일 때만 필수
    if (recordType === 'development' && !developmentArea) {
      toast({
        title: '입력 오류',
        description: '발달 영역을 선택해주세요.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await saveDevelopmentRecord({
        date: date.toISOString(),
        ageGroup,
        developmentArea:
          recordType === 'development' ? developmentArea : recordType,
        title,
        description,
        images: images.length > 0 ? images : undefined,
        recordType,
      });

      toast({
        title: '기록이 저장되었습니다',
        description: '발달 기록 내역에서 확인할 수 있습니다.',
      });

      // 폼 초기화
      setTitle('');
      setDescription('');
      setImages([]);
    } catch (error) {
      console.error('Failed to save development record:', error);
      toast({
        title: '저장에 실패했습니다',
        description: '발달 기록을 저장하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ageGroups = [
    { id: '1', name: '0-6개월' },
    { id: '2', name: '7-12개월' },
    { id: '3', name: '1-2세' },
    { id: '4', name: '3-4세' },
    { id: '5', name: '5-6세' },
    { id: '6', name: '7세 이상' },
  ];

  const developmentAreas = [
    { id: 'physical', name: '신체 발달' },
    { id: 'cognitive', name: '인지 발달' },
    { id: 'language', name: '언어 발달' },
    { id: 'social', name: '사회성 발달' },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={recordType} onValueChange={setRecordType} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="development">발달 기록</TabsTrigger>
            <TabsTrigger value="milestone">발달 이정표</TabsTrigger>
            <TabsTrigger value="special-day">특별한 날</TabsTrigger>
            <TabsTrigger value="health">건강 기록</TabsTrigger>
            <TabsTrigger value="nutrition">영양 기록</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">날짜</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : '날짜 선택'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageGroup">연령 그룹</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="연령 그룹 선택" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {recordType === 'development' && (
            <div className="space-y-2">
              <Label htmlFor="developmentArea">발달 영역</Label>
              <Select
                value={developmentArea}
                onValueChange={setDevelopmentArea}
              >
                <SelectTrigger>
                  <SelectValue placeholder="발달 영역 선택" />
                </SelectTrigger>
                <SelectContent>
                  {developmentAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">내용</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="내용을 입력하세요"
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label>사진</Label>
            <ImageUpload
              images={images}
              onChange={handleImagesChange}
              maxImages={5}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              '저장하기'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
