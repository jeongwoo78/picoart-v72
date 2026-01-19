// PicoArt v72 - 교육 콘텐츠 통합
// 4개 파일로 분리:
// 1. movementsEducation.js - 서양 미술 10개 사조 (Overview + Education)
// 2. mastersEducation.js - 서양 거장 8명 (1차 교육)
// 3. orientalEducation.js - 동양화 6개 장르 (Overview + Education)

// 새로운 구조로 import
import { movementsOverview, movementsEducation } from './movementsEducation';
import { mastersEducation } from './mastersEducation';
import { orientalOverview, orientalEducation } from './orientalEducation';

// 하위 호환성을 위한 매핑 (옛 이름 → 새 이름)
const movementsPrimary = movementsOverview;
const movementsSecondary = movementsEducation;
const movementsStory = {};  // 더 이상 사용 안 함

const mastersPrimary = mastersEducation;
const mastersSecondary = mastersEducation;
const mastersStory = {};  // 더 이상 사용 안 함

const orientalPrimary = orientalOverview;
const orientalSecondary = orientalEducation;
const orientalStory = {};  // 더 이상 사용 안 함

// v72: masterData.js style.id → movementsOverview 키 매핑
// masterData.js에서 style.id는 'ancient', 'medieval' 등을 사용
// movementsOverview에서 키는 'greco-roman', 'medieval-art' 등을 사용
const STYLE_ID_TO_OVERVIEW_KEY = {
  'ancient': 'greco-roman',
  'medieval': 'medieval-art',
  'renaissance': 'renaissance',
  'baroque': 'baroque',
  'rococo': 'rococo',
  'neoclassicism_vs_romanticism_vs_realism': 'neoclassicism-romanticism-realism',  // 언더스코어 버전
  'neoclassicism-romanticism-realism': 'neoclassicism-romanticism-realism',
  'impressionism': 'impressionism',
  'postImpressionism': 'post-impressionism',  // 카멜케이스 버전
  'post-impressionism': 'post-impressionism',
  'fauvism': 'fauvism',
  'expressionism': 'expressionism',
  'modernism': 'modernism'
};

// movements를 Proxy로 감싸서 style.id로 접근 시 자동 매핑
const movementsWithAliases = new Proxy(movementsOverview, {
  get(target, prop) {
    // 직접 키가 있으면 그대로 반환
    if (target[prop]) return target[prop];
    // 매핑된 키가 있으면 변환 후 반환
    const mappedKey = STYLE_ID_TO_OVERVIEW_KEY[prop];
    if (mappedKey && target[mappedKey]) return target[mappedKey];
    return undefined;
  }
});

// masters도 매핑 필요 (-master 접미사 제거)
const mastersWithAliases = new Proxy(mastersEducation, {
  get(target, prop) {
    if (target[prop]) return target[prop];
    // 'vangogh-master' → 'vangogh' 변환
    const withoutMaster = prop.replace('-master', '');
    if (target[withoutMaster]) return target[withoutMaster];
    return undefined;
  }
});

// 동양화도 매핑 필요
const ORIENTAL_ID_TO_KEY = {
  'korean': 'korean',
  'chinese': 'chinese',
  'japanese': 'japanese'
};

const orientalWithAliases = new Proxy(orientalOverview, {
  get(target, prop) {
    if (target[prop]) return target[prop];
    const mappedKey = ORIENTAL_ID_TO_KEY[prop];
    if (mappedKey && target[mappedKey]) return target[mappedKey];
    return undefined;
  }
});

// 기존 구조 유지 (하위 호환성)
export const educationContent = {
  // 사조
  movementsPrimary,
  movementsSecondary,
  movementsStory,
  // 거장
  mastersPrimary,
  mastersSecondary,
  mastersStory,
  // 동양화
  orientalPrimary,
  orientalSecondary,
  orientalStory,
  
  // v72 수정: 단일변환 로딩화면용 (ProcessingScreen에서 사용)
  // style.id로 직접 접근: educationContent.movements['ancient'] → 'greco-roman' 매핑
  movements: movementsWithAliases,
  masters: mastersWithAliases,
  oriental: orientalWithAliases
};

// 개별 export
export { 
  movementsPrimary, movementsSecondary, movementsStory,
  mastersPrimary, mastersSecondary, mastersStory,
  orientalPrimary, orientalSecondary, orientalStory
};
