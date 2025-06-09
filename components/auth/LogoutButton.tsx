'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/AuthContext';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
  onLogoutSuccess?: () => void;
}

export default function LogoutButton({
  variant = 'outline',
  size = 'default',
  showIcon = true,
  children,
  className,
  onLogoutSuccess,
}: LogoutButtonProps) {
  const { logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('성공적으로 로그아웃되었습니다.');
      
      if (onLogoutSuccess) {
        onLogoutSuccess();
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || '로그아웃'}
    </Button>
  );
}
