import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: '이용약관 | 마파덜',
  description:
    '마파덜 서비스 이용약관입니다. 서비스 이용 전 반드시 확인해주세요.',
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">이용약관</h1>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/privacy">개인정보처리방침</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">제1조 (목적)</h3>
            <p>
              이 약관은 마파덜(이하 "회사")이 제공하는 서비스(이하 "서비스")의
              이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타
              필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">제2조 (정의)</h3>
            <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                "서비스"란 회사가 제공하는 육아 정보 공유 및 커뮤니티 서비스,
                전문가 상담 서비스, 발달 모니터링 서비스 등을 의미합니다.
              </li>
              <li>
                "이용자"란 회사의 서비스에 접속하여 이 약관에 따라 회사가
                제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
              </li>
              <li>
                "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서,
                회사의 서비스를 지속적으로 이용할 수 있는 자를 말합니다.
              </li>
              <li>
                "비회원"이란 회원에 가입하지 않고 회사가 제공하는 서비스를
                이용하는 자를 말합니다.
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              제3조 (약관의 효력 및 변경)
            </h3>
            <p>
              회사는 이 약관의 내용을 이용자가 알 수 있도록 서비스 초기 화면에
              게시합니다. 회사는 필요한 경우 관련법령을 위배하지 않는 범위
              내에서 이 약관을 변경할 수 있으며, 변경된 약관은 서비스 내에
              공지함으로써 효력이 발생합니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              제4조 (서비스의 제공 및 변경)
            </h3>
            <p>회사는 다음과 같은 서비스를 제공합니다:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>육아 관련 정보 제공 서비스</li>
              <li>육아 커뮤니티 서비스</li>
              <li>전문가 상담 서비스</li>
              <li>아동 발달 모니터링 서비스</li>
              <li>기타 회사가 정하는 서비스</li>
            </ol>
            <p>
              회사는 서비스의 품질 향상을 위해 서비스의 내용을 변경할 수 있으며,
              이 경우 변경된 서비스의 내용 및 제공일자를 명시하여 서비스 내에
              공지합니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">제5조 (서비스 이용시간)</h3>
            <p>
              서비스 이용시간은 회사의 업무상 또는 기술상 특별한 지장이 없는 한
              연중무휴, 1일 24시간을 원칙으로 합니다. 다만, 회사는 서비스의
              종류나 성질에 따라 별도의 이용시간을 정할 수 있으며, 이 경우
              회사는 그 이용시간을 사전에 이용자에게 공지합니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">제6조 (회원가입)</h3>
            <p>
              이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이
              약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
              회사는 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지
              않는 한 회원으로 등록합니다.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                가입신청자가 이 약관 제7조에 의하여 이전에 회원자격을 상실한
                적이 있는 경우
              </li>
              <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
              <li>
                기타 회원으로 등록하는 것이 회사의 서비스 운영에 현저히 지장이
                있다고 판단되는 경우
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              제7조 (회원 탈퇴 및 자격 상실)
            </h3>
            <p>
              회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시
              회원탈퇴를 처리합니다. 회원이 다음 각 호의 사유에 해당하는 경우,
              회사는 회원자격을 제한 및 정지시킬 수 있습니다.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>가입 신청 시에 허위 내용을 등록한 경우</li>
              <li>다른 이용자에게 심한 불편함이나 피해를 주는 경우</li>
              <li>
                서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에
                반하는 행위를 하는 경우
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">제8조 (개인정보보호)</h3>
            <p>
              회사는 이용자의 개인정보 보호를 매우 중요시하며, 정보통신망
              이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령을
              준수하기 위해 노력합니다. 회사의 개인정보 보호에 관한 자세한
              사항은 별도의 "개인정보처리방침"에서 규정합니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">제9조 (이용자의 의무)</h3>
            <p>이용자는 다음 각 호의 행위를 하여서는 안됩니다.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>회원가입 신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>
                회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는
                게시
              </li>
              <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>
                회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
              </li>
              <li>
                외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는
                정보를 서비스에 공개 또는 게시하는 행위
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              제10조 (저작권의 귀속 및 이용제한)
            </h3>
            <p>
              회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에
              귀속합니다. 이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전
              승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여
              영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">제11조 (분쟁해결)</h3>
            <p>
              회사와 이용자 간에 발생한 서비스 이용에 관한 분쟁은 원만하게
              해결하기 위하여 필요한 노력을 합니다. 그럼에도 불구하고 분쟁이
              해결되지 않을 경우에는 관련법령 및 상관례에 따릅니다.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">제12조 (재판권 및 준거법)</h3>
            <p>
              이 약관에 명시되지 않은 사항은 관련법령 및 상관례에 따릅니다.
              회사와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국 법을
              준거법으로 합니다.
            </p>
          </div>

          <div className="pt-4">
            <p>
              <strong>부칙</strong>
              <br />이 약관은 2025년 5월 16일부터 시행합니다.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center">
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
