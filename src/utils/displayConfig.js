// ========================================
// displayConfig.js - 3줄 형식 컨트롤 타워
// v72 - 2026-01-18
// ========================================
// 
// 모든 키 정규화, 별칭 매핑, 3줄 표시 정보를 한 곳에서 관리
// API 응답 → 정규화 → 교육자료/UI 표시
//
// 3줄 형식:
// - 거장: 화가명(영문, 생몰) / 사조, 국가 / 대표작 3개
// - 사조: 사조(영문, 시기) / 대표화가 3명 / 역사적 배경
// - 동양화: 국가 전통회화(영문) / 스타일들 / 한 줄 설명
//
// ========================================

// ========================================
// 1. 표준 키 목록
// ========================================
export const STANDARD_KEYS = {
  // 사조 (11개)
  movements: [
    'greco-roman',
    'medieval-art', 
    'renaissance',
    'baroque',
    'rococo',
    'neoclassicism-romanticism-realism',
    'impressionism',
    'post-impressionism',
    'fauvism',
    'expressionism',
    'modernism'
  ],
  
  // 거장 (7명)
  masters: [
    'vangogh',
    'klimt', 
    'munch',
    'matisse',
    'chagall',
    'frida',
    'lichtenstein'
  ],
  
  // 동양화 (6개)
  oriental: [
    'korean-minhwa',
    'korean-pungsokdo',
    'korean-jingyeong',
    'chinese-ink',
    'chinese-gongbi',
    'japanese-ukiyoe'
  ],
  
  // 사조별 화가 (37명)
  artists: [
    // 그리스·로마
    'classical-sculpture', 'roman-mosaic',
    // 중세
    'byzantine', 'gothic', 'islamic-miniature',
    // 르네상스
    'leonardo', 'michelangelo', 'raphael', 'botticelli', 'titian',
    // 바로크
    'caravaggio', 'rembrandt', 'velazquez', 'rubens',
    // 로코코
    'watteau', 'boucher',
    // 신고전·낭만·사실
    'david', 'ingres', 'turner', 'delacroix', 'courbet', 'manet',
    // 인상주의
    'monet', 'renoir', 'degas', 'caillebotte',
    // 후기인상주의
    'vangogh', 'gauguin', 'cezanne',
    // 야수파
    'matisse', 'derain', 'vlaminck',
    // 표현주의
    'munch', 'kirchner', 'kokoschka',
    // 모더니즘
    'picasso', 'magritte', 'miro', 'chagall', 'lichtenstein'
  ]
};

