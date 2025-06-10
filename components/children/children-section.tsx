'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Child } from '@/types/user';
import { AddChildModal } from './add-child-modal';

interface ChildrenSectionProps {
  children: Child[];
}

export function ChildrenSection({ children }: ChildrenSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>자녀 정보</CardTitle>
        {children.length === 0 && <AddChildModal />}
      </CardHeader>
      <CardContent>
        {children.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <Card key={child.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{child.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      <p>생년월일: {child.birth_Date}</p>
                      <p>성별: {child.gender === 'male' ? '남성' : '여성'}</p>
                      <p>나이: {child.ageMonths}개월</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              등록된 자녀 정보가 없습니다.
            </p>
            <AddChildModal />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
