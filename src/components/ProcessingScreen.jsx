// PicoArt v72 - ProcessingScreen
// v72: 단일 변환도 원클릭과 동일 구조 (원본사진 + 점 + 숫자 + 스와이프)
// v72: displayConfig.js 3줄 형식 컨트롤 타워 사용
// v72: 점 상태 (done/active/disabled) + 화살표 점 옆 배치
import React, { useEffect, useState } from 'react';
import { processStyleTransfer } from '../utils/styleTransferAPI';
import { educationContent } from '../data/educationContent';
// 원클릭 교육자료 (분리된 파일)
import { oneclickMovementsPrimary, oneclickMovementsSecondary } from '../data/oneclickMovementsEducation';
import { oneclickMastersPrimary, oneclickMastersSecondary } from '../data/oneclickMastersEducation';
import { oneclickOrientalPrimary, oneclickOrientalSecondary } from '../data/oneclickOrientalEducation';
// v72: displayConfig 3줄 형식 컨트롤 타워
import { normalizeKey, getThreeLineDisplay, getArtistName } from '../utils/displayConfig';
import { getEducationKey } from '../utils/educationMatcher';

// 교육자료 콘텐츠 가져오기 헬퍼 함수
const getEducationContent = (category, key, educationData) => {
  if (!category || !key || !educationData) return null;
  const categoryData = educationData[category];
  if (!categoryData || !categoryData[key]) return null;
  return categoryData[key].content || categoryData[key].desc || null;
};

