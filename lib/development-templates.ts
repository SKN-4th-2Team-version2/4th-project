export interface DevelopmentTemplate {
  id: string
  title: string
  description: string
  ageGroup: string
  developmentArea: string
  templateContent: string
  questions: string[]
}

export const developmentTemplates: DevelopmentTemplate[] = [
  // 신체 발달 템플릿
  {
    id: "physical-motor-skills",
    title: "대근육 운동 기술",
    description: "아이의 대근육 운동 능력과 신체적 발달에 관한 기록",
    ageGroup: "1", // 0-6개월
    developmentArea: "physical",
    templateContent: "아이의 대근육 운동 능력(앉기, 기어가기, 서기, 걷기 등)에 대한 관찰 내용을 기록합니다.",
    questions: [
      "아이가 머리를 들거나 가슴을 들어올릴 수 있나요?",
      "도움 없이 앉을 수 있나요?",
      "기어갈 수 있나요?",
      "스스로 일어서거나 걸을 수 있나요?",
      "계단을 오르내릴 수 있나요?",
    ],
  },
  {
    id: "physical-fine-motor",
    title: "소근육 운동 기술",
    description: "아이의 소근육 운동 능력과 손 조작 능력에 관한 기록",
    ageGroup: "1", // 0-6개월
    developmentArea: "physical",
    templateContent: "아이의 소근육 운동 능력(물건 잡기, 손가락 사용, 그리기 등)에 대한 관찰 내용을 기록합니다.",
    questions: [
      "물건을 손으로 잡을 수 있나요?",
      "엄지와 검지를 사용해 작은 물건을 집을 수 있나요?",
      "숟가락이나 포크를 사용할 수 있나요?",
      "크레용이나 연필로 선을 그릴 수 있나요?",
      "단추를 잠그거나 지퍼를 올릴 수 있나요?",
    ],
  },

  // 인지 발달 템플릿
  {
    id: "cognitive-problem-solving",
    title: "문제 해결 능력",
    description: "아이의 문제 해결 능력과 인지적 사고에 관한 기록",
    ageGroup: "3", // 1-2세
    developmentArea: "cognitive",
    templateContent: "아이가 문제를 해결하는 방식과 인지적 사고 과정에 대한 관찰 내용을 기록합니다.",
    questions: [
      "간단한 퍼즐을 맞출 수 있나요?",
      "물건이 숨겨진 곳을 찾을 수 있나요?",
      "원인과 결과를 이해하나요? (예: 버튼을 누르면 소리가 난다)",
      "간단한 문제를 해결하기 위해 시도하나요?",
      "새로운 방법으로 문제를 해결하려고 시도하나요?",
    ],
  },
  {
    id: "cognitive-memory",
    title: "기억력과 주의력",
    description: "아이의 기억력과 주의 집중력에 관한 기록",
    ageGroup: "4", // 3-4세
    developmentArea: "cognitive",
    templateContent: "아이의 기억력과 주의 집중력에 대한 관찰 내용을 기록합니다.",
    questions: [
      "간단한 지시를 기억하고 따를 수 있나요?",
      "익숙한 이야기의 일부를 기억하고 예측할 수 있나요?",
      "한 가지 활동에 얼마나 오래 집중할 수 있나요?",
      "과거 경험을 기억하고 이야기할 수 있나요?",
      "여러 단계의 지시를 기억하고 따를 수 있나요?",
    ],
  },

  // 언어 발달 템플릿
  {
    id: "language-receptive",
    title: "수용 언어 능력",
    description: "아이가 언어를 이해하는 능력에 관한 기록",
    ageGroup: "2", // 7-12개월
    developmentArea: "language",
    templateContent: "아이가 다른 사람의 말을 이해하는 능력에 대한 관찰 내용을 기록합니다.",
    questions: [
      "이름을 부르면 반응하나요?",
      "간단한 지시를 이해하나요? (예: '공 주세요')",
      "질문에 적절하게 반응하나요?",
      "이야기를 들을 때 집중하나요?",
      "복잡한 지시를 이해하나요?",
    ],
  },
  {
    id: "language-expressive",
    title: "표현 언어 능력",
    description: "아이가 언어를 표현하는 능력에 관한 기록",
    ageGroup: "2", // 7-12개월
    developmentArea: "language",
    templateContent: "아이가 말이나 몸짓으로 자신을 표현하는 능력에 대한 관찰 내용을 기록합니다.",
    questions: [
      "옹알이나 소리를 내나요?",
      "첫 단어를 말했나요? 어떤 단어인가요?",
      "두 단어 이상을 조합해서 말하나요?",
      "간단한 문장을 말할 수 있나요?",
      "자신의 필요와 감정을 말로 표현할 수 있나요?",
    ],
  },

  // 사회성 발달 템플릿
  {
    id: "social-emotional",
    title: "정서적 발달",
    description: "아이의 감정 인식과 표현에 관한 기록",
    ageGroup: "3", // 1-2세
    developmentArea: "social",
    templateContent: "아이가 자신과 타인의 감정을 인식하고 표현하는 방식에 대한 관찰 내용을 기록합니다.",
    questions: [
      "기본적인 감정(기쁨, 슬픔, 화남)을 표현하나요?",
      "타인의 감정에 반응하나요? (예: 누군가 울면 걱정하는 모습)",
      "자신의 감정을 조절하려고 시도하나요?",
      "좌절감을 어떻게 다루나요?",
      "공감 능력을 보여주나요?",
    ],
  },
  {
    id: "social-interaction",
    title: "사회적 상호작용",
    description: "아이의 또래 및 성인과의 상호작용에 관한 기록",
    ageGroup: "5", // 5-6세
    developmentArea: "social",
    templateContent: "아이가 다른 사람들과 상호작용하는 방식에 대한 관찰 내용을 기록합니다.",
    questions: [
      "또래와 놀이를 공유하나요?",
      "차례를 기다리거나 나눠 쓸 수 있나요?",
      "협력하여 문제를 해결하나요?",
      "갈등을 어떻게 해결하나요?",
      "친구 관계를 형성하고 유지하나요?",
    ],
  },

  // 추가 템플릿 - 연령별 특화
  {
    id: "infant-milestones",
    title: "영아기 주요 이정표",
    description: "0-12개월 영아의 전반적인 발달 이정표 기록",
    ageGroup: "1", // 0-6개월
    developmentArea: "physical",
    templateContent: "영아기의 주요 발달 이정표에 대한 관찰 내용을 기록합니다.",
    questions: [
      "목을 가눌 수 있나요?",
      "뒤집기를 할 수 있나요?",
      "물건을 잡을 수 있나요?",
      "옹알이를 하나요?",
      "낯가림을 보이나요?",
    ],
  },
  {
    id: "toddler-independence",
    title: "유아기 자립심 발달",
    description: "1-3세 유아의 자립심과 독립성 발달 기록",
    ageGroup: "3", // 1-2세
    developmentArea: "social",
    templateContent: "유아기의 자립심과 독립성 발달에 대한 관찰 내용을 기록합니다.",
    questions: [
      "스스로 먹으려고 시도하나요?",
      "간단한 옷 입기/벗기를 시도하나요?",
      "'내가 할래'라고 주장하나요?",
      "화장실 사용에 관심을 보이나요?",
      "간단한 집안일을 돕고 싶어하나요?",
    ],
  },
  {
    id: "preschool-creativity",
    title: "학령전기 창의성 발달",
    description: "3-6세 아동의 창의성과 상상력 발달 기록",
    ageGroup: "4", // 3-4세
    developmentArea: "cognitive",
    templateContent: "학령전기 아동의 창의성과 상상력 발달에 대한 관찰 내용을 기록합니다.",
    questions: [
      "상상 놀이에 참여하나요?",
      "창의적인 방식으로 문제를 해결하나요?",
      "이야기를 만들어내나요?",
      "예술 활동에 관심을 보이나요?",
      "새로운 아이디어를 제시하나요?",
    ],
  },
]

export function getTemplatesByAgeAndArea(ageGroup: string, developmentArea: string): DevelopmentTemplate[] {
  return developmentTemplates.filter(
    (template) => template.ageGroup === ageGroup && template.developmentArea === developmentArea,
  )
}

export function getTemplateById(id: string): DevelopmentTemplate | undefined {
  return developmentTemplates.find((template) => template.id === id)
}

export function getAllTemplates(): DevelopmentTemplate[] {
  return developmentTemplates
}
