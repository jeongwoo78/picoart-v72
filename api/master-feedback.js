// PicoArt - 거장(AI) 대화 API
// v89: GPT-4o 최적화 리팩토링
// - 시스템 프롬프트 간소화 (500줄 → 30줄)
// - 하드코딩 멘트 삭제 (17개 → 4개 필드)
// - extractCorrectionPrompt 삭제 (JSON 강제로 불필요)
// - response_format: json_object 추가

// ========================================
// 거장 페르소나 (간소화)
// ========================================
const MASTER_PERSONAS = {
  'VAN GOGH': {
    nameKo: '반 고흐',
    fullNameKo: '빈센트 반 고흐',
    city: '아를',
    speakingStyle: '~일세, ~하네, ~겠네, 자네'
  },
  'KLIMT': {
    nameKo: '클림트',
    fullNameKo: '구스타프 클림트',
    city: '빈',
    speakingStyle: '~하오, ~소, 그대'
  },
  'MUNCH': {
    nameKo: '뭉크',
    fullNameKo: '에드바르 뭉크',
    city: '오슬로',
    speakingStyle: '~일세, ~하네, ~겠네, 자네'
  },
  'PICASSO': {
    nameKo: '피카소',
    fullNameKo: '파블로 피카소',
    city: '파리',
    speakingStyle: '~다, ~지, ~군, 자네'
  },
  'MATISSE': {
    nameKo: '마티스',
    fullNameKo: '앙리 마티스',
    city: '니스',
    speakingStyle: '~라네, ~하지, ~겠네, 자네'
  },
  'CHAGALL': {
    nameKo: '샤갈',
    fullNameKo: '마르크 샤갈',
    city: '파리',
    speakingStyle: '~라네, ~하지, ~겠네, 자네'
  },
  'FRIDA': {
    nameKo: '프리다 칼로',
    fullNameKo: '프리다 칼로',
    city: '멕시코시티',
    speakingStyle: '~야, ~해, ~할게, ~어'
  },
  'LICHTENSTEIN': {
    nameKo: '리히텐슈타인',
    fullNameKo: '로이 리히텐슈타인',
    city: '뉴욕',
    speakingStyle: '~야, ~해, ~지, ~을까'
  }
};

// ========================================
// GPT-4o API 호출
// ========================================
async function callGPT4o(messages, systemPrompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 1024,
      temperature: 0.7,
      response_format: { type: "json_object" }  // JSON 강제
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// ========================================
// 시스템 프롬프트 (간소화)
// ========================================
function buildSystemPrompt(masterKey, conversationType) {
  const persona = MASTER_PERSONAS[masterKey];
  
  if (!persona) {
    throw new Error(`Unknown master: ${masterKey}`);
  }

  // 공통 규칙
  const commonRules = `
## 말투
"${persona.speakingStyle}" 스타일로 말하기. 현대 존댓말(~요, ~습니다) 금지.

## JSON 응답 형식
{"masterResponse": "한국어 응답", "correctionPrompt": "영어 수정 명령 또는 빈 문자열"}

## 수정 요청 규칙
- 수정 요청이 구체적이면: correctionPrompt에 영어로 작성 (예: "Change the hair color to red")
- 모호한 요청이면: 구체적으로 질문하고 correctionPrompt는 빈 문자열
- 수정 불가(배경, 포즈, 구도): "다시 만들기"로 안내하고 correctionPrompt는 빈 문자열
- 색상은 구체적으로: red, blue, brown, tan, gold 등 (warm tone, vibrant 같은 추상적 표현 금지)

## 대화 범위 외 질문 (사후의 일, 실시간 정보, 그림/화가와 무관한 질문 등)
화가로서 위트있게 넘기기`;

  // ========================================
  // 첫 인사 (greeting)
  // ========================================
  if (conversationType === 'greeting') {
    return `당신은 AI를 통해 현대에 부활한 화가 ${persona.fullNameKo}입니다.

## 첫 인사 필수 요소
1. "${persona.city}의 ${persona.nameKo}" 자기소개
2. AI로 부활했다는 언급
3. 사용자의 사진을 당신의 화풍으로 그림을 완성했다는 언급
4. 느낌이 어떤지 질문

2~3문장으로 짧게.
${commonRules}`;
  }
  
  // ========================================
  // 피드백 대화 (feedback)
  // ========================================
  if (conversationType === 'feedback') {
    return `당신은 AI를 통해 현대에 부활한 화가 ${persona.fullNameKo}입니다.
사용자의 사진이 당신의 화풍으로 변환되었고, 사용자와 대화 중입니다.

## 대화 범위
- 변환된 그림 결과
- 당신의 삶, 작품 세계, 살았던 시대
- 수정 요청 처리

## 수정 확정 시
masterResponse에 "'수정 요청' 버튼을 눌러달라"고 안내.
${commonRules}`;
  }
  
  // ========================================
  // 결과 전달 (result)
  // ========================================
  if (conversationType === 'result') {
    return `당신은 AI를 통해 현대에 부활한 화가 ${persona.fullNameKo}입니다.
사용자가 요청한 수정이 완료되었습니다. 결과를 전달해주세요.

1~2문장으로 짧게.
${commonRules}`;
  }

  throw new Error(`Unknown conversation type: ${conversationType}`);
}

// ========================================
// API Handler
// ========================================
export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      masterName,
      conversationType,
      userMessage,
      conversationHistory
    } = req.body;

    // 유효성 검사
    if (!masterName || !MASTER_PERSONAS[masterName]) {
      return res.status(400).json({ 
        error: 'Invalid master name',
        validMasters: Object.keys(MASTER_PERSONAS)
      });
    }

    if (!conversationType || !['greeting', 'feedback', 'result'].includes(conversationType)) {
      return res.status(400).json({ 
        error: 'Invalid conversation type',
        validTypes: ['greeting', 'feedback', 'result']
      });
    }

    const persona = MASTER_PERSONAS[masterName];
    const systemPrompt = buildSystemPrompt(masterName, conversationType);
    
    // 디버그 로그
    console.log('=== Master Feedback API v89 (GPT-4o Optimized) ===');
    console.log('masterName:', masterName);
    console.log('conversationType:', conversationType);
    console.log('persona:', persona.nameKo);
    
    // 메시지 구성
    let messages = [];
    
    if (conversationType === 'greeting') {
      messages = [{ role: 'user', content: '첫 인사를 해주세요.' }];
    } else if (conversationType === 'feedback') {
      // 대화 히스토리가 있으면 추가
      if (conversationHistory && Array.isArray(conversationHistory)) {
        messages = conversationHistory.map(msg => ({
          role: msg.role === 'master' ? 'assistant' : 'user',
          content: msg.content
        }));
      }
      messages.push({ role: 'user', content: userMessage });
    } else if (conversationType === 'result') {
      messages = [{ role: 'user', content: '수정이 완료되었습니다. 결과를 전달해주세요.' }];
    }

    // GPT-4o 호출
    const response = await callGPT4o(messages, systemPrompt);
    
    console.log('GPT-4o Response:', response);

    // JSON 파싱 (response_format으로 인해 항상 유효한 JSON)
    try {
      const parsed = JSON.parse(response);
      return res.status(200).json({
        success: true,
        masterResponse: parsed.masterResponse || '',
        correctionPrompt: parsed.correctionPrompt || ''
      });
    } catch (parseError) {
      // response_format 사용으로 거의 발생하지 않음
      console.error('JSON Parse Error (unexpected):', parseError);
      return res.status(200).json({
        success: true,
        masterResponse: response,
        correctionPrompt: ''
      });
    }

  } catch (error) {
    console.error('Master Feedback API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
