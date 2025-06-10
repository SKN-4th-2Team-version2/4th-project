import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
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
          scope: 'openid email profile',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
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
              timeout: 10000,
            },
          );

          // Django 토큰과 사용자 정보 저장
          if (response.data.success) {
            return {
              djangoAccessToken: response.data.data.access,
              djangoRefreshToken: response.data.data.refresh,
              user: response.data.data.user,
              exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
            };
          }
        } catch (error: any) {
          console.error(
            '소셜 로그인 토큰 처리 실패:',
            error.response?.data || error.message,
          );
          return { error: 'OAuthCallback' };
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
            { timeout: 5000 },
          );

          if (response.data.success) {
            return {
              ...typedToken,
              djangoAccessToken: response.data.data.access,
              exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
            };
          }
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          return { error: 'RefreshAccessTokenError' };
        }
      }

      return typedToken;
    },
    async session({ session, token }) {
      const typedToken = token as ExtendedToken;

      if (typedToken.error) {
        session.error = typedToken.error;
      }

      // Django 토큰과 사용자 정보를 세션에 포함
      const updatedSession = {
        ...session,
        djangoAccessToken: typedToken.djangoAccessToken,
        djangoRefreshToken: typedToken.djangoRefreshToken,
        user: {
          ...session.user,
          ...typedToken.user,
        },
        expires: typedToken.exp
          ? new Date(typedToken.exp * 1000).toISOString()
          : session.expires,
      };
      return updatedSession;
    },
  },
  pages: {
    signIn: '/auth',
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
        maxAge: 30 * 24 * 60 * 60,
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXT_PUBLIC_DOMAIN || undefined,
        maxAge: 60 * 60,
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
        maxAge: 60 * 60,
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
        maxAge: 60 * 60,
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