// ========================================
// 2. 별칭 테이블 (ALIASES)
// ========================================
// 어떤 입력이든 → 표준 키로 변환
export const ALIASES = {
  // ===== 사조 별칭 =====
  'ancient': 'greco-roman',
  'ancient-art': 'greco-roman',
  'greek-roman': 'greco-roman',
  'greco-roman': 'greco-roman',
  '고대': 'greco-roman',
  '그리스로마': 'greco-roman',
  
  'medieval': 'medieval-art',
  'medieval-art': 'medieval-art',
  '중세': 'medieval-art',
  
  'renaissance': 'renaissance',
  '르네상스': 'renaissance',
  
  'baroque': 'baroque',
  '바로크': 'baroque',
  
  'rococo': 'rococo',
  '로코코': 'rococo',
  
  'neoclassicism_vs_romanticism_vs_realism': 'neoclassicism-romanticism-realism',
  'neoclassicism-romanticism-realism': 'neoclassicism-romanticism-realism',
  'neoclassicism': 'neoclassicism-romanticism-realism',
  '신고전': 'neoclassicism-romanticism-realism',
  
  'impressionism': 'impressionism',
  '인상주의': 'impressionism',
  
  'postImpressionism': 'post-impressionism',
  'post-impressionism': 'post-impressionism',
  'postimpressionism': 'post-impressionism',
  '후기인상주의': 'post-impressionism',
  
  'fauvism': 'fauvism',
  '야수파': 'fauvism',
  
  'expressionism': 'expressionism',
  '표현주의': 'expressionism',
  
  'modernism': 'modernism',
  '모더니즘': 'modernism',
  
  // ===== 거장 별칭 =====
  'vangogh': 'vangogh',
  'van gogh': 'vangogh',
  'vincent van gogh': 'vangogh',
  '반 고흐': 'vangogh',
  '빈센트 반 고흐': 'vangogh',
  'gogh': 'vangogh',
  
  'klimt': 'klimt',
  'gustav klimt': 'klimt',
  '클림트': 'klimt',
  '구스타프 클림트': 'klimt',
  
  'munch': 'munch',
  'edvard munch': 'munch',
  '뭉크': 'munch',
  '에드바르 뭉크': 'munch',
  
  'matisse': 'matisse',
  'henri matisse': 'matisse',
  '마티스': 'matisse',
  '앙리 마티스': 'matisse',
  
  'chagall': 'chagall',
  'marc chagall': 'chagall',
  '샤갈': 'chagall',
  '마르크 샤갈': 'chagall',
  
  'frida': 'frida',
  'frida kahlo': 'frida',
  '프리다': 'frida',
  '프리다 칼로': 'frida',
  
  'lichtenstein': 'lichtenstein',
  'roy lichtenstein': 'lichtenstein',
  '리히텐슈타인': 'lichtenstein',
  '로이 리히텐슈타인': 'lichtenstein',
  
  // ===== 동양화 별칭 =====
  'korean-minhwa': 'korean-minhwa',
  'korean_minhwa': 'korean-minhwa',
  'korean minhwa': 'korean-minhwa',
  'koreanminhwa': 'korean-minhwa',
  'minhwa': 'korean-minhwa',
  '민화': 'korean-minhwa',
  '한국 민화': 'korean-minhwa',
  
  'korean-pungsokdo': 'korean-pungsokdo',
  'korean_pungsokdo': 'korean-pungsokdo',
  'korean pungsokdo': 'korean-pungsokdo',
  'koreanpungsokdo': 'korean-pungsokdo',
  'korean-genre': 'korean-pungsokdo',
  'korean_genre': 'korean-pungsokdo',
  'pungsokdo': 'korean-pungsokdo',
  '풍속도': 'korean-pungsokdo',
  '한국 풍속도': 'korean-pungsokdo',
  
  'korean-jingyeong': 'korean-jingyeong',
  'korean_jingyeong': 'korean-jingyeong',
  'korean jingyeong': 'korean-jingyeong',
  'koreanjingyeong': 'korean-jingyeong',
  'jingyeong': 'korean-jingyeong',
  '진경산수': 'korean-jingyeong',
  '한국 진경산수': 'korean-jingyeong',
  
  'chinese-ink': 'chinese-ink',
  'chinese_ink': 'chinese-ink',
  'chinese ink': 'chinese-ink',
  'chineseink': 'chinese-ink',
  'shuimohua': 'chinese-ink',
  '수묵화': 'chinese-ink',
  '중국 수묵화': 'chinese-ink',
  
  'chinese-gongbi': 'chinese-gongbi',
  'chinese_gongbi': 'chinese-gongbi',
  'chinese gongbi': 'chinese-gongbi',
  'chinesegongbi': 'chinese-gongbi',
  'gongbi': 'chinese-gongbi',
  '공필화': 'chinese-gongbi',
  '중국 공필화': 'chinese-gongbi',
  
  'japanese-ukiyoe': 'japanese-ukiyoe',
  'japanese_ukiyoe': 'japanese-ukiyoe',
  'japanese ukiyoe': 'japanese-ukiyoe',
  'japaneseukiyoe': 'japanese-ukiyoe',
  'ukiyoe': 'japanese-ukiyoe',
  '우키요에': 'japanese-ukiyoe',
  '일본 우키요에': 'japanese-ukiyoe',
  '일본우키요에': 'japanese-ukiyoe',
  
  // ===== 화가 별칭 (37명) =====
  'classical sculpture': 'classical-sculpture',
  'classical-sculpture': 'classical-sculpture',
  'ancient-greek-sculpture': 'classical-sculpture',
  '고대 그리스 조각': 'classical-sculpture',
  '그리스 조각': 'classical-sculpture',
  
  'roman mosaic': 'roman-mosaic',
  'roman-mosaic': 'roman-mosaic',
  '로마 모자이크': 'roman-mosaic',
  
  'byzantine': 'byzantine',
  '비잔틴': 'byzantine',
  '비잔틴 미술': 'byzantine',
  
  'gothic': 'gothic',
  '고딕': 'gothic',
  '고딕 미술': 'gothic',
  
  'islamic miniature': 'islamic-miniature',
  'islamic-miniature': 'islamic-miniature',
  '이슬람 세밀화': 'islamic-miniature',
  
  'leonardo': 'leonardo',
  'leonardo da vinci': 'leonardo',
  '레오나르도': 'leonardo',
  '다빈치': 'leonardo',
  
  'michelangelo': 'michelangelo',
  '미켈란젤로': 'michelangelo',
  
  'raphael': 'raphael',
  '라파엘로': 'raphael',
  '라파엘': 'raphael',
  
  'botticelli': 'botticelli',
  '보티첼리': 'botticelli',
  
  'titian': 'titian',
  '티치아노': 'titian',
  
  'caravaggio': 'caravaggio',
  '카라바조': 'caravaggio',
  
  'rembrandt': 'rembrandt',
  '렘브란트': 'rembrandt',
  
  'velazquez': 'velazquez',
  'velázquez': 'velazquez',
  '벨라스케스': 'velazquez',
  
  'rubens': 'rubens',
  '루벤스': 'rubens',
  
  'watteau': 'watteau',
  '와토': 'watteau',
  
  'boucher': 'boucher',
  '부셰': 'boucher',
  
  'david': 'david',
  'jacques-louis david': 'david',
  '다비드': 'david',
  
  'ingres': 'ingres',
  '앵그르': 'ingres',
  
  'turner': 'turner',
  '터너': 'turner',
  
  'delacroix': 'delacroix',
  '들라크루아': 'delacroix',
  
  'courbet': 'courbet',
  '쿠르베': 'courbet',
  
  'manet': 'manet',
  '마네': 'manet',
  
  'monet': 'monet',
  'claude monet': 'monet',
  '모네': 'monet',
  
  'renoir': 'renoir',
  '르누아르': 'renoir',
  
  'degas': 'degas',
  '드가': 'degas',
  
  'caillebotte': 'caillebotte',
  '카유보트': 'caillebotte',
  
  'gauguin': 'gauguin',
  '고갱': 'gauguin',
  
  'cezanne': 'cezanne',
  '세잔': 'cezanne',
  
  'derain': 'derain',
  '드랭': 'derain',
  
  'vlaminck': 'vlaminck',
  '블라맹크': 'vlaminck',
  
  'kirchner': 'kirchner',
  '키르히너': 'kirchner',
  
  'kokoschka': 'kokoschka',
  '코코슈카': 'kokoschka',
  
  'picasso': 'picasso',
  '피카소': 'picasso',
  
  'magritte': 'magritte',
  '마그리트': 'magritte',
  
  'miro': 'miro',
  '미로': 'miro'
};

