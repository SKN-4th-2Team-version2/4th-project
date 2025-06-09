'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useIntegratedAuth, useSocialConnections } from '@/hooks/use-integrated-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  User, 
  Shield, 
  Link as LinkIcon, 
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import AuthService from '@/services/auth-service';
import { UserChild } from '@/types/auth';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { 
    user, 
    isLoading, 
    error,
    refreshDjangoData,
    connectedProviders,
    hasMultipleSocialAccounts
  } = useIntegratedAuth();
  
  // 소셜 연결 정보 등은 필요시 추가

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">사용자 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const getUserInitial = (name: string): string => {
    return name?.charAt(0)?.toUpperCase() || 'U';
  };

  const getProviderColor = (provider: string): string => {
    const colors = {
      google: 'bg-blue-100 text-blue-800',
      kakao: 'bg-yellow-100 text-yellow-800',
      naver: 'bg-green-100 text-green-800'
    };
    return (colors as any)[provider] || 'bg-gray-100 text-gray-800';
  };

  const getProviderName = (provider: string): string => {
    const names = {
      google: 'Google',
      kakao: 'Kakao',
      naver: 'Naver'
    };
    return (names as any)[provider] || provider;
  };

  const handleRefresh = async () => {
    try {
      await refreshDjangoData();
      toast.success('프로필 정보가 새로고침되었습니다.');
    } catch (error) {
      toast.error('프로필 새로고침에 실패했습니다.');
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="grid gap-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 통합 프로필 정보만 노출 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                통합 프로필 정보
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                새로고침
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                <AvatarFallback className="text-xl">
                  {getUserInitial(user.name || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground flex items-center gap-2 mt-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">연결된 계정:</span>
                  </div>
                  {connectedProviders.map(provider => (
                    <Badge key={provider} className={getProviderColor(provider)}>
                      {getProviderName(provider)}
                    </Badge>
                  ))}
                  {hasMultipleSocialAccounts && (
                    <Badge variant="secondary">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      여러 계정 연결됨
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <ChildrenSection />
      </div>
    </div>
  );
}

function ChildrenSection() {
  const [children, setChildren] = useState<UserChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editChild, setEditChild] = useState<UserChild | null>(null);
  const [form, setForm] = useState<Omit<UserChild, 'id'>>({ name: '', birth_date: '', gender: '' });
  
  const fetchChildren = async () => {
    setLoading(true);
    try {
      const data = await AuthService.getChildren();
      setChildren(data);
    } catch (e) {
      setError('자녀 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleOpenAdd = () => {
    setEditChild(null);
    setForm({ name: '', birth_date: '', gender: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (child: UserChild) => {
    setEditChild(child);
    setForm({ name: child.name, birth_date: child.birth_date, gender: child.gender });
    setShowModal(true);
  };

  const handleDelete = async (childId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await AuthService.deleteChild(childId);
    fetchChildren();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editChild) {
      await AuthService.updateChild(editChild.id, form);
    } else {
      await AuthService.addChild(form);
    }
    setShowModal(false);
    fetchChildren();
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">자녀 정보</h3>
      {loading ? (
        <div>로딩 중...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {children.length === 0 ? (
            <div className="mb-4">자녀 정보가 없습니다. 자녀 정보를 추가해보세요.</div>
          ) : (
            <ul className="mb-4 space-y-2">
              {children.map(child => (
                <li key={child.id} className="flex items-center gap-4 border p-2 rounded">
                  <span className="font-medium">{child.name}</span>
                  <span className="text-sm text-muted-foreground">{child.birth_date}</span>
                  <span className="text-sm text-muted-foreground">{child.gender}</span>
                  <Button size="sm" variant="outline" onClick={() => handleOpenEdit(child)}>수정</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(child.id)}>삭제</Button>
                </li>
              ))}
            </ul>
          )}
          <Button onClick={handleOpenAdd}>자녀 추가</Button>
        </>
      )}
      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80 space-y-4">
            <h4 className="font-bold mb-2">{editChild ? '자녀 정보 수정' : '자녀 정보 추가'}</h4>
            <input
              className="w-full border p-2 rounded"
              placeholder="이름"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <input
              className="w-full border p-2 rounded"
              type="date"
              value={form.birth_date}
              onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))}
              required
            />
            <select
              className="w-full border p-2 rounded"
              value={form.gender}
              onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
              required
            >
              <option value="">성별 선택</option>
              <option value="male">남아</option>
              <option value="female">여아</option>
            </select>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>취소</Button>
              <Button type="submit">저장</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
