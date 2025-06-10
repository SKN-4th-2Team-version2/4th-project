'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useIntegratedAuth } from '@/hooks/use-integrated-auth';
import { AllauthService } from '@/lib/auth/allauth-service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ModeToggle } from './mode-toggle';
import { Logo } from './logo';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Header() {
  const { data: session, status } = useSession();
  const {
    user,
    djangoAccessToken,
    isLoading: integratedLoading,
  } = useIntegratedAuth();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading' || integratedLoading;

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      // Django 백엔드 로그아웃 먼저 시도
      if (djangoAccessToken) {
        await AllauthService.djangoLogout(
          djangoAccessToken,
          session?.djangoUser?.id,
        );
      }

      // NextAuth.js 로그아웃
      await signOut({ callbackUrl: '/' });
      toast.success('성공적으로 로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // Django 로그아웃 실패해도 NextAuth 로그아웃은 진행
      await signOut({ callbackUrl: '/' });
      toast.error(
        '일부 로그아웃 처리 중 오류가 발생했지만 로그아웃되었습니다.',
      );
    }
  };

  // 사용자 이름의 첫 글자 추출 (아바타 대체 텍스트)
  const getUserInitial = (name: string): string => {
    return name?.charAt(0)?.toUpperCase() || 'U';
  };

  // 소셜 로그인 제공자 배지 색상 가져기기
  const getProviderBadgeColor = (provider: string): string => {
    const colors = {
      google: 'bg-blue-100 text-blue-800 border-blue-200',
      naver: 'bg-green-100 text-green-800 border-green-200',
    };
    return (
      (colors as any)[provider] || 'bg-gray-100 text-gray-800 border-gray-200'
    );
  };

  // 소셜 로그인 제공자 이름 가져오기
  const getProviderName = (provider: string): string => {
    const names = {
      google: 'Google',
      naver: 'Naver',
    };
    return (names as any)[provider] || provider;
  };

  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/community" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      커뮤니티
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/expert" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      AI전문가 상담
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {isAuthenticated && (
                  <NavigationMenuItem>
                    <Link href="/development" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        발달 모니터링
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                  <Link href="/resources" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      육아 자료실
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* 로그인 상태에 따른 UI 분기 */}
          {isLoading ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          ) : isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image || ''}
                        alt={user.name || ''}
                      />
                      <AvatarFallback>
                        {getUserInitial(user.name || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {session?.provider && (
                        <div className="flex items-center space-x-1 mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getProviderBadgeColor(session.provider)}`}
                          >
                            {getProviderName(session.provider)} 계정
                          </span>
                          {user?.auth_provider &&
                            user.auth_provider !== session.provider && (
                              <span className="text-xs text-muted-foreground">
                                (Django: {getProviderName(user.auth_provider)})
                              </span>
                            )}
                        </div>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>프로필</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth?mode=signin">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/auth?mode=signup">회원가입</Link>
              </Button>
            </div>
          )}

          <ModeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
                <span className="sr-only">메뉴</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-4">
                <Link href="/" className="flex items-center space-x-2">
                  <Logo />
                </Link>

                {/* 모바일 사용자 정보 */}
                {isAuthenticated && user && (
                  <div className="flex flex-col space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.image || ''}
                          alt={user.name || ''}
                        />
                        <AvatarFallback>
                          {getUserInitial(user.name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    {session?.provider && (
                      <div className="flex justify-start">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getProviderBadgeColor(session.provider)}`}
                        >
                          {getProviderName(session.provider)} 계정
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-2">
                  <Link href="/community" className="text-lg font-medium">
                    커뮤니티
                  </Link>
                  <Link href="/expert" className="text-lg font-medium">
                    AI전문가 상담
                  </Link>
                  {isAuthenticated && (
                    <Link href="/development" className="text-lg font-medium">
                      발달 모니터링
                    </Link>
                  )}
                  <Link href="/resources" className="text-lg font-medium">
                    육아 자료실
                  </Link>
                </div>

                {/* 모바일 로그인/로그아웃 버튼 */}
                <div className="grid gap-2 pt-4 border-t">
                  {isAuthenticated ? (
                    <>
                      <Link href="/profile" className="text-lg font-medium">
                        프로필
                      </Link>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        로그아웃
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth?mode=signin"
                        className="text-lg font-medium"
                      >
                        로그인
                      </Link>
                      <Link
                        href="/auth?mode=signup"
                        className="text-lg font-medium"
                      >
                        회원가입
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
