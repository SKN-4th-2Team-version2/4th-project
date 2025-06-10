import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import apiClient from '@/services/api-client';
import { Child } from '@/types/user';

interface SocialLoginResponse {
  success: boolean;
  data: {
    access: string;
    refresh: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      auth_provider?: string;
      children?: Child[];
    };
  };
}

interface ExtendedToken extends JWT {
  djangoAccessToken?: string;
  djangoRefreshToken?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
    auth_provider?: string;
    children?: Child[];
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      const typedToken = token as ExtendedToken;

      if (account && profile) {
        try {
          // 소셜 로그인 정보를 백엔드로 전송하여 JWT 토큰 받기
          const response = await apiClient.post<SocialLoginResponse>(
            '/auth/social-login/',
            {
              provider: account.provider,
              access_token: account.access_token,
              id_token: account.id_token,
            },
          );

          // 백엔드에서 받은 JWT 토큰 저장
          typedToken.djangoAccessToken = response.data.access;
          typedToken.djangoRefreshToken = response.data.refresh;
          typedToken.user = response.data.user;
        } catch (error) {
          console.error('소셜 로그인 처리 실패:', error);
          throw new Error('소셜 로그인 처리에 실패했습니다');
        }
      }
      return typedToken;
    },
    async session({ session, token }) {
      const typedToken = token as ExtendedToken;

      if (typedToken.user) {
        // 기존 세션 정보와 토큰의 사용자 정보를 병합
        session.user = {
          ...session.user,
          ...typedToken.user,
        };
        session.djangoAccessToken = typedToken.djangoAccessToken;
        session.djangoRefreshToken = typedToken.djangoRefreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  events: {
    async signIn() {
      // 로그인 성공 시 세션 저장 - 불필요한 요청 제거
    },
    async signOut() {
      // 로그아웃 시 세션 삭제 - 불필요한 요청 제거
    },
  },
};
