// ========================================
// educationMatcher.js - displayConfig 기반 교육자료 매칭
// v71 - 2026-01-18
// ========================================
//
// 모든 정규화는 displayConfig.js에서 처리
// 이 파일은 교육자료 연결만 담당
//
// ========================================

import { normalizeKey, getArtistName, ALIASES } from './displayConfig.js';

// ========================================
// 메인 함수: 교육자료 키 가져오기
// ========================================

/**
 * 거장 교육자료 키 가져오기
 * @param {string} masterKey - 거장 키 (vangogh, klimt 등)
 * @param {string} selectedWork - AI가 선택한 작품명
 */
export function getMasterEducationKey(masterKey, selectedWork) {
  // 원클릭 거장 모드: 화가명만 반환 (작품 상관없이 같은 교육자료)
  const normalizedMaster = normalizeKey(masterKey);
  return normalizedMaster;
}

/**
 * 사조 화가 교육자료 키 가져오기
 * @param {string} artistName - AI가 선택한 화가명
 */
export function getMovementEducationKey(artistName) {
  const normalized = normalizeKey(artistName);
  return normalized;
}

/**
 * 동양화 교육자료 키 가져오기
 * @param {string} styleId - 동양화 스타일 ID
 */
export function getOrientalEducationKey(styleId) {
  const normalized = normalizeKey(styleId);
  return normalized;
}

/**
 * 통합 함수: 카테고리별 교육자료 키 가져오기
 * @param {string} category - 'movements' | 'masters' | 'oriental'
 * @param {object} apiResponse - API 응답 (aiSelectedArtist, selected_work 등)
 */
export function getEducationKey(category, apiResponse) {
  const { aiSelectedArtist, selected_work, styleId, masterId } = apiResponse;
  
  switch (category) {
    case 'masters':
      return getMasterEducationKey(masterId || aiSelectedArtist, selected_work);
      
    case 'movements':
      return getMovementEducationKey(aiSelectedArtist);
      
    case 'oriental':
      return getOrientalEducationKey(styleId || aiSelectedArtist);
      
    default:
      return normalizeKey(aiSelectedArtist || styleId || '');
  }
}

/**
 * 화가 표시 정보 가져오기
 * @param {string} artistName - 화가명 (어떤 형식이든)
 */
export function getArtistDisplayInfo(artistName) {
  return getArtistName(artistName);
}

// ========================================
// 하위 호환성 유지 (기존 코드 지원)
// ========================================

// 사조 화가명 → 교육자료 키 (레거시)
export function normalizeArtistKey(artistName) {
  return normalizeKey(artistName);
}

// 동양화 스타일 → 교육자료 키 (레거시)
export function normalizeOrientalKey(styleId) {
  return normalizeKey(styleId);
}

export default {
  getMasterEducationKey,
  getMovementEducationKey,
  getOrientalEducationKey,
  getEducationKey,
  getArtistDisplayInfo,
  normalizeArtistKey,
  normalizeOrientalKey,
  MASTERS_WORK_MAP,
  MASTER_DEFAULT_KEYS
};
