'use client';

import React from 'react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useIntegratedAuth } from '@/hooks/use-integrated-auth';
import { AllauthService } from '@/lib/auth/allauth-service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ModeToggle } from './mode-toggle';
import { Logo } from './logo';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session, status } = useSession();
  const { user, djangoAccessToken, isLoading: integratedLoading } = useIntegratedAuth();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading' || integratedLoading;

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      // Django 백엔드 로그아웃 먼저 시도
      if (djangoAccessToken) {
        await AllauthService.djangoLogout(
          djangoAccessToken, 
          session?.djangoUser?.id
        );
      }
      
      // NextAuth.js 로그아웃
      await signOut({ callbackUrl: '/' });
      toast.success('성공적으로 로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // Django 로그아웃 실패해도 NextAuth 로그아웃은 진행
      await signOut({ callbackUrl: '/' });
      toast.error('일부 로그아웃 처리 중 오류가 발생했지만 로그아웃되었습니다.');
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
      kakao: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      naver: 'bg-green-100 text-green-800 border-green-200'
    };
    return (colors as any)[provider] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // 소셜 로그인 제공자 이름 가져오기
  const getProviderName = (provider: string): string => {
    const names = {
      google: 'Google',
      kakao: 'Kakao',
      naver: 'Naver'
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
                  <NavigationMenuTrigger>커뮤니티</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                      <ListItem href="/community/questions" title="질문 게시판">
                        육아 관련 질문과 답변을 찾아보세요
                      </ListItem>
                      <ListItem href="/community/stories" title="육아 이야기">
                        부모님들의 다양한 육아 경험담
                      </ListItem>
                      <ListItem href="/community/tips" title="육아 팁">
                        유용한 육아 팁과 노하우 공유
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>AI 조언</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem href="/expert" title="AI 전문가 상담">
                        카테고리별 AI 전문가에게 질문하고 답변받기
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                {isAuthenticated && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>발달 모니터링</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <ListItem href="/development/record" title="발달 기록">
                          아이의 성장과 발달 과정을 기록하고 특별한 순간을 저장
                        </ListItem>
                        <ListItem href="/development/tracker" title="발달 추적">
                          아이의 발달 상황을 영역별로 추적하고 시각적으로 확인
                        </ListItem>
                        <ListItem
                          href="/development/timeline"
                          title="발달 타임라인"
                        >
                          시간 순서대로 아이의 발달 과정을 타임라인으로 확인
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
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
          {isSearchOpen ? (
            <div className="relative w-full max-w-sm">
              <Input
                type="search"
                placeholder="검색어를 입력하세요..."
                className="w-full"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setIsSearchOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">닫기</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="sr-only">검색</span>
            </Button>
          )}

          {/* 로그인 상태에 따른 UI 분기 */}
          {isLoading ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          ) : isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || ''} alt={user.name || ''} />
                      <AvatarFallback>{getUserInitial(user.name || '')}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {session?.provider && (
                        <div className="flex items-center space-x-1 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getProviderBadgeColor(session.provider)}`}>
                            {getProviderName(session.provider)} 계정
                          </span>
                          {user?.auth_provider && user.auth_provider !== session.provider && (
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
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>설정</span>
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
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">회원가입</Link>
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
                        <AvatarImage src={user.image || ''} alt={user.name || ''} />
                        <AvatarFallback>{getUserInitial(user.name || '')}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                    {session?.provider && (
                      <div className="flex justify-start">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getProviderBadgeColor(session.provider)}`}>
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
                    AI 조언
                  </Link>
                  {isAuthenticated && (
                    <>
                      <Link href="/development" className="text-lg font-medium">
                        발달 모니터링
                      </Link>
                      <div className="pl-4 border-l-2 border-muted space-y-2 mt-2">
                        <Link href="/development/record" className="text-sm">
                          발달 기록
                        </Link>
                        <Link href="/development/tracker" className="text-sm">
                          발달 추적
                        </Link>
                        <Link href="/development/timeline" className="text-sm">
                          발달 타임라인
                        </Link>
                      </div>
                    </>
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
                      <Link href="/settings" className="text-lg font-medium">
                        설정
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
                      <Link href="/login" className="text-lg font-medium">
                        로그인
                      </Link>
                      <Link href="/signup" className="text-lg font-medium">
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

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & {
    title: string;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
