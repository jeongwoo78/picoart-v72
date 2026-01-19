// ========================================
// displayConfig.js - 매칭 시스템 컨트롤 타워
// v72 - 2026-01-19
// ========================================
// 
// 모든 키 정규화, 별칭 매핑, 표시 정보를 한 곳에서 관리
// API 응답 → 정규화 → 교육자료/UI 표시
//
// v72: 화가 풀네임 별칭 추가 (Sandro Botticelli → botticelli 등)
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
  // 그리스·로마
  'ancient': 'greco-roman',
  'ancient-art': 'greco-roman',
  'greek-roman': 'greco-roman',
  'greco-roman': 'greco-roman',
  
  // 중세
  'medieval': 'medieval-art',
  'medieval-art': 'medieval-art',
  
  // 르네상스
  'renaissance': 'renaissance',
  
  // 바로크
  'baroque': 'baroque',
  
  // 로코코
  'rococo': 'rococo',
  
  // 신고전·낭만·사실
  'neoclassicism_vs_romanticism_vs_realism': 'neoclassicism-romanticism-realism',
  'neoclassicism-romanticism-realism': 'neoclassicism-romanticism-realism',
  'neoclassicism': 'neoclassicism-romanticism-realism',
  
  // 인상주의
  'impressionism': 'impressionism',
  
  // 후기인상주의
  'postImpressionism': 'post-impressionism',
  'post-impressionism': 'post-impressionism',
  'postimpressionism': 'post-impressionism',
  
  // 야수파
  'fauvism': 'fauvism',
  
  // 표현주의
  'expressionism': 'expressionism',
  
  // 모더니즘
  'modernism': 'modernism',
  
  // ===== 거장 별칭 =====
  // 반 고흐
  'vangogh': 'vangogh',
  'van gogh': 'vangogh',
  'vincent van gogh': 'vangogh',
  'vincentvangogh': 'vangogh',
  '반 고흐': 'vangogh',
  '반고흐': 'vangogh',
  '빈센트 반 고흐': 'vangogh',
  '빈센트반고흐': 'vangogh',
  'gogh': 'vangogh',
  '고흐': 'vangogh',
  'vincent': 'vangogh',
  '빈센트': 'vangogh',
  
  // 클림트
  'klimt': 'klimt',
  'gustav klimt': 'klimt',
  'gustavklimt': 'klimt',
  '클림트': 'klimt',
  '구스타프 클림트': 'klimt',
  '구스타프클림트': 'klimt',
  
  // 뭉크
  'munch': 'munch',
  'edvard munch': 'munch',
  'edvardmunch': 'munch',
  '뭉크': 'munch',
  '에드바르 뭉크': 'munch',
  '에드바르뭉크': 'munch',
  
  // 마티스
  'matisse': 'matisse',
  'henri matisse': 'matisse',
  'henrimatisse': 'matisse',
  '마티스': 'matisse',
  '앙리 마티스': 'matisse',
  '앙리마티스': 'matisse',
  
  // 샤갈
  'chagall': 'chagall',
  'marc chagall': 'chagall',
  'marcchagall': 'chagall',
  '샤갈': 'chagall',
  '마르크 샤갈': 'chagall',
  '마르크샤갈': 'chagall',
  
  // 프리다
  'frida': 'frida',
  'frida kahlo': 'frida',
  'fridakahlo': 'frida',
  '프리다': 'frida',
  '프리다 칼로': 'frida',
  '프리다칼로': 'frida',
  
  // 리히텐슈타인
  'lichtenstein': 'lichtenstein',
  'roy lichtenstein': 'lichtenstein',
  'roylichtenstein': 'lichtenstein',
  '리히텐슈타인': 'lichtenstein',
  '로이 리히텐슈타인': 'lichtenstein',
  '로이리히텐슈타인': 'lichtenstein',
  
  // ===== 동양화 별칭 =====
  // 한국 - 민화
  'korean-minhwa': 'korean-minhwa',
  'korean_minhwa': 'korean-minhwa',
  'korean minhwa': 'korean-minhwa',
  'korean minhwa folk painting': 'korean-minhwa',
  'koreanminhwa': 'korean-minhwa',
  'minhwa': 'korean-minhwa',
  'minhwa folk painting': 'korean-minhwa',
  '민화': 'korean-minhwa',
  '한국 민화': 'korean-minhwa',
  '한국민화': 'korean-minhwa',
  
  // 한국 - 풍속도
  'korean-pungsokdo': 'korean-pungsokdo',
  'korean_pungsokdo': 'korean-pungsokdo',
  'korean pungsokdo': 'korean-pungsokdo',
  'korean pungsokdo genre painting': 'korean-pungsokdo',
  'koreanpungsokdo': 'korean-pungsokdo',
  'korean-genre': 'korean-pungsokdo',
  'korean_genre': 'korean-pungsokdo',
  'korean genre painting': 'korean-pungsokdo',
  'pungsokdo': 'korean-pungsokdo',
  'pungsokdo genre painting': 'korean-pungsokdo',
  '풍속도': 'korean-pungsokdo',
  '한국 풍속도': 'korean-pungsokdo',
  '한국풍속도': 'korean-pungsokdo',
  
  // 한국 - 진경산수
  'korean-jingyeong': 'korean-jingyeong',
  'korean_jingyeong': 'korean-jingyeong',
  'korean jingyeong': 'korean-jingyeong',
  'korean jingyeong landscape': 'korean-jingyeong',
  'koreanjingyeonglandscape': 'korean-jingyeong',
  'jingyeong': 'korean-jingyeong',
  'jingyeong landscape': 'korean-jingyeong',
  '진경산수': 'korean-jingyeong',
  '진경산수화': 'korean-jingyeong',
  '한국 진경산수': 'korean-jingyeong',
  '한국진경산수': 'korean-jingyeong',
  
  // 중국 - 수묵화
  'chinese-ink': 'chinese-ink',
  'chinese_ink': 'chinese-ink',
  'chinese ink': 'chinese-ink',
  'chinese ink wash': 'chinese-ink',
  'chineseinkwash': 'chinese-ink',
  'ink wash': 'chinese-ink',
  'shuimohua': 'chinese-ink',
  '수묵화': 'chinese-ink',
  '중국 수묵화': 'chinese-ink',
  '중국수묵화': 'chinese-ink',
  
  // 중국 - 공필화
  'chinese-gongbi': 'chinese-gongbi',
  'chinese_gongbi': 'chinese-gongbi',
  'chinese gongbi': 'chinese-gongbi',
  'chinese gongbi meticulous painting': 'chinese-gongbi',
  'chinesegongbi': 'chinese-gongbi',
  'gongbi': 'chinese-gongbi',
  'gongbi meticulous painting': 'chinese-gongbi',
  '공필화': 'chinese-gongbi',
  '중국 공필화': 'chinese-gongbi',
  '중국공필화': 'chinese-gongbi',
  
  // 일본 - 우키요에
  'japanese-ukiyoe': 'japanese-ukiyoe',
  'japanese_ukiyoe': 'japanese-ukiyoe',
  'japanese ukiyoe': 'japanese-ukiyoe',
  'japanese ukiyo-e': 'japanese-ukiyoe',
  'japaneseukiyoe': 'japanese-ukiyoe',
  'ukiyoe': 'japanese-ukiyoe',
  'ukiyo-e': 'japanese-ukiyoe',
  'japanese ukiyo-e woodblock': 'japanese-ukiyoe',
  '우키요에': 'japanese-ukiyoe',
  '일본 우키요에': 'japanese-ukiyoe',
  '일본우키요에': 'japanese-ukiyoe',
  
  // ===== 화가 별칭 (37명) =====
  // 그리스·로마
  'classical sculpture': 'classical-sculpture',
  'classical-sculpture': 'classical-sculpture',
  'ancient-greek-sculpture': 'classical-sculpture',
  '고대 그리스 조각': 'classical-sculpture',
  
  'roman mosaic': 'roman-mosaic',
  'roman-mosaic': 'roman-mosaic',
  '로마 모자이크': 'roman-mosaic',
  
  // 중세
  'byzantine': 'byzantine',
  '비잔틴': 'byzantine',
  '비잔틴 미술': 'byzantine',
  
  'gothic': 'gothic',
  '고딕': 'gothic',
  '고딕 미술': 'gothic',
  
  'islamic miniature': 'islamic-miniature',
  'islamic-miniature': 'islamic-miniature',
  '이슬람 세밀화': 'islamic-miniature',
  
  // 르네상스
  'leonardo': 'leonardo',
  'leonardo da vinci': 'leonardo',
  'leonardodavinci': 'leonardo',
  'davinci': 'leonardo',
  '레오나르도': 'leonardo',
  '다빈치': 'leonardo',
  '레오나르도다빈치': 'leonardo',
  
  'michelangelo': 'michelangelo',
  'michelangelo buonarroti': 'michelangelo',
  '미켈란젤로': 'michelangelo',
  
  'raphael': 'raphael',
  'raphael sanzio': 'raphael',
  'raffaello sanzio': 'raphael',
  '라파엘로': 'raphael',
  '라파엘': 'raphael',
  
  'botticelli': 'botticelli',
  'sandro botticelli': 'botticelli',
  'sandrobotticelli': 'botticelli',
  '보티첼리': 'botticelli',
  
  'titian': 'titian',
  'tiziano': 'titian',
  'tiziano vecellio': 'titian',
  '티치아노': 'titian',
  
  // 바로크
  'caravaggio': 'caravaggio',
  '카라바조': 'caravaggio',
  
  'rembrandt': 'rembrandt',
  'rembrandt van rijn': 'rembrandt',
  '렘브란트': 'rembrandt',
  
  'velazquez': 'velazquez',
  'velázquez': 'velazquez',
  'diego velazquez': 'velazquez',
  'diego velázquez': 'velazquez',
  'diegovelazquez': 'velazquez',
  '벨라스케스': 'velazquez',
  
  'rubens': 'rubens',
  'peter paul rubens': 'rubens',
  'peterpaulrubens': 'rubens',
  '루벤스': 'rubens',
  
  // 로코코
  'watteau': 'watteau',
  'jean-antoine watteau': 'watteau',
  'jeanantoinewatteau': 'watteau',
  'antoinewatteau': 'watteau',
  '와토': 'watteau',
  
  'boucher': 'boucher',
  'françois boucher': 'boucher',
  'francois boucher': 'boucher',
  'francoisboucher': 'boucher',
  '부셰': 'boucher',
  
  // 신고전·낭만·사실
  'david': 'david',
  'jacques-louis david': 'david',
  'jacqueslouisdavid': 'david',
  '다비드': 'david',
  
  'ingres': 'ingres',
  'jean-auguste-dominique ingres': 'ingres',
  'jeanaugustdominiqueingres': 'ingres',
  'jeanaugustedominiqueingres': 'ingres',
  '앵그르': 'ingres',
  
  'turner': 'turner',
  'j.m.w. turner': 'turner',
  'jmw turner': 'turner',
  'jmwturner': 'turner',
  'william turner': 'turner',
  '터너': 'turner',
  
  'delacroix': 'delacroix',
  'eugene delacroix': 'delacroix',
  'eugène delacroix': 'delacroix',
  'eugenedelacroix': 'delacroix',
  '들라크루아': 'delacroix',
  
  'courbet': 'courbet',
  'gustave courbet': 'courbet',
  'gustavecourbet': 'courbet',
  '쿠르베': 'courbet',
  
  'manet': 'manet',
  'edouard manet': 'manet',
  'édouard manet': 'manet',
  'edouardmanet': 'manet',
  '마네': 'manet',
  
  // 인상주의
  'monet': 'monet',
  'claude monet': 'monet',
  'claudemonet': 'monet',
  '모네': 'monet',
  '클로드모네': 'monet',
  
  'renoir': 'renoir',
  'pierre-auguste renoir': 'renoir',
  'pierreaugusterenoir': 'renoir',
  '르누아르': 'renoir',
  '피에르오귀스트르누아르': 'renoir',
  
  'degas': 'degas',
  'edgar degas': 'degas',
  'edgardegas': 'degas',
  '드가': 'degas',
  '에드가드가': 'degas',
  
  'caillebotte': 'caillebotte',
  'gustave caillebotte': 'caillebotte',
  'gustavecaillebotte': 'caillebotte',
  '카유보트': 'caillebotte',
  '귀스타브카유보트': 'caillebotte',
  
  // 후기인상주의
  'gauguin': 'gauguin',
  'paul gauguin': 'gauguin',
  'paulgauguin': 'gauguin',
  '고갱': 'gauguin',
  '폴고갱': 'gauguin',
  
  'cezanne': 'cezanne',
  'cézanne': 'cezanne',
  'paul cezanne': 'cezanne',
  'paul cézanne': 'cezanne',
  'paulcezanne': 'cezanne',
  '세잔': 'cezanne',
  '폴세잔': 'cezanne',
  
  // 야수파
  'derain': 'derain',
  'andre derain': 'derain',
  'andré derain': 'derain',
  'andrederain': 'derain',
  '드랭': 'derain',
  
  'vlaminck': 'vlaminck',
  'maurice de vlaminck': 'vlaminck',
  'mauricedevlaminck': 'vlaminck',
  '블라맹크': 'vlaminck',
  
  // 표현주의
  'kirchner': 'kirchner',
  'ernst ludwig kirchner': 'kirchner',
  'ernstludwigkirchner': 'kirchner',
  '키르히너': 'kirchner',
  
  'kokoschka': 'kokoschka',
  'oskar kokoschka': 'kokoschka',
  'oskarkokoschka': 'kokoschka',
  '코코슈카': 'kokoschka',
  
  // 모더니즘
  'picasso': 'picasso',
  'pablo picasso': 'picasso',
  'pablopicasso': 'picasso',
  '피카소': 'picasso',
  '파블로피카소': 'picasso',
  
  'magritte': 'magritte',
  'rene magritte': 'magritte',
  'rené magritte': 'magritte',
  'renemagritte': 'magritte',
  '마그리트': 'magritte',
  '르네마그리트': 'magritte',
  
  'miro': 'miro',
  'miró': 'miro',
  'joan miro': 'miro',
  'joan miró': 'miro',
  'joanmiro': 'miro',
  '미로': 'miro',
  '호안미로': 'miro'
};

