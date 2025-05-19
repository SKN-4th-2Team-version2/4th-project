"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TermsOfService } from "@/components/terms-of-service"
import { PrivacyPolicy } from "@/components/privacy-policy"

export default function SignupPage() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
            <CardDescription>마파덜에 오신 것을 환영합니다. 계정을 만들어 시작하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">이메일</TabsTrigger>
                <TabsTrigger value="social">소셜 로그인</TabsTrigger>
              </TabsList>
              <TabsContent value="email">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" type="email" placeholder="name@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">비밀번호 확인</Label>
                    <Input id="confirm-password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    회원가입
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="social">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="4" />
                      <line x1="21.17" x2="12" y1="8" y2="8" />
                      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
                      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
                    </svg>
                    Google로 계속하기
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              회원가입을 진행하면 마파덜의 <TermsOfService /> 과 <PrivacyPolicy /> 에 동의하게 됩니다.
            </div>
            <div className="text-sm text-center">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                로그인
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