// ========================================
// 3. 키 정규화 함수
// ========================================
export function normalizeKey(input) {
  if (!input) return '';
  
  const lower = input.toLowerCase().trim();
  
  // 별칭 테이블에서 찾기
  if (ALIASES[lower]) {
    return ALIASES[lower];
  }
  
  // 언더스코어 → 하이픈 변환 후 다시 찾기
  const hyphenated = lower.replace(/_/g, '-');
  if (ALIASES[hyphenated]) {
    return ALIASES[hyphenated];
  }
  
  // 그대로 반환 (표준 키일 수 있음)
  return lower;
}

// ========================================
// 4. 3줄 표시 정보 (THREE_LINE_DISPLAY)
// ========================================
// 변환중 화면 + 결과 화면 통일

export const THREE_LINE_DISPLAY = {
  // ===== 거장 (7명) =====
  // 1줄: 화가명(영문, 생몰)
  // 2줄: 사조, 국가
  // 3줄: 대표작 3개
  masters: {
    'vangogh': {
      line1: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)',
      line2: '후기인상주의, 네덜란드',
      line3: '별이 빛나는 밤 · 해바라기 · 아를의 침실'
    },
    'klimt': {
      line1: '구스타프 클림트(Gustav Klimt, 1862~1918)',
      line2: '아르누보, 오스트리아',
      line3: '키스 · 아델레 블로흐-바우어의 초상 · 생명의 나무'
    },
    'munch': {
      line1: '에드바르 뭉크(Edvard Munch, 1863~1944)',
      line2: '표현주의, 노르웨이',
      line3: '절규 · 마돈나 · 사춘기'
    },
    'matisse': {
      line1: '앙리 마티스(Henri Matisse, 1869~1954)',
      line2: '야수파, 프랑스',
      line3: '춤 · 붉은 방 · 푸른 누드'
    },
    'chagall': {
      line1: '마르크 샤갈(Marc Chagall, 1887~1985)',
      line2: '초현실주의, 러시아/프랑스',
      line3: '마을 위에서 · 나와 마을 · 생일'
    },
    'frida': {
      line1: '프리다 칼로(Frida Kahlo, 1907~1954)',
      line2: '초현실주의, 멕시코',
      line3: '부러진 기둥 · 가시목걸이 자화상 · 헨리 포드 병원'
    },
    'lichtenstein': {
      line1: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)',
      line2: '팝아트, 미국',
      line3: 'Whaam! · 익사하는 소녀 · 행복한 눈물'
    }
  },
  
  // ===== 사조 (11개) =====
  // 1줄: 사조(영문, 시기)
  // 2줄: 대표화가 3명
  // 3줄: 역사적 배경
  movements: {
    'greco-roman': {
      line1: '그리스·로마(Greco-Roman, BC~AD 4세기)',
      line2: '그리스 조각 · 로마 모자이크',
      line3: '민주주의 탄생, 올림픽 시작'
    },
    'medieval-art': {
      line1: '중세 미술(Medieval, 5~15세기)',
      line2: '비잔틴 · 고딕 · 이슬람 세밀화',
      line3: '기독교 확산, 십자군 전쟁'
    },
    'renaissance': {
      line1: '르네상스(Renaissance, 14~16세기)',
      line2: '다빈치 · 미켈란젤로 · 보티첼리',
      line3: '인문주의 부흥, 종교개혁'
    },
    'baroque': {
      line1: '바로크(Baroque, 17~18세기)',
      line2: '카라바조 · 렘브란트 · 벨라스케스',
      line3: '반종교개혁, 절대왕정'
    },
    'rococo': {
      line1: '로코코(Rococo, 18세기)',
      line2: '와토 · 부셰 · 프라고나르',
      line3: '귀족 문화의 절정'
    },
    'neoclassicism-romanticism-realism': {
      line1: '신고전·낭만·사실주의(18~19세기)',
      line2: '다비드 · 들라크루아 · 쿠르베',
      line3: '프랑스 혁명, 산업혁명'
    },
    'impressionism': {
      line1: '인상주의(Impressionism, 19세기 후반)',
      line2: '모네 · 르누아르 · 드가',
      line3: '사진의 발명, 튜브 물감 발명'
    },
    'post-impressionism': {
      line1: '후기인상주의(Post-Impressionism, 19세기 말)',
      line2: '반 고흐 · 고갱 · 세잔',
      line3: '인상주의의 한계, 개인 표현 추구'
    },
    'fauvism': {
      line1: '야수파(Fauvism, 20세기 초)',
      line2: '마티스 · 드랭 · 블라맹크',
      line3: '색채 해방, 아카데미 반발'
    },
    'expressionism': {
      line1: '표현주의(Expressionism, 20세기 초)',
      line2: '뭉크 · 키르히너 · 코코슈카',
      line3: '1차 세계대전 전야, 산업화 불안'
    },
    'modernism': {
      line1: '모더니즘(Modernism, 20세기)',
      line2: '피카소 · 마그리트 · 샤갈',
      line3: '세계대전, 과학기술 발전'
    }
  },
  
  // ===== 동양화 (3개 국가) =====
  // 1줄: 국가 전통회화(영문)
  // 2줄: 스타일들
  // 3줄: 한 줄 설명
  oriental: {
    // 한국 (3개 스타일 공통)
    'korean-minhwa': {
      line1: '한국 전통회화(Korean Traditional Painting)',
      line2: '민화 · 풍속도 · 진경산수',
      line3: '복과 장수, 서민의 삶, 조선의 산수'
    },
    'korean-pungsokdo': {
      line1: '한국 전통회화(Korean Traditional Painting)',
      line2: '민화 · 풍속도 · 진경산수',
      line3: '복과 장수, 서민의 삶, 조선의 산수'
    },
    'korean-jingyeong': {
      line1: '한국 전통회화(Korean Traditional Painting)',
      line2: '민화 · 풍속도 · 진경산수',
      line3: '복과 장수, 서민의 삶, 조선의 산수'
    },
    // 중국 (2개 스타일 공통)
    'chinese-ink': {
      line1: '중국 전통회화(Chinese Traditional Painting)',
      line2: '수묵화 · 공필화',
      line3: '먹의 농담과 섬세한 궁정 회화'
    },
    'chinese-gongbi': {
      line1: '중국 전통회화(Chinese Traditional Painting)',
      line2: '수묵화 · 공필화',
      line3: '먹의 농담과 섬세한 궁정 회화'
    },
    // 일본 (1개 스타일)
    'japanese-ukiyoe': {
      line1: '일본 전통회화(Japanese Traditional Painting)',
      line2: '우키요에',
      line3: '떠다니는 세상, 목판화의 예술'
    }
  },
  
  // ===== 사조별 화가 (37명) =====
  // 사조 변환 시 AI가 선택한 화가 표시용
  // 1줄: 사조(영문, 시기) - 부모 사조에서 가져옴
  // 2줄: 화가명(영문)
  // 3줄: 역사적 배경 - 부모 사조에서 가져옴
  artists: {
    // 그리스·로마
    'classical-sculpture': {
      name: '그리스 조각',
      fullName: '그리스 조각(Classical Sculpture)',
      parentMovement: 'greco-roman'
    },
    'roman-mosaic': {
      name: '로마 모자이크',
      fullName: '로마 모자이크(Roman Mosaic)',
      parentMovement: 'greco-roman'
    },
    // 중세
    'byzantine': {
      name: '비잔틴',
      fullName: '비잔틴(Byzantine)',
      parentMovement: 'medieval-art'
    },
    'gothic': {
      name: '고딕',
      fullName: '고딕(Gothic)',
      parentMovement: 'medieval-art'
    },
    'islamic-miniature': {
      name: '이슬람 세밀화',
      fullName: '이슬람 세밀화(Islamic Miniature)',
      parentMovement: 'medieval-art'
    },
    // 르네상스
    'leonardo': {
      name: '레오나르도 다 빈치',
      fullName: '레오나르도 다 빈치(Leonardo da Vinci)',
      parentMovement: 'renaissance'
    },
    'michelangelo': {
      name: '미켈란젤로',
      fullName: '미켈란젤로(Michelangelo)',
      parentMovement: 'renaissance'
    },
    'raphael': {
      name: '라파엘로',
      fullName: '라파엘로(Raphael)',
      parentMovement: 'renaissance'
    },
    'botticelli': {
      name: '보티첼리',
      fullName: '보티첼리(Botticelli)',
      parentMovement: 'renaissance'
    },
    'titian': {
      name: '티치아노',
      fullName: '티치아노(Titian)',
      parentMovement: 'renaissance'
    },
    // 바로크
    'caravaggio': {
      name: '카라바조',
      fullName: '카라바조(Caravaggio)',
      parentMovement: 'baroque'
    },
    'rembrandt': {
      name: '렘브란트',
      fullName: '렘브란트(Rembrandt)',
      parentMovement: 'baroque'
    },
    'velazquez': {
      name: '벨라스케스',
      fullName: '벨라스케스(Velázquez)',
      parentMovement: 'baroque'
    },
    'rubens': {
      name: '루벤스',
      fullName: '루벤스(Rubens)',
      parentMovement: 'baroque'
    },
    // 로코코
    'watteau': {
      name: '와토',
      fullName: '와토(Watteau)',
      parentMovement: 'rococo'
    },
    'boucher': {
      name: '부셰',
      fullName: '부셰(Boucher)',
      parentMovement: 'rococo'
    },
    // 신고전·낭만·사실
    'david': {
      name: '다비드',
      fullName: '다비드(David)',
      parentMovement: 'neoclassicism-romanticism-realism'
    },
    'ingres': {
      name: '앵그르',
      fullName: '앵그르(Ingres)',
      parentMovement: 'neoclassicism-romanticism-realism'
    },
    'turner': {
      name: '터너',
      fullName: '터너(Turner)',
      parentMovement: 'neoclassicism-romanticism-realism'
    },
    'delacroix': {
      name: '들라크루아',
      fullName: '들라크루아(Delacroix)',
      parentMovement: 'neoclassicism-romanticism-realism'
    },
    'courbet': {
      name: '쿠르베',
      fullName: '쿠르베(Courbet)',
      parentMovement: 'neoclassicism-romanticism-realism'
    },
    'manet': {
      name: '마네',
      fullName: '마네(Manet)',
      parentMovement: 'neoclassicism-romanticism-realism'
    },
    // 인상주의
    'monet': {
      name: '모네',
      fullName: '모네(Monet)',
      parentMovement: 'impressionism'
    },
    'renoir': {
      name: '르누아르',
      fullName: '르누아르(Renoir)',
      parentMovement: 'impressionism'
    },
    'degas': {
      name: '드가',
      fullName: '드가(Degas)',
      parentMovement: 'impressionism'
    },
    'caillebotte': {
      name: '카유보트',
      fullName: '카유보트(Caillebotte)',
      parentMovement: 'impressionism'
    },
    // 후기인상주의
    'gauguin': {
      name: '고갱',
      fullName: '고갱(Gauguin)',
      parentMovement: 'post-impressionism'
    },
    'cezanne': {
      name: '세잔',
      fullName: '세잔(Cézanne)',
      parentMovement: 'post-impressionism'
    },
    // 야수파
    'derain': {
      name: '드랭',
      fullName: '드랭(Derain)',
      parentMovement: 'fauvism'
    },
    'vlaminck': {
      name: '블라맹크',
      fullName: '블라맹크(Vlaminck)',
      parentMovement: 'fauvism'
    },
    // 표현주의
    'kirchner': {
      name: '키르히너',
      fullName: '키르히너(Kirchner)',
      parentMovement: 'expressionism'
    },
    'kokoschka': {
      name: '코코슈카',
      fullName: '코코슈카(Kokoschka)',
      parentMovement: 'expressionism'
    },
    // 모더니즘
    'picasso': {
      name: '피카소',
      fullName: '피카소(Picasso)',
      parentMovement: 'modernism'
    },
    'magritte': {
      name: '마그리트',
      fullName: '마그리트(Magritte)',
      parentMovement: 'modernism'
    },
    'miro': {
      name: '미로',
      fullName: '미로(Miró)',
      parentMovement: 'modernism'
    }
  }
};