// ========================================
// 3. 정규화 함수
// ========================================
export function normalizeKey(input) {
  if (!input) return null;
  
  // 소문자 변환 + 앞뒤 공백 제거
  const lower = input.toLowerCase().trim();
  
  // 1차: 별칭 테이블에서 직접 찾기
  if (ALIASES[lower]) {
    return ALIASES[lower];
  }
  
  // 2차: 언더스코어 → 하이픈 변환 후 찾기
  const hyphenated = lower.replace(/_/g, '-');
  if (ALIASES[hyphenated]) {
    return ALIASES[hyphenated];
  }
  
  // 3차: 공백/하이픈 모두 제거 후 찾기 (v65 호환)
  // "Sandro Botticelli" → "sandrobotticelli" → "botticelli"
  const collapsed = lower.replace(/[\s-]/g, '');
  if (ALIASES[collapsed]) {
    return ALIASES[collapsed];
  }
  
  // 그대로 반환 (표준 키일 수 있음)
  return lower;
}

// ========================================
// 4. 표시 정보 (DISPLAY_INFO)
// ========================================
// 로딩 화면, 결과 화면에서 사용할 제목/부제목
export const DISPLAY_INFO = {
  // ===== 사조 =====
  movements: {
    'greco-roman': {
      loading: { title: '고대 그리스·로마', subtitle: '고대 그리스 조각 · 로마 모자이크' },
      result: { title: '고대 그리스·로마' }
    },
    'medieval-art': {
      loading: { title: '중세 미술', subtitle: '비잔틴 · 고딕 · 이슬람 세밀화' },
      result: { title: '중세 미술' }
    },
    'renaissance': {
      loading: { title: '르네상스', subtitle: '다빈치 · 미켈란젤로 · 보티첼리' },
      result: { title: '르네상스' }
    },
    'baroque': {
      loading: { title: '바로크', subtitle: '카라바조 · 렘브란트 · 벨라스케스' },
      result: { title: '바로크' }
    },
    'rococo': {
      loading: { title: '로코코', subtitle: '와토 · 부셰' },
      result: { title: '로코코' }
    },
    'neoclassicism-romanticism-realism': {
      loading: { title: '신고전·낭만·사실주의', subtitle: '다비드 · 들라크루아 · 쿠르베' },
      result: { title: '신고전·낭만·사실주의' }
    },
    'impressionism': {
      loading: { title: '인상주의', subtitle: '모네 · 르누아르 · 드가' },
      result: { title: '인상주의' }
    },
    'post-impressionism': {
      loading: { title: '후기인상주의', subtitle: '반 고흐 · 고갱 · 세잔' },
      result: { title: '후기인상주의' }
    },
    'fauvism': {
      loading: { title: '야수파', subtitle: '마티스 · 드랭 · 블라맹크' },
      result: { title: '야수파' }
    },
    'expressionism': {
      loading: { title: '표현주의', subtitle: '뭉크 · 키르히너 · 코코슈카' },
      result: { title: '표현주의' }
    },
    'modernism': {
      loading: { title: '모더니즘', subtitle: '피카소 · 마그리트 · 샤갈' },
      result: { title: '모더니즘' }
    }
  },
  
  // ===== 거장 =====
  masters: {
    'vangogh': {
      loading: { title: '빈센트 반 고흐', subtitle: 'Vincent van Gogh' },
      result: { title: '반 고흐' }
    },
    'klimt': {
      loading: { title: '구스타프 클림트', subtitle: 'Gustav Klimt' },
      result: { title: '클림트' }
    },
    'munch': {
      loading: { title: '에드바르 뭉크', subtitle: 'Edvard Munch' },
      result: { title: '뭉크' }
    },
    'matisse': {
      loading: { title: '앙리 마티스', subtitle: 'Henri Matisse' },
      result: { title: '마티스' }
    },
    'chagall': {
      loading: { title: '마르크 샤갈', subtitle: 'Marc Chagall' },
      result: { title: '샤갈' }
    },
    'frida': {
      loading: { title: '프리다 칼로', subtitle: 'Frida Kahlo' },
      result: { title: '프리다' }
    },
    'lichtenstein': {
      loading: { title: '로이 리히텐슈타인', subtitle: 'Roy Lichtenstein' },
      result: { title: '리히텐슈타인' }
    }
  },
  
  // ===== 동양화 =====
  oriental: {
    'korean-minhwa': {
      loading: { title: '한국 민화', subtitle: 'Korean Folk Painting' },
      result: { title: '민화' }
    },
    'korean-pungsokdo': {
      loading: { title: '한국 풍속도', subtitle: 'Korean Genre Painting' },
      result: { title: '풍속도' }
    },
    'korean-jingyeong': {
      loading: { title: '한국 진경산수', subtitle: 'Korean True-View Landscape' },
      result: { title: '진경산수' }
    },
    'chinese-ink': {
      loading: { title: '중국 수묵화', subtitle: 'Chinese Ink Painting' },
      result: { title: '수묵화' }
    },
    'chinese-gongbi': {
      loading: { title: '중국 공필화', subtitle: 'Chinese Gongbi' },
      result: { title: '공필화' }
    },
    'japanese-ukiyoe': {
      loading: { title: '일본 우키요에', subtitle: 'Japanese Ukiyo-e' },
      result: { title: '우키요에' }
    }
  },
  
  // ===== 화가 (37명) =====
  artists: {
    // 그리스·로마
    'classical-sculpture': { name: '고대 그리스 조각', fullName: 'Ancient Greek Sculpture' },
    'roman-mosaic': { name: '로마 모자이크', fullName: 'Roman Mosaic' },
    
    // 중세
    'byzantine': { name: '비잔틴 미술', fullName: 'Byzantine Art' },
    'gothic': { name: '고딕 미술', fullName: 'Gothic Art' },
    'islamic-miniature': { name: '이슬람 세밀화', fullName: 'Islamic Miniature' },
    
    // 르네상스
    'leonardo': { name: '레오나르도 다 빈치', fullName: 'Leonardo da Vinci' },
    'michelangelo': { name: '미켈란젤로', fullName: 'Michelangelo Buonarroti' },
    'raphael': { name: '라파엘로', fullName: 'Raphael Sanzio' },
    'botticelli': { name: '보티첼리', fullName: 'Sandro Botticelli' },
    'titian': { name: '티치아노', fullName: 'Titian' },
    
    // 바로크
    'caravaggio': { name: '카라바조', fullName: 'Caravaggio' },
    'rembrandt': { name: '렘브란트', fullName: 'Rembrandt van Rijn' },
    'velazquez': { name: '벨라스케스', fullName: 'Diego Velázquez' },
    'rubens': { name: '루벤스', fullName: 'Peter Paul Rubens' },
    
    // 로코코
    'watteau': { name: '와토', fullName: 'Jean-Antoine Watteau' },
    'boucher': { name: '부셰', fullName: 'François Boucher' },
    
    // 신고전·낭만·사실
    'david': { name: '다비드', fullName: 'Jacques-Louis David' },
    'ingres': { name: '앵그르', fullName: 'Jean-Auguste-Dominique Ingres' },
    'turner': { name: '터너', fullName: 'J.M.W. Turner' },
    'delacroix': { name: '들라크루아', fullName: 'Eugène Delacroix' },
    'courbet': { name: '쿠르베', fullName: 'Gustave Courbet' },
    'manet': { name: '마네', fullName: 'Édouard Manet' },
    
    // 인상주의
    'monet': { name: '모네', fullName: 'Claude Monet' },
    'renoir': { name: '르누아르', fullName: 'Pierre-Auguste Renoir' },
    'degas': { name: '드가', fullName: 'Edgar Degas' },
    'caillebotte': { name: '카유보트', fullName: 'Gustave Caillebotte' },
    
    // 후기인상주의
    'vangogh': { name: '반 고흐', fullName: 'Vincent van Gogh' },
    'gauguin': { name: '고갱', fullName: 'Paul Gauguin' },
    'cezanne': { name: '세잔', fullName: 'Paul Cézanne' },
    
    // 야수파
    'matisse': { name: '마티스', fullName: 'Henri Matisse' },
    'derain': { name: '드랭', fullName: 'André Derain' },
    'vlaminck': { name: '블라맹크', fullName: 'Maurice de Vlaminck' },
    
    // 표현주의
    'munch': { name: '뭉크', fullName: 'Edvard Munch' },
    'kirchner': { name: '키르히너', fullName: 'Ernst Ludwig Kirchner' },
    'kokoschka': { name: '코코슈카', fullName: 'Oskar Kokoschka' },
    
    // 모더니즘
    'picasso': { name: '피카소', fullName: 'Pablo Picasso' },
    'magritte': { name: '마그리트', fullName: 'René Magritte' },
    'miro': { name: '미로', fullName: 'Joan Miró' },
    'chagall': { name: '샤갈', fullName: 'Marc Chagall' },
    'lichtenstein': { name: '리히텐슈타인', fullName: 'Roy Lichtenstein' }
  }
};

