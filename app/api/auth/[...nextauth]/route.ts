import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import { JWT } from 'next-auth/jwt';
import axios from 'axios';

interface ExtendedToken extends JWT {
  djangoAccessToken?: string;
  djangoRefreshToken?: string;
  user?: any;
  exp?: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          response_type: 'code',
        },
      },
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      const typedToken = token as ExtendedToken;

      if (account && user) {
        try {
          // 소셜 로그인 토큰을 Django 백엔드로 전송
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/social/token/`,
            {
              provider: account.provider,
              access_token: account.access_token,
              id_token: account.id_token,
              code: account.code,
              user: {
                email: user.email,
                name: user.name,
                image: user.image,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 10000, // 10초 타임아웃
            },
          );

          // Django에서 발급받은 토큰 저장
          if (response.data.success) {
            typedToken.djangoAccessToken = response.data.data.access;
            typedToken.djangoRefreshToken = response.data.data.refresh;
            typedToken.user = {
              ...response.data.data.user,
              email: user.email,
              name: user.name,
              image: user.image,
            };
            typedToken.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30일
          } else {
            console.error('Django 소셜 로그인 에러:', response.data.message);
            throw new Error(
              response.data.message ||
                '소셜 로그인 처리 중 오류가 발생했습니다.',
            );
          }
        } catch (error: any) {
          console.error(
            '소셜 로그인 토큰 처리 실패:',
            error.response?.data || error.message,
          );
          // 에러를 다시 던지지 말고 기본값 설정
          typedToken.error = 'OAuthCallback';
          return typedToken;
        }
      }

      // 토큰 갱신이 필요한 경우
      if (
        typedToken.djangoRefreshToken &&
        typedToken.exp &&
        typedToken.exp < Math.floor(Date.now() / 1000) + 300
      ) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh/`,
            {
              refresh_token: typedToken.djangoRefreshToken,
            },
            { timeout: 5000 }, // 5초 타임아웃
          );

          if (response.data.success) {
            typedToken.djangoAccessToken = response.data.data.access;
            typedToken.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30일
          }
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          // 갱신 실패 시 에러 표시
          typedToken.error = 'RefreshAccessTokenError';
        }
      }

      return typedToken;
    },
    async session({ session, token }) {
      const typedToken = token as ExtendedToken;

      // 토큰에 에러가 있는 경우 세션에 에러 정보 추가
      if (typedToken.error) {
        session.error = typedToken.error;
      }

      if (typedToken) {
        session.djangoAccessToken = typedToken.djangoAccessToken;
        session.djangoRefreshToken = typedToken.djangoRefreshToken;
        if (typedToken.user) {
          session.user = {
            ...session.user,
            ...typedToken.user,
            email: typedToken.user.email || session.user?.email || '',
            name: typedToken.user.name || session.user?.name || '',
            image: typedToken.user.image || session.user?.image || '',
          };
        }
        if (typedToken.exp) {
          session.expires = new Date(typedToken.exp * 1000).toISOString();
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
      },
    },
    state: {
      name: 'next-auth.state',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