// ========================================
// 5. 교육자료 키 매핑
// ========================================
export const EDUCATION_KEY_MAP = {
  movements: {
    'greco-roman': 'greco-roman',
    'medieval-art': 'medieval-art',
    'renaissance': 'renaissance',
    'baroque': 'baroque',
    'rococo': 'rococo',
    'neoclassicism-romanticism-realism': 'neoclassicism-romanticism-realism',
    'impressionism': 'impressionism',
    'post-impressionism': 'post-impressionism',
    'fauvism': 'fauvism',
    'expressionism': 'expressionism',
    'modernism': 'modernism'
  },
  masters: {
    'vangogh': 'vangogh',
    'klimt': 'klimt',
    'munch': 'munch',
    'matisse': 'matisse',
    'chagall': 'chagall',
    'frida': 'frida',
    'lichtenstein': 'lichtenstein'
  },
  oriental: {
    'korean-minhwa': 'korean-minhwa',
    'korean-pungsokdo': 'korean-pungsokdo',
    'korean-jingyeong': 'korean-jingyeong',
    'chinese-ink': 'chinese-ink',
    'chinese-gongbi': 'chinese-gongbi',
    'japanese-ukiyoe': 'japanese-ukiyoe'
  }
};

// ========================================
// 6. 유틸리티 함수
// ========================================