// ========================================
// 5. 교육자료 키 매핑
// ========================================
// 어떤 교육자료 파일의 어떤 키를 사용할지
export const EDUCATION_KEY_MAP = {
  // 사조 → movementsEducation.js 키
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
  
  // 거장 → mastersEducation.js 키
  masters: {
    'vangogh': 'vangogh',
    'klimt': 'klimt',
    'munch': 'munch',
    'matisse': 'matisse',
    'chagall': 'chagall',
    'frida': 'frida',
    'lichtenstein': 'lichtenstein'
  },
  
  // 동양화 → orientalEducation.js 키
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
 * 표시 정보 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {string} key - 정규화된 키
 * @param {string} screen - 'loading' | 'result'
 */
export function getDisplayInfo(category, key, screen = 'loading') {
  const normalizedKey = normalizeKey(key);
  const categoryInfo = DISPLAY_INFO[category];
  
  if (!categoryInfo || !categoryInfo[normalizedKey]) {
    return { title: key, subtitle: '' };
  }
  
  return categoryInfo[normalizedKey][screen] || { title: key, subtitle: '' };
}

/**
 * 화가 이름 가져오기
 * @param {string} artistKey - 화가 키 (정규화 전/후 모두 가능)
 */
export function getArtistName(artistKey) {
  const normalizedKey = normalizeKey(artistKey);
  const artistInfo = DISPLAY_INFO.artists[normalizedKey];
  
  if (!artistInfo) {
    return { name: artistKey, fullName: artistKey };
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
 * 사조 결과화면 표시 정보 (제목 + 부제)
 * @param {string} styleName - 사조명 (예: '인상주의')
 * @param {string} artistName - 화가명 (API 응답)
 * @returns {{ title: string, subtitle: string }}
 */
export function getMovementDisplayInfo(styleName, artistName) {
  // 사조 정보
  const movementData = {
    '고대': { en: 'Greco-Roman', period: 'BC~AD 4세기' },
    '고대 그리스-로마': { en: 'Greco-Roman', period: 'BC~AD 4세기' },
    '그리스·로마': { en: 'Greco-Roman', period: 'BC~AD 4세기' },
    '중세': { en: 'Medieval', period: '5~15세기' },
    '중세 미술': { en: 'Medieval', period: '5~15세기' },
    '르네상스': { en: 'Renaissance', period: '14~16세기' },
    '바로크': { en: 'Baroque', period: '17~18세기' },
    '로코코': { en: 'Rococo', period: '18세기' },
    '신고전 vs 낭만 vs 사실주의': { en: 'Neoclassicism·Romanticism·Realism', period: '18~19세기' },
    '신고전주의': { en: 'Neoclassicism', period: '18~19세기' },
    '낭만주의': { en: 'Romanticism', period: '19세기' },
    '사실주의': { en: 'Realism', period: '19세기' },
    '인상주의': { en: 'Impressionism', period: '19세기 말' },
    '후기인상주의': { en: 'Post-Impressionism', period: '19세기 말' },
    '야수파': { en: 'Fauvism', period: '20세기 초' },
    '표현주의': { en: 'Expressionism', period: '20세기 초' },
    '20세기 모더니즘': { en: 'Modernism', period: '20세기' },
    '입체주의': { en: 'Cubism', period: '20세기 초' },
    '초현실주의': { en: 'Surrealism', period: '20세기 초중반' },
    '팝아트': { en: 'Pop Art', period: '20세기 중반' }
  };
  
  // 사조 결정 (신고전/낭만/사실, 모더니즘 세분화)
  let actualMovement = styleName;
  if (artistName) {
    const key = normalizeKey(artistName);
    // 신고전 vs 낭만 vs 사실주의 세분화
    if (styleName === '신고전 vs 낭만 vs 사실주의') {
      if (['david', 'ingres'].includes(key)) actualMovement = '신고전주의';
      else if (['delacroix', 'turner'].includes(key)) actualMovement = '낭만주의';
      else if (['courbet', 'manet'].includes(key)) actualMovement = '사실주의';
    }
    // 모더니즘 세분화
    if (styleName === '20세기 모더니즘') {
      if (key === 'picasso') actualMovement = '입체주의';
      else if (['magritte', 'miro', 'chagall'].includes(key)) actualMovement = '초현실주의';
      else if (key === 'lichtenstein') actualMovement = '팝아트';
    }
  }
  
  const mvInfo = movementData[actualMovement] || { en: styleName, period: '' };
  const title = mvInfo.period ? `${actualMovement}(${mvInfo.en}, ${mvInfo.period})` : `${actualMovement}(${mvInfo.en})`;
  
  // 부제: 화가 풀네임 - 한글명(영문명)
  let subtitle = '';
  if (artistName) {
    const artistKey = normalizeKey(artistName);
    const artistInfo = DISPLAY_INFO.artists[artistKey];
    if (artistInfo) {
      subtitle = `${artistInfo.name}(${artistInfo.fullName})`;
    } else {
      subtitle = artistName;
    }
  }
  
  return { title, subtitle };
}

/**
 * 동양화 결과화면 표시 정보 (제목 + 부제)
 * @param {string} artistName - 스타일명 (API 응답)
 * @returns {{ title: string, subtitle: string }}
 */
export function getOrientalDisplayInfo(artistName) {
  const orientalData = {
    'korean-minhwa': { title: '한국 전통회화(Korean Traditional Painting)', subtitle: '민화(Minhwa)' },
    'korean-pungsokdo': { title: '한국 전통회화(Korean Traditional Painting)', subtitle: '풍속도(Pungsokdo)' },
    'korean-jingyeong': { title: '한국 전통회화(Korean Traditional Painting)', subtitle: '진경산수화(Jingyeong)' },
    'chinese-ink': { title: '중국 전통회화(Chinese Traditional Painting)', subtitle: '수묵화(Ink Wash)' },
    'chinese-gongbi': { title: '중국 전통회화(Chinese Traditional Painting)', subtitle: '공필화(Gongbi)' },
    'japanese-ukiyoe': { title: '일본 전통회화(Japanese Traditional Painting)', subtitle: '우키요에(Ukiyo-e)' }
  };
  
  const key = normalizeKey(artistName);
  return orientalData[key] || { title: '동양화', subtitle: artistName || '' };
}

/**
 * 거장 표시 정보 (제목 + 부제)
 * @param {string} artistName - 거장명
 * @returns {{ fullName: string, movement: string }}
 */
export function getMasterInfo(artistName) {
  const masterData = {
    'vangogh': { fullName: '빈센트 반 고흐(Vincent van Gogh, 1853~1890)', movement: '후기인상주의(Post-Impressionism)' },
    'klimt': { fullName: '구스타프 클림트(Gustav Klimt, 1862~1918)', movement: '아르누보(Art Nouveau)' },
    'munch': { fullName: '에드바르 뭉크(Edvard Munch, 1863~1944)', movement: '표현주의(Expressionism)' },
    'matisse': { fullName: '앙리 마티스(Henri Matisse, 1869~1954)', movement: '야수파(Fauvism)' },
    'chagall': { fullName: '마르크 샤갈(Marc Chagall, 1887~1985)', movement: '초현실주의(Surrealism)' },
    'frida': { fullName: '프리다 칼로(Frida Kahlo, 1907~1954)', movement: '초현실주의(Surrealism)' },
    'lichtenstein': { fullName: '로이 리히텐슈타인(Roy Lichtenstein, 1923~1997)', movement: '팝아트(Pop Art)' }
  };
  
  if (!artistName) return { fullName: '거장', movement: '' };
  const key = normalizeKey(artistName);
  return masterData[key] || { fullName: artistName, movement: '' };
}

export default {
  STANDARD_KEYS,
  ALIASES,
  DISPLAY_INFO,
  EDUCATION_KEY_MAP,
  normalizeKey,
  getDisplayInfo,
  getArtistName,
  getEducationKey,
  detectCategory,
  getMovementDisplayInfo,
  getOrientalDisplayInfo,
  getMasterInfo
};
