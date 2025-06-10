import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ExternalLink } from 'lucide-react';

interface ServerDiagnosticProps {
  error: string;
  category: 'general' | 'specialized';
  onReconnect: () => void;
}

export function ServerDiagnostic({ error, category, onReconnect }: ServerDiagnosticProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const serverInfo = {
    general: {
      name: 'Django 일반 AI 서버',
      endpoint: 'localhost:8000',
      port: '8000',
      technology: 'Django + WebSocket',
      aiModel: 'ChatGPT API',
      features: ['영양 상담', '행동 상담', '심리 상담', '교육 상담'],
      commands: [
        'cd /Users/link/Documents/SKN/django_back',
        'python manage.py runserver',
      ],
      troubleshooting: [
        '가상환경이 활성화되어 있는지 확인',
        'requirements.txt의 모든 패키지가 설치되었는지 확인',
        'Django settings.py에서 ALLOWED_HOSTS 설정 확인',
        'CORS 설정이 올바른지 확인',
        'ChatGPT API 키가 환경변수에 설정되어 있는지 확인'
      ]
    },
    specialized: {
      name: 'FastAPI 전문 AI 서버',
      endpoint: '127.0.0.1:8080',
      port: '8080',
      technology: 'FastAPI + WebSocket',
      aiModel: '파인튜닝된 전문 모델',
      features: ['수면 전문 상담', '발달 전문 상담'],
      commands: [
        'cd /path/to/fastapi/server',
        'uvicorn main:app --host 127.0.0.1 --port 8080',
      ],
      troubleshooting: [
        'FastAPI 서버 파일(main.py)이 존재하는지 확인',
        '필요한 Python 패키지들이 설치되어 있는지 확인',
        '8080 포트가 다른 애플리케이션에서 사용 중이지 않은지 확인',
        '전문 AI 모델 파일이 올바른 위치에 있는지 확인',
        '환경변수 및 API 키 설정 확인'
      ]
    }
  };

  const info = serverInfo[category];

  const checkServerHealth = async () => {
    try {
      const response = await fetch(`http://${info.endpoint}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleDiagnose = async () => {
    const isHealthy = await checkServerHealth();
    if (isHealthy) {
      alert(`✅ ${info.name} 서버가 정상적으로 실행 중입니다.`);
    } else {
      alert(`❌ ${info.name} 서버에 연결할 수 없습니다. 아래 해결 방법을 확인해주세요.`);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      {/* 기본 에러 정보 */}
      <Alert variant="destructive">
        <AlertDescription className="text-sm">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onReconnect}
              className="ml-2 h-6 text-xs"
            >
              재연결
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* 상세 진단 정보 */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between h-8">
            <span className="text-xs font-medium">
              🔧 서버 진단 정보 및 해결 방법
            </span>
            <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-3">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-xs space-y-3">
            {/* 서버 정보 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">서버</div>
                <div className="text-slate-600 dark:text-slate-400">{info.name}</div>
              </div>
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">엔드포인트</div>
                <div className="text-slate-600 dark:text-slate-400 font-mono">{info.endpoint}</div>
              </div>
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">기술 스택</div>
                <div className="text-slate-600 dark:text-slate-400">{info.technology}</div>
              </div>
              <div>
                <div className="font-medium text-slate-700 dark:text-slate-300">AI 모델</div>
                <div className="text-slate-600 dark:text-slate-400">{info.aiModel}</div>
              </div>
            </div>

            {/* 기능 */}
            <div>
              <div className="font-medium text-slate-700 dark:text-slate-300 mb-1">제공 기능</div>
              <div className="flex flex-wrap gap-1">
                {info.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* 서버 실행 명령어 */}
            <div>
              <div className="font-medium text-slate-700 dark:text-slate-300 mb-2">서버 실행 명령어</div>
              <div className="bg-slate-800 text-green-400 p-2 rounded font-mono text-xs space-y-1">
                {info.commands.map((command, index) => (
                  <div key={index}>
                    <span className="text-slate-500">$ </span>
                    {command}
                  </div>
                ))}
              </div>
            </div>

            {/* 문제 해결 방법 */}
            <div>
              <div className="font-medium text-slate-700 dark:text-slate-300 mb-2">문제 해결 방법</div>
              <ul className="space-y-1">
                {info.troubleshooting.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span className="text-slate-600 dark:text-slate-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 진단 버튼 */}
            <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleDiagnose}
                className="flex-1 h-7 text-xs"
              >
                서버 상태 확인
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => window.open(`http://${info.endpoint}`, '_blank')}
                className="h-7 text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                브라우저에서 열기
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
