import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChildrenSection } from '@/components/children/children-section';
import { EditProfileModal } from '@/components/profile/edit-profile-modal';
import { Child } from '@/types/user';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">로그인이 필요합니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user } = session;
  const children = (user.children || []) as Child[];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>프로필</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || '프로필 이미지'}
              />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <EditProfileModal currentName={user.name || ''} />
              </div>
              <p className="text-muted-foreground">{user.email}</p>
              {user.auth_provider && (
                <p className="text-sm text-muted-foreground">
                  {user.auth_provider} 계정으로 로그인
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ChildrenSection children={children} />
    </div>
  );
}
