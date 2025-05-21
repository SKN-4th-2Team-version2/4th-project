'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  getTemplatesByAgeAndArea,
  type DevelopmentTemplate,
} from '@/lib/development-templates';

interface TemplateSelectorProps {
  ageGroup: string;
  developmentArea: string;
  onSelectTemplate: (template: DevelopmentTemplate) => void;
}

export function TemplateSelector({
  ageGroup,
  developmentArea,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<DevelopmentTemplate[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (ageGroup && developmentArea) {
      const filteredTemplates = getTemplatesByAgeAndArea(
        ageGroup,
        developmentArea,
      );
      setTemplates(filteredTemplates);
    } else {
      setTemplates([]);
    }
  }, [ageGroup, developmentArea]);

  if (!ageGroup || !developmentArea) {
    return null;
  }

  if (templates.length === 0) {
    return (
      <div className="text-sm text-muted-foreground mt-2">
        선택한 연령과 발달 영역에 대한 템플릿이 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        템플릿 선택하기
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-2">
          {templates.length}개 템플릿
        </span>
      </Button>

      {isOpen && (
        <Card className="mt-2 border border-input">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">발달 기록 템플릿</CardTitle>
            <CardDescription>
              연령과 발달 영역에 맞는 템플릿을 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => {
                      onSelectTemplate(template);
                      setIsOpen(false);
                    }}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">
                        {template.title}
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