/**
 * 3줄 표시 정보 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} key - 정규화 전/후 키
 * @param {string} artistKey - (사조 변환 시) AI가 선택한 화가 키
 * @returns {object} { line1, line2, line3 }
 */
export function getThreeLineDisplay(category, key, artistKey = null) {
  const normalizedKey = normalizeKey(key);
  
  // 거장/동양화는 바로 반환
  if (category === 'masters' || category === 'oriental') {
    const info = THREE_LINE_DISPLAY[category]?.[normalizedKey];
    if (info) {
      return { line1: info.line1, line2: info.line2, line3: info.line3 };
    }
  }
  
  // 사조: 항상 대표화가 3명 표시 (AI 선택 화가는 교육자료에서 표시)
  if (category === 'movements') {
    const movementInfo = THREE_LINE_DISPLAY.movements[normalizedKey];
    if (!movementInfo) {
      return { line1: key, line2: '', line3: '' };
    }
    
    // 항상 기본 (대표화가 3명) 반환
    return {
      line1: movementInfo.line1,
      line2: movementInfo.line2,
      line3: movementInfo.line3
    };
  }
  
  return { line1: key, line2: '', line3: '' };
}

/**
 * 화가 이름 가져오기 (사조 변환 시 AI 선택 화가)
 * @param {string} artistKey - 화가 키
 * @returns {object} { name, fullName, parentMovement }
 */
