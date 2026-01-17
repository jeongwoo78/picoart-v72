// PicoArt v72 - ProcessingScreen (3줄 형식 + 단일 변환 스와이프)
// v72: displayConfig.js 3줄 형식 컨트롤 타워 사용
// v72: 단일 변환에서도 원본사진 + 스와이프 기능 추가
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
  
  // 원클릭 상태
  const [completedResults, setCompletedResults] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [viewIndex, setViewIndex] = useState(-1);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  
  // 원클릭 여부
  const isFullTransform = selectedStyle?.isFullTransform === true;
  const category = selectedStyle?.category;
  
  // 원클릭 시 전달받은 스타일 배열 사용
  const styles = isFullTransform ? (selectedStyle?.styles || []) : [];
  const totalCount = styles.length;

  useEffect(() => {
    startProcess();
  }, []);

  // ========== 메인 프로세스 ==========
  const startProcess = async () => {
    if (isFullTransform) {
      // 원클릭: 1차 교육 표시 후 순차 변환
      setShowEducation(true);
      setStatusText(`${totalCount}개 스타일 변환을 시작합니다...`);
      await sleep(1500);
      
      const results = [];
      for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        setStatusText(`[${i}/${totalCount}] ${style.name} 변환 중...`);
        
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
      // 단일 변환
      setShowEducation(true);
      const eduContent = getSingleEducationContent(selectedStyle);
      if (eduContent) {
        setStatusText(`${eduContent.title} 스타일 분석 중...`);
      }
      await sleep(1000);
      
      const result = await processSingleStyle(selectedStyle);
      
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
            setStatusText(`[${index}/${total}] ${progressText}`);
          } else {
            setStatusText(progressText);
          }
        }
      );

      if (!result.success) {
        return { success: false, error: result.error || '변환 실패', style };
      }

      return {
        success: true,
        resultUrl: result.resultUrl,
        aiSelectedArtist: result.aiSelectedArtist,
        selected_work: result.selected_work,
        style: style,
        selectionMethod: result.selectionMethod,
        selectionDetails: result.selectionDetails
      };
    } catch (error) {
      console.error('processSingleStyle error:', error);
      return { success: false, error: error.message, style };
    }
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // ========== 단일 변환 1차 교육자료 ==========
  const getSingleEducationContent = (style) => {
    if (!style) return null;
    
    const cat = style.category;
    const styleId = style.id || style.name;
    
    // 거장
    if (cat === 'masters' && educationContent.masters?.[styleId]) {
      const content = educationContent.masters[styleId];
      return { title: content.title || style.name, desc: content.content };
    }
    
    // 사조
    if (cat === 'movements') {
      const key = normalizeKey(styleId);
      if (educationContent.movements?.[key]) {
        const content = educationContent.movements[key];
        return { title: content.title || style.name, desc: content.content };
      }
    }
    
    // 동양화
    if (cat === 'oriental') {
      const key = normalizeKey(styleId);
      if (educationContent.oriental?.[key]) {
        const content = educationContent.oriental[key];
        return { title: content.title || style.name, desc: content.content };
      }
    }
    
    return { title: style.name || '스타일', desc: '' };
  };

  // ========== 원클릭 1차 교육자료 ==========
  const getPrimaryEducation = () => {
    if (!category) return null;
    
    const primaryData = {
      masters: oneclickMastersPrimary,
      movements: oneclickMovementsPrimary,
      oriental: oneclickOrientalPrimary
    };
    
    const data = primaryData[category];
    if (!data) return null;
    
    return { title: data.title || '1차 교육', content: data.content || '' };
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

  // 단일 변환용 3줄 (스타일 기반)
  const getSingleThreeLines = () => {
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

  // v72: 단일 변환에서도 스와이프 가능
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
      if (isFullTransform) {
        // 원클릭: 기존 로직
        if (diffX > 0 && viewIndex < completedCount - 1) setViewIndex(v => v + 1);
        if (diffX < 0 && viewIndex > -1) setViewIndex(v => v - 1);
      } else {
        // 단일 변환: -1(원본+교육) ↔ 아무것도 없음 (단순 토글은 없음)
        // 단일 변환에서는 스와이프로 화면 전환 안 함 (원본 사진만 표시)
      }
    }
    setTouchStartX(0);
    setTouchStartY(0);
  };

  // 현재 보여줄 결과 (원클릭용)
  const previewResult = viewIndex >= 0 ? completedResults[viewIndex] : null;
  const previewEdu = previewResult ? getSecondaryEducation(previewResult) : null;
  const previewThreeLines = previewResult ? getThreeLines(previewResult) : null;

  // 단일 변환용 3줄
  const singleThreeLines = getSingleThreeLines();

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

        {/* ===== 원클릭 모드 ===== */}
        {isFullTransform && (
          <>
            {/* 1차 교육 + 원본 사진 */}
            {viewIndex === -1 && showEducation && getPrimaryEducation() && (
              <div className="preview">
                <img src={URL.createObjectURL(photo)} alt="원본 사진" />
                <div className="preview-info three-lines">
                  <div className="line1">{selectedStyle?.name || '전체 변환'}</div>
                </div>
                <div className="edu-card primary">
                  <h3>{getPrimaryEducation().title}</h3>
                  <p>{getPrimaryEducation().content}</p>
                  {completedCount > 0 && <p className="hint">👆 완료된 결과를 확인하세요</p>}
                </div>
              </div>
            )}

            {/* 결과 미리보기 (3줄 형식) */}
            {viewIndex >= 0 && previewResult && (
              <div className="preview">
                <img src={previewResult.resultUrl} alt="" />
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

            {/* 점 네비게이션 */}
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
                disabled={viewIndex === -1 && completedCount === 0}
              >
                ◀ 이전
              </button>
              
              <div className="dots">
                <span 
                  className={`dot edu-dot ${viewIndex === -1 ? 'active' : ''}`}
                  onClick={handleBackToEducation}
                >📚</span>
                {completedResults.map((_, idx) => (
                  <span 
                    key={idx}
                    className={`dot ${viewIndex === idx ? 'active' : ''} ${idx >= completedCount ? 'pending' : ''}`}
                    onClick={() => handleDotClick(idx)}
                  />
                ))}
              </div>
              
              <button 
                className="nav-btn"
                onClick={() => {
                  if (viewIndex === -1 && completedCount > 0) {
                    setViewIndex(0);
                  } else if (viewIndex < completedCount - 1) {
                    setViewIndex(viewIndex + 1);
                  }
                }}
                disabled={viewIndex >= completedCount - 1 || completedCount === 0}
              >
                다음 ▶
              </button>
            </div>
          </>
        )}

        {/* ===== 단일 변환 모드 (v72: 원본사진 + 3줄 형식) ===== */}
        {!isFullTransform && showEducation && (
          <div className="preview">
            <img src={URL.createObjectURL(photo)} alt="원본 사진" />
            <div className="preview-info three-lines">
              <div className="line1">{singleThreeLines.line1}</div>
              <div className="line2">{singleThreeLines.line2}</div>
              <div className="line3">{singleThreeLines.line3}</div>
            </div>
            {getSingleEducationContent(selectedStyle)?.desc && (
              <div className="edu-card primary">
                <p>{getSingleEducationContent(selectedStyle).desc}</p>
              </div>
            )}
          </div>
        )}
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
        
        .edu-card {
          padding: 16px;
          border-radius: 10px;
          margin: 16px 0;
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
        .hint { color: #999; font-size: 12px; text-align: center; margin-top: 12px !important; }
        
        .preview { background: #f8f9fa; border-radius: 12px; overflow: hidden; margin: 16px 0; }
        .preview img { width: 100%; display: block; }
        
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
        
        .dots-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 16px 0;
        }
        .dots {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #ddd;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dot.active { background: #667eea; transform: scale(1.3); }
        .dot.pending { background: #f0f0f0; }
        .dot.edu-dot {
          width: auto; height: auto;
          background: none;
          font-size: 16px;
        }
        .nav-btn {
          padding: 6px 10px;
          background: #f5f5f5;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          color: #666;
        }
        .nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .nav-btn:not(:disabled):hover { background: #e0e0e0; }
      `}</style>
    </div>
  );
};

export default ProcessingScreen;
