import Link from "next/link"
import { Logo } from "./logo"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div className="container py-12 md:py-16">
        {/* 상단 섹션 - 로고, 설명, 뉴스레터 */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Logo size="lg" />
            <p className="text-sm text-muted-foreground max-w-md">
              '초보 엄마 아빠의 부담을 덜어준다'는 의미의 마파덜은 부모님들에게 신뢰할 수 있는 육아 정보와 상호 지원
              환경을 제공하는 플랫폼입니다.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link
                href="#"
                className="bg-white dark:bg-slate-800 p-2 rounded-full text-primary hover:text-primary/80 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-110 transition-all"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-white dark:bg-slate-800 p-2 rounded-full text-primary hover:text-primary/80 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-110 transition-all"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-white dark:bg-slate-800 p-2 rounded-full text-primary hover:text-primary/80 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-110 transition-all"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="bg-white dark:bg-slate-800 p-2 rounded-full text-primary hover:text-primary/80 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-110 transition-all"
                aria-label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">뉴스레터 구독</h3>
            <p className="text-sm text-muted-foreground">최신 육아 정보와 유용한 팁을 이메일로 받아보세요.</p>
            <div className="flex gap-2 max-w-md">
              <Input
                type="email"
                placeholder="이메일 주소"
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-primary/20 dark:focus:ring-primary/30"
              />
              <Button type="submit" className="dark:hover:bg-primary/90">
                구독
              </Button>
            </div>
          </div>
        </div>

        {/* 중간 섹션 - 링크 그룹 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-3">
            <h4 className="font-medium text-primary dark:text-primary/90">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/community"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link
                  href="/expert"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  전문가 조언
                </Link>
              </li>
              <li>
                <Link
                  href="/development"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  발달 모니터링
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  육아 자료실
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-primary dark:text-primary/90">커뮤니티</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/community/questions"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  질문 게시판
                </Link>
              </li>
              <li>
                <Link
                  href="/community/stories"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  육아 이야기
                </Link>
              </li>
              <li>
                <Link
                  href="/community/tips"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  육아 팁
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-primary dark:text-primary/90">지원</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  문의하기
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  도움말
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-primary dark:text-primary/90">법적 정보</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-primary dark:hover:text-primary/90 transition-colors"
                >
                  쿠키 정책
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 섹션 - 저작권 */}
        <div className="pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} 마파덜. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