const ProcessingScreen = ({ photo, selectedStyle, onComplete }) => {
  const [statusText, setStatusText] = useState('준비 중...');
  const [showEducation, setShowEducation] = useState(false);
  
  // 공통 상태 (원클릭 + 단일 변환 통일)
  const [completedResults, setCompletedResults] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [viewIndex, setViewIndex] = useState(-1);  // -1: 원본+1차교육, 0~N: 결과
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  
  // 원클릭 여부
  const isFullTransform = selectedStyle?.isFullTransform === true;
  const category = selectedStyle?.category;
  
  // 스타일 배열 (원클릭: N개, 단일: 1개)
  const styles = isFullTransform ? (selectedStyle?.styles || []) : [selectedStyle];
  const totalCount = styles.length;

  useEffect(() => {
    startProcess();
  }, []);

  // ========== 메인 프로세스 ==========
  const startProcess = async () => {
    setShowEducation(true);
    
    if (isFullTransform) {
      // 원클릭: N개 순차 변환
      setStatusText(`${totalCount}개 스타일 변환을 시작합니다...`);
      await sleep(1500);
      
      const results = [];
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        setStatusText(`[${i + 1}/${totalCount}] ${style.name} 변환 중...`);
        
        const result = await processSingleStyle(style, i, totalCount);
        results.push(result);
        setCompletedCount(i + 1);
        setCompletedResults([...results]);
        
        // API 부하 방지
        if (i < styles.length - 1) {
          await sleep(2000);
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      setStatusText(`완료! ${successCount}/${totalCount}개 변환 성공`);
      await sleep(1000);
      
      onComplete(selectedStyle, results, { isFullTransform: true, category, results });
    } else {
      // 단일 변환: 1개 변환
      const eduContent = getSingleEducationContent(selectedStyle);
      if (eduContent) {
        setStatusText(`${eduContent.title || selectedStyle.name} 스타일 분석 중...`);
      } else {
        setStatusText(`${selectedStyle.name} 스타일 분석 중...`);
      }
      await sleep(1000);
      
      const result = await processSingleStyle(selectedStyle);
      
      // 단일 변환도 results 배열에 저장 (UI 통일)
      setCompletedResults([result]);
      setCompletedCount(1);
      
      if (result.success) {
        setStatusText(`${result.aiSelectedArtist || selectedStyle.name} 화풍으로 변환 완료!`);
        await sleep(1000);
        onComplete(selectedStyle, result.resultUrl, result);
      } else {
        setStatusText(`오류: ${result.error}`);
        await sleep(1500);
        onComplete(selectedStyle, null, { ...result, success: false });
      }
    }
  };

  // ========== 단일 스타일 변환 ==========
  const processSingleStyle = async (style, index = 0, total = 1) => {
    try {
      const result = await processStyleTransfer(
        photo,
        style,
        null,
        (progressText) => {
          if (total > 1) {
            setStatusText(`[${index + 1}/${total}] ${progressText}`);
          } else {
            setStatusText(progressText);
          }
        }
      );

      if (result.success) {
        return {
          style,
          resultUrl: result.resultUrl,
          aiSelectedArtist: result.aiSelectedArtist,
          selected_work: result.selected_work,
          success: true
        };
      } else {
        return { 
          style, 
          error: result.error, 
          aiSelectedArtist: result.aiSelectedArtist,
          selected_work: result.selected_work,
          success: false 
        };
      }
    } catch (err) {
      return { style, error: err.message, success: false };
    }
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // ========== 단일 변환용 1차 교육자료 ==========
  const getSingleEducationContent = (style) => {
    if (!style) return null;
    
    const cat = style.category;
    const styleId = style.id || style.name;
    const normalizedId = normalizeKey(styleId);
    
    // educationContent에서 직접 조회
    if (cat === 'movements' && educationContent.movements) {
      return educationContent.movements[normalizedId] || educationContent.movements[styleId];
    }
    if (cat === 'masters' && educationContent.masters) {
      return educationContent.masters[normalizedId] || educationContent.masters[styleId];
    }
    if (cat === 'oriental' && educationContent.oriental) {
      return educationContent.oriental[normalizedId] || educationContent.oriental[styleId];
    }
    
    return null;
  };

  // ========== 원클릭 1차 교육자료 ==========
  const getPrimaryEducation = () => {
    if (!category) return null;
    
    if (category === 'movements') {
      return { ...oneclickMovementsPrimary, title: '2,500년 서양미술사 관통' };
    } else if (category === 'masters') {
      return oneclickMastersPrimary;
    } else if (category === 'oriental') {
      return oneclickOrientalPrimary;
    }
    return null;
  };

  // ========== 원클릭 2차 교육자료 ==========
  const getSecondaryEducation = (result) => {
    if (!result) return null;
    
    const artistName = result.aiSelectedArtist || '';
    const workName = result.selected_work || '';
    const resultCategory = result.style?.category;
    
    const key = getEducationKey(resultCategory, artistName, workName);
    
    if (key) {
      const educationData = {
        masters: oneclickMastersSecondary,
        movements: oneclickMovementsSecondary,
        oriental: oneclickOrientalSecondary
      };
      
      const content = getEducationContent(resultCategory, key, educationData);
      
      if (content) {
        let eduName = artistName;
        if (resultCategory === 'masters' && oneclickMastersSecondary[key]) {
          eduName = oneclickMastersSecondary[key].name || artistName;
        } else if (resultCategory === 'movements' && oneclickMovementsSecondary[key]) {
          eduName = oneclickMovementsSecondary[key].name || artistName;
        } else if (resultCategory === 'oriental' && oneclickOrientalSecondary[key]) {
          eduName = oneclickOrientalSecondary[key].name || artistName;
        }
        return { name: eduName, content: content };
      }
    }
    
    return null;
  };

  // ========== 3줄 표시 함수 (v72: displayConfig 사용) ==========
  const getThreeLines = (result) => {
    const cat = result?.style?.category;
    const artist = result?.aiSelectedArtist;
    const styleKey = result?.style?.id || result?.style?.name;
    
    if (cat === 'masters') {
      const key = normalizeKey(artist || styleKey);
      return getThreeLineDisplay('masters', key);
    } else if (cat === 'movements') {
      const key = normalizeKey(styleKey);
      const artistKey = artist ? normalizeKey(artist) : null;
      return getThreeLineDisplay('movements', key, artistKey);
    } else if (cat === 'oriental') {
      const key = normalizeKey(artist || styleKey);
      return getThreeLineDisplay('oriental', key);
    }
    
    return { line1: result?.style?.name || '', line2: '', line3: '' };
  };

  // 스타일 기반 3줄 (로딩 시 사용)
  const getStyleThreeLines = () => {
    const cat = selectedStyle?.category;
    const styleKey = selectedStyle?.id || selectedStyle?.name;
    
    if (cat === 'masters') {
      const key = normalizeKey(styleKey);
      return getThreeLineDisplay('masters', key);
    } else if (cat === 'movements') {
      const key = normalizeKey(styleKey);
      return getThreeLineDisplay('movements', key);
    } else if (cat === 'oriental') {
      const key = normalizeKey(styleKey);
      return getThreeLineDisplay('oriental', key);
    }
    
    return { line1: selectedStyle?.name || '', line2: '', line3: '' };
  };

  // ========== UI 핸들러 ==========
  const handleDotClick = (idx) => {
    if (idx < completedCount) setViewIndex(idx);
  };
  
  const handleBackToEducation = () => setViewIndex(-1);

  // 스와이프 핸들러 (단일 변환 + 원클릭 공통)
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;
    
    // 수평 스와이프만 인식
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      const maxIndex = completedCount - 1;
      
      if (diffX > 0) {
        // 왼쪽 스와이프 → 다음
        if (viewIndex < maxIndex) {
          setViewIndex(v => v + 1);
        }
      } else {
        // 오른쪽 스와이프 → 이전
        if (viewIndex > -1) {
          setViewIndex(v => v - 1);
        }
      }
    }
    setTouchStartX(0);
    setTouchStartY(0);
  };

  // 현재 보여줄 결과
  const previewResult = viewIndex >= 0 ? completedResults[viewIndex] : null;
  const previewEdu = previewResult ? getSecondaryEducation(previewResult) : null;
  const previewThreeLines = previewResult ? getThreeLines(previewResult) : null;

  // 로딩 시 3줄
  const styleThreeLines = getStyleThreeLines();
  
  // 단일 변환 교육자료
  const singleEduContent = !isFullTransform ? getSingleEducationContent(selectedStyle) : null;

  return (
    <div className="processing-screen">
      <div 
        className="processing-content"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 헤더 */}
        <div className="header">
          <h2>{isFullTransform ? '✨ 전체 변환' : '🎨 변환 중'}</h2>
        </div>

        {/* 상태 */}
        <div className="status">
          <div className="spinner"></div>
          <p>{statusText}</p>
        </div>

        {/* ===== 원본 + 1차 교육 (viewIndex === -1) ===== */}
        {viewIndex === -1 && showEducation && (
          <div className="preview">
            <img src={URL.createObjectURL(photo)} alt="원본 사진" />
            <div className="preview-info three-lines">
              <div className="line1">{styleThreeLines.line1}</div>
              <div className="line2">{styleThreeLines.line2}</div>
              <div className="line3">{styleThreeLines.line3}</div>
            </div>
            {/* 원클릭: 1차 교육 */}
            {isFullTransform && getPrimaryEducation() && (
              <div className="edu-card primary">
                <h3>{getPrimaryEducation().title}</h3>
                <p>{getPrimaryEducation().content}</p>
              </div>
            )}
            {/* 단일 변환: 1차 교육 */}
            {!isFullTransform && singleEduContent && (
              <div className="edu-card primary">
                <h3>{singleEduContent.title || selectedStyle.name}</h3>
                <p>{singleEduContent.desc || singleEduContent.content || ''}</p>
              </div>
            )}
            {completedCount > 0 && (
              <p className="hint">👆 스와이프하여 완료된 결과를 확인하세요</p>
            )}
          </div>
        )}

        {/* ===== 결과 미리보기 (viewIndex >= 0) ===== */}
        {viewIndex >= 0 && previewResult && (
          <div className="preview">
            {previewResult.success ? (
              <img src={previewResult.resultUrl} alt="변환 결과" />
            ) : (
              <div className="error-preview">
                <p>❌ 변환 실패</p>
                <p>{previewResult.error}</p>
              </div>
            )}
            <div className="preview-info three-lines">
              <div className="line1">{previewThreeLines?.line1}</div>
              <div className="line2">{previewThreeLines?.line2}</div>
              <div className="line3">{previewThreeLines?.line3}</div>
            </div>
            {previewEdu && (
              <div className="edu-card secondary">
                <p>{previewEdu.content}</p>
              </div>
            )}
          </div>
        )}

        {/* ===== 점 네비게이션 (v67 스타일: 화살표 점 옆에) ===== */}
        <div className="dots-nav">
          <button 
            className="nav-btn"
            onClick={() => {
              if (viewIndex === -1 && completedCount > 0) {
                setViewIndex(completedCount - 1);
              } else if (viewIndex > 0) {
                setViewIndex(viewIndex - 1);
              } else if (viewIndex === 0) {
                setViewIndex(-1);
              }
            }}
            disabled={viewIndex === -1}
          >
            ◀
          </button>
          
          <div className="dots">
            {/* 결과 점들 */}
            {Array.from({ length: totalCount }).map((_, idx) => (
              <button 
                key={idx}
                className={`dot ${idx < completedCount ? 'done' : ''} ${viewIndex === idx ? 'active' : ''}`}
                onClick={() => handleDotClick(idx)}
                disabled={idx >= completedCount}
              />
            ))}
            
            {/* 진행 상황 카운터 */}
            <span className="progress-counter">
              {viewIndex === -1 ? 0 : viewIndex + 1}/{totalCount}
            </span>
          </div>
          
          <button 
            className="nav-btn"
            onClick={() => {
              if (viewIndex === -1 && completedCount > 0) {
                setViewIndex(0);
              } else if (viewIndex >= 0 && viewIndex < completedCount - 1) {
                setViewIndex(viewIndex + 1);
              }
            }}
            disabled={viewIndex >= completedCount - 1 || completedCount === 0}
          >
            ▶
          </button>
        </div>
      </div>

      <style>{`
        .processing-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .processing-content {
          background: white;
          padding: 24px;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .header h2 { margin: 0; font-size: 18px; color: #333; }
        
        .status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 16px 0;
        }
        .status p { margin: 0; color: #666; font-size: 14px; }
        .spinner {
          width: 20px; height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .preview { 
          background: #f8f9fa; 
          border-radius: 12px; 
          overflow: hidden; 
          margin: 16px 0; 
        }
        .preview img { width: 100%; display: block; }
        
        .error-preview {
          padding: 40px 20px;
          text-align: center;
          background: #fff5f5;
        }
        .error-preview p { margin: 8px 0; color: #e53935; }
        
        /* v72: 3줄 형식 */
        .preview-info.three-lines { 
          padding: 12px 16px;
          background: rgba(0,0,0,0.03);
        }
        .preview-info .line1 {
          font-size: 15px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }
        .preview-info .line2 {
          font-size: 13px;
          color: #666;
          margin-bottom: 2px;
        }
        .preview-info .line3 {
          font-size: 12px;
          color: #888;
        }
        
        .edu-card {
          padding: 16px;
          border-radius: 10px;
          margin: 16px;
        }
        .edu-card.primary {
          background: linear-gradient(135deg, #fff5f5, #ffe5e5);
          border-left: 3px solid #667eea;
        }
        .edu-card.secondary {
          background: linear-gradient(135deg, #f0fff0, #e5ffe5);
          border-left: 3px solid #4CAF50;
        }
        .edu-card h3 { color: #667eea; margin: 0 0 10px; font-size: 15px; }
        .edu-card p { color: #333; line-height: 1.6; font-size: 13px; margin: 0; white-space: pre-line; }
        
        .hint { 
          color: #999; 
          font-size: 12px; 
          text-align: center; 
          margin: 12px 16px !important;
          padding: 0;
        }
        
        /* v67 스타일: 점 네비게이션 (화살표 점 옆에) */
        .dots-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 16px;
        }
        .dots-nav .nav-btn {
          padding: 8px 14px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          min-width: 40px;
        }
        .dots-nav .nav-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          border: none;
          background: #ddd;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s;
        }
        .dot.done { background: #4CAF50; }
        .dot.active { 
          transform: scale(1.4); 
          box-shadow: 0 0 0 2px rgba(102,126,234,0.4); 
        }
        .dot:disabled { opacity: 0.4; cursor: default; }
        .progress-counter {
          font-size: 12px;
          font-weight: 600;
          color: #667eea;
          margin-left: 8px;
        }
        .count { 
          font-size: 12px; 
          color: #999; 
          margin-left: 8px; 
        }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;
