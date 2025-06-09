'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import CommunityService from '@/services/community-service';
import type { Category, CreatePostRequest } from '@/types/community';
import { X, Upload, ImagePlus, Loader2, ChevronRight } from 'lucide-react';

export default function NewQuestionPage() {
  const router = useRouter();
  const { isAuthenticated, requireAuth } = useAuth();
  
  // 인증 체크
  requireAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    content: '',
    isAnonymous: false,
    status: 'published' as const
  });
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 카테고리 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await CommunityService.getCategories({ postType: 'question' });
        if (response.success) {
          setCategories(response.data);
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

  // 폼 데이터 변경 핸들러
  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // 카테고리 선택 핸들러
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId: value
    }));
    
    if (errors.categoryId) {
      setErrors(prev => ({
        ...prev,
        categoryId: ''
      }));
    }
  };

  // 태그 추가
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      const newTag = tagInput.trim();
      
      if (!tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput('');
      } else if (tags.length >= 5) {
        toast({
          title: '태그는 최대 5개까지 추가할 수 있습니다',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '이미 추가된 태그입니다',
          variant: 'destructive',
        });
      }
    }
  };

  // 태그 제거
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 이미지 업로드 핸들러 (여기서는 임시로 URL만 처리)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 실제로는 UploadService를 사용하여 이미지 업로드 처리
    // 현재는 임시로 placeholder 이미지 추가
    if (images.length < 5) {
      setImages(prev => [...prev, 'https://via.placeholder.com/300x200']);
    } else {
      toast({
        title: '이미지는 최대 5개까지 업로드할 수 있습니다',
        variant: 'destructive',
      });
    }
  };

  // 이미지 제거
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length < 5) {
      newErrors.title = '제목은 최소 5자 이상 입력해주세요.';
    } else if (formData.title.length > 200) {
      newErrors.title = '제목은 200자를 초과할 수 없습니다.';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = '카테고리를 선택해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '질문 내용을 입력해주세요.';
    } else if (formData.content.length < 10) {
      newErrors.content = '질문 내용은 최소 10자 이상 입력해주세요.';
    } else if (formData.content.length > 10000) {
      newErrors.content = '질문 내용은 10,000자를 초과할 수 없습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const postData: CreatePostRequest = {
        post_type: 'question',
        category_id: formData.categoryId,
        title: formData.title.trim(),
        content: formData.content.trim(),
        status: formData.status,
        isAnonymous: formData.isAnonymous,
        images: images.map((imageUrl, index) => ({
          imageUrl,
          altText: `질문 이미지 ${index + 1}`,
          order: index
        }))
      };

      const response = await CommunityService.createPost(postData);
      
      if (response.success) {
        toast({
          title: '질문이 등록되었습니다',
          description: '다른 부모님들의 답변을 기다려보세요!',
        });
        
        router.push(`/community/questions/${response.data.id}`);
      }
    } catch (error) {
      console.error('질문 등록 실패:', error);
      toast({
        title: '질문 등록 실패',
        description: '질문 등록 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 임시저장 핸들러
  const handleSaveDraft = async () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      toast({
        title: '임시저장할 내용이 없습니다',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const draftData: CreatePostRequest = {
        post_type: 'question',
        category_id: formData.categoryId || categories[0]?.id || '',
        title: formData.title.trim() || '제목 없음',
        content: formData.content.trim() || '내용 없음',
        status: 'draft',
        isAnonymous: formData.isAnonymous,
        images: images.map((imageUrl, index) => ({
          imageUrl,
          altText: `질문 이미지 ${index + 1}`,
          order: index
        }))
      };

      const response = await CommunityService.createPost(draftData);
      
      if (response.success) {
        toast({
          title: '임시저장되었습니다',
        });
      }
    } catch (error) {
      console.error('임시저장 실패:', error);
      toast({
        title: '임시저장 실패',
        description: '임시저장 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // requireAuth가 처리함
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 브레드크럼 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/community" className="hover:text-primary">
            커뮤니티
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/community/questions" className="hover:text-primary">
            질문 게시판
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span>질문 작성</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">질문 작성하기</h1>
          <p className="text-muted-foreground">
            다른 부모님들에게 질문하고 육아의 부담을 함께 나누세요.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>새 질문</CardTitle>
            <CardDescription>
              구체적인 질문을 작성하면 더 정확한 답변을 받아 육아 부담을 덜 수 있습니다.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 제목 */}
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                placeholder="질문의 제목을 입력하세요"
                value={formData.title}
                onChange={handleInputChange('title')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
              <p className="text-xs text-muted-foreground">
                명확하고 구체적인 제목이 더 많은 답변을 받는데 도움이 됩니다.
              </p>
            </div>

            {/* 카테고리 */}
            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
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
              {errors.categoryId && (
                <p className="text-sm text-red-500">{errors.categoryId}</p>
              )}
            </div>

            {/* 질문 내용 */}
            <div className="space-y-2">
              <Label htmlFor="content">질문 내용 *</Label>
              <Textarea
                id="content"
                placeholder="질문 내용을 자세히 작성해주세요&#10;&#10;• 현재 상황을 구체적으로 설명해주세요&#10;• 이미 시도해본 방법이 있다면 알려주세요&#10;• 궁금한 점을 명확히 해주세요"
                rows={12}
                value={formData.content}
                onChange={handleInputChange('content')}
                className={errors.content ? 'border-red-500' : ''}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
              <p className="text-xs text-muted-foreground">
                상황, 시도해본 방법, 구체적인 고민 등을 포함하면 더 도움이 됩니다.
              </p>
            </div>

            {/* 태그 */}
            <div className="space-y-2">
              <Label htmlFor="tags">태그</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    #{tag}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-red-500"
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
                관련 키워드를 태그로 추가하면 비슷한 고민을 가진 부모님들이 질문을 찾기 쉬워집니다.
              </p>
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-2">
              <Label>이미지 첨부</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`첨부 이미지 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-muted-foreground/25 rounded-md cursor-pointer hover:border-muted-foreground/50 transition-colors">
                    <ImagePlus className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">이미지 추가</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                질문과 관련된 이미지를 최대 5개까지 첨부할 수 있습니다.
              </p>
            </div>

            {/* 옵션 */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isAnonymous: checked as boolean }))
                  }
                />
                <Label htmlFor="anonymous" className="text-sm">
                  익명으로 질문하기
                </Label>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  '임시저장'
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/community/questions">취소</Link>
              </Button>
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  등록 중...
                </>
              ) : (
                '질문 등록하기'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* 작성 가이드 */}
      <Card className="max-w-3xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-lg">💡 좋은 질문 작성 가이드</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <h4 className="font-medium">제목 작성 팁:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>아이의 나이와 구체적인 상황을 포함해주세요</li>
              <li>예: "12개월 아기가 밤에 자주 깨요" (좋음) vs "수면 문제" (나쁨)</li>
            </ul>
          </div>
          
          <div className="text-sm space-y-2">
            <h4 className="font-medium">내용 작성 팁:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>현재 상황을 구체적이고 자세히 설명해주세요</li>
              <li>이미 시도해본 방법들을 알려주세요</li>
              <li>언제부터 시작된 문제인지 알려주세요</li>
              <li>아이의 평소 성향이나 특이사항이 있다면 함께 알려주세요</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