export function getArtistName(artistKey) {
  const normalizedKey = normalizeKey(artistKey);
  const artistInfo = THREE_LINE_DISPLAY.artists[normalizedKey];
  
  if (!artistInfo) {
    return { name: artistKey, fullName: artistKey, parentMovement: null };
  }
  
  return artistInfo;
}

/**
 * 교육자료 키 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} key - 정규화 전 키
 */
export function getEducationKey(category, key) {
  const normalizedKey = normalizeKey(key);
  const categoryMap = EDUCATION_KEY_MAP[category];
  
  if (!categoryMap) return normalizedKey;
  
  return categoryMap[normalizedKey] || normalizedKey;
}

/**
 * 카테고리 판별
 * @param {string} key - 아무 키
 * @returns {string|null} - 'movements' | 'masters' | 'oriental' | 'artists' | null
 */
export function detectCategory(key) {
  const normalizedKey = normalizeKey(key);
  
  if (STANDARD_KEYS.movements.includes(normalizedKey)) return 'movements';
  if (STANDARD_KEYS.masters.includes(normalizedKey)) return 'masters';
  if (STANDARD_KEYS.oriental.includes(normalizedKey)) return 'oriental';
  if (STANDARD_KEYS.artists.includes(normalizedKey)) return 'artists';
  
  return null;
}

/**
 * (하위 호환성) 기존 getDisplayInfo 대체
 * @deprecated getThreeLineDisplay 사용 권장
 */
export function getDisplayInfo(category, key, screen = 'loading') {
  const threeLines = getThreeLineDisplay(category, key);
  return {
    title: threeLines.line1,
    subtitle: threeLines.line2
  };
}

export default {
  STANDARD_KEYS,
  ALIASES,
  THREE_LINE_DISPLAY,
  EDUCATION_KEY_MAP,
  normalizeKey,
  getThreeLineDisplay,
  getArtistName,
  getEducationKey,
  detectCategory,
  getDisplayInfo
};
