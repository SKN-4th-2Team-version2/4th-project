"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./mode-toggle"
import { Logo } from "./logo"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-50 to-blue-100 p-6 no-underline outline-none focus:shadow-md"
                            href="/community"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">부모 커뮤니티</div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              다른 부모님들과 경험과 지식을 나누는 공간입니다.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
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
                  <NavigationMenuTrigger>전문가 조언</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <ListItem href="/expert" title="AI 전문가 상담">
                        카테고리별 AI 전문가에게 질문하고 답변받기
                      </ListItem>
                      <ListItem href="/expert/ai?category=development" title="발달 상담">
                        신체, 인지, 언어, 사회성 발달 관련 상담
                      </ListItem>
                      <ListItem href="/expert/ai?category=sleep" title="수면 상담">
                        수면 습관, 수면 문제 관련 상담
                      </ListItem>
                      <ListItem href="/expert/ai?category=nutrition" title="영양 상담">
                        이유식, 식습관, 영양 균형 관련 상담
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
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
                      <ListItem href="/development/timeline" title="발달 타임라인">
                        시간 순서대로 아이의 발달 과정을 타임라인으로 확인
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/resources" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>육아 자료실</NavigationMenuLink>
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
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hidden md:flex">
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

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">로그인</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">회원가입</Link>
            </Button>
          </div>

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
                <div className="grid gap-2">
                  <Link href="/community" className="text-lg font-medium">
                    커뮤니티
                  </Link>
                  <Link href="/expert" className="text-lg font-medium">
                    전문가 조언
                  </Link>
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
                  <Link href="/resources" className="text-lg font-medium">
                    육아 자료실
                  </Link>
                </div>
                <div className="grid gap-2">
                  <Link href="/login" className="text-lg font-medium">
                    로그인
                  </Link>
                  <Link href="/signup" className="text-lg font-medium">
                    회원가입
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
