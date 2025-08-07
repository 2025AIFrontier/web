import React, { useState, useCallback } from 'react';
import { FileText, BarChart3, Send, Upload, X, Check, Eye, AlertCircle, ChevronRight, ArrowLeft } from 'lucide-react';

interface ExcelData {
  headers: string[];
  rows: string[][];
  metadata?: {
    row_count: number;
    column_count: number;
    filename: string;
  };
}

interface SelectionState {
  dataColumns: Set<number>;
  recipientColumn: number | null;
  nameRows: Set<number>;
}

type SelectionStep = 'upload' | 'step1' | 'step2' | 'complete';

const CollectPage: React.FC = () => {
  const [audienceType, setAudienceType] = useState<Set<'internal' | 'external'>>(new Set());

  const toggleAudienceType = (type: 'internal' | 'external') => {
    setAudienceType(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<SelectionStep>('upload');
  const [selection, setSelection] = useState<SelectionState>({
    dataColumns: new Set(),
    recipientColumn: null,
    nameRows: new Set()
  });

  const getColumnName = (index: number) => {
    let result = '';
    let num = index;
    while (num >= 0) {
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26) - 1;
    }
    return result;
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file ) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/upload-excel`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setExcelData({
          headers: result.data.headers,
          rows: result.data.rows,
          metadata: result.data.metadata
        });
        setShowUploadModal(false);
        setSelection({
          dataColumns: new Set(),
          recipientColumn: null,
          nameRows: new Set()
        });
        setCurrentStep('step1');
      } else {
        setUploadError(result.error || '파일 업로드 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setUploadError('서버와의 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleColumnSelection = (columnIndex: number, type: 'data' | 'recipient') => {
    setSelection(prev => {
      if (type === 'data') {
        const newDataColumns = new Set(prev.dataColumns);
        if (newDataColumns.has(columnIndex)) {
          newDataColumns.delete(columnIndex);
        } else if (newDataColumns.size < 5) {
          newDataColumns.add(columnIndex);
        }
        return { ...prev, dataColumns: newDataColumns };
      } else {
        return { ...prev, recipientColumn: columnIndex };
      }
    });
  };

  const handleRowSelection = (rowIndex: number) => {
    setSelection(prev => {
      const newNameRows = new Set(prev.nameRows);
      if (newNameRows.has(rowIndex)) {
        newNameRows.delete(rowIndex);
      } else if (newNameRows.size < 2) {
        newNameRows.add(rowIndex);
      }
      return { ...prev, nameRows: newNameRows };
    });
  };

  const canProceedToStep2 = () => {
    return selection.recipientColumn !== null && selection.nameRows.size > 0;
  };

  const canSubmitRequest = () => {
    return selection.dataColumns.size > 0 && 
           selection.recipientColumn !== null && 
           selection.nameRows.size > 0;
  };

  const handleStep1Next = () => {
    if (canProceedToStep2()) {
      setCurrentStep('step2');
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep('step1');
  };

  const getFilteredData = () => {
    if (!excelData) return null;

    const selectedColumnIndices = [
      ...Array.from(selection.dataColumns),
      ...(selection.recipientColumn !== null ? [selection.recipientColumn] : [])
    ];

    // 중복 제거 및 정렬
    const uniqueColumnIndices = [...new Set(selectedColumnIndices)].sort((a, b) => a - b);

    const filteredHeaders = uniqueColumnIndices.map(i => excelData.headers[i]);
    const filteredRows = Array.from(selection.nameRows).map(rowIndex => 
      uniqueColumnIndices.map(colIndex => excelData.rows[rowIndex][colIndex] || '')
    );

    return { headers: filteredHeaders, rows: filteredRows };
  };

  const handleSubmitRequest = async () => {
    if (!canSubmitRequest() || !excelData || !baseUrl) return;

    try {
      const requestData = {
        headers: excelData.headers,
        rows: excelData.rows,
        selection: {
          dataColumns: Array.from(selection.dataColumns),
          recipientColumn: selection.recipientColumn,
          nameRows: Array.from(selection.nameRows)
        }
      };

      const response = await fetch(`/api/process-selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.success) {
        alert('요청이 성공적으로 처리되었습니다!');
        console.log('Filtered data:', result.filtered_data);
        setCurrentStep('complete');
      } else {
        alert(`요청 처리 실패: ${result.error}`);
      }
    } catch (error) {
      alert('서버와의 연결에 실패했습니다.');
      console.error('Submit error:', error);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'step1', label: '1단계: 기본 설정', description: '대표 행과 대상자 열 선택' },
      { key: 'step2', label: '2단계: 데이터 선택', description: '취합할 데이터 열 선택' }
    ];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div className={`flex items-center space-x-3 ${
                currentStep === step.key ? 'text-purple-600' : 
                (currentStep === 'step2' && step.key === 'step1') || currentStep === 'complete' ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === step.key ? 'bg-purple-100 text-purple-600' : 
                  (currentStep === 'step2' && step.key === 'step1') || currentStep === 'complete' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {(currentStep === 'step2' && step.key === 'step1') || currentStep === 'complete' ? <Check size={16} /> : index + 1}
                </div>
                <div>
                  <div className="font-medium">{step.label}</div>
                  <div className="text-sm opacity-75">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="text-gray-300" size={20} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">취합 요청</h1>
        <p className="text-gray-600 text-lg">데이터 수집 및 리포트 생성을 요청하세요</p>
        <div className="mt-4 flex gap-3">
          {['internal', 'external'].map(type => (
            <button
              key={type}
              onClick={() => toggleAudienceType(type as 'internal' | 'external')}
              className={`px-4 py-2 rounded-lg font-medium border transition-colors ${
                audienceType.has(type as 'internal' | 'external')
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {type === 'internal' ? '사내' : '사외'}
            </button>
          ))}
        </div>
      </div>

      {currentStep === 'upload' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-sm p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-600 rounded-lg">
                <FileText className="text-white" size={24} />
              </div>
              <span className="text-purple-600 text-sm font-medium">신규 요청</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">데이터 취합 요청</h3>
            <p className="text-gray-600 text-sm mb-4">새로운 데이터 수집 작업을 요청합니다</p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              요청 작성하기
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl shadow-sm p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <BarChart3 className="text-white" size={24} />
              </div>
              <span className="text-blue-600 text-sm font-medium">진행 현황</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">요청 현황 확인</h3>
            <p className="text-gray-600 text-sm mb-4">제출한 요청의 처리 상태를 확인합니다</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              현황 보기
            </button>
          </div>
        </div>
      )}

      {(currentStep === 'step1' || currentStep === 'step2') && renderStepIndicator()}

      {/* 1단계: 대표 행과 대상자 열 선택 */}
      {currentStep === 'step1' && excelData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">1단계: 기본 설정</h2>
                <p className="text-sm text-gray-600 mt-1">
                  대표 행(열의 이름)과 요청 대상자 열을 선택하세요
                </p>
              </div>
              <button 
                onClick={handleStep1Next}
                disabled={!canProceedToStep2()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  canProceedToStep2()
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                다음 단계
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">선택 방법:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <span className="font-medium">대표 행 선택:</span> 왼쪽 체크박스 (최대 2개)
                </div>
                <div>
                  <span className="font-medium">요청 대상자 열:</span> 헤더의 초록색 라디오 버튼 (1개)
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-200 p-2 w-16">
                    <div className="text-xs text-gray-600 mb-1">행 선택</div>
                  </th>
                  <th className="border border-gray-200 p-2 text-left font-medium text-gray-700">#</th>
                  {excelData.headers.map((header, index) => (
                    <th key={index} className="border border-gray-200 p-2 text-left font-medium text-gray-700 min-w-32">
                      <div className="space-y-2">
                        <div className="font-medium">
                          <div className="text-sm text-gray-500">{header}</div>
                        </div>
                        <div className="flex items-center justify-center">
                          <label className="flex items-center cursor-pointer" title="요청 대상자 열">
                            <input
                              type="radio"
                              name="recipient"
                              checked={selection.recipientColumn === index}
                              onChange={() => handleColumnSelection(index, 'recipient')}
                              className="border-green-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-1 text-xs text-green-600">대상자</span>
                          </label>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.rows.slice(0, 20).map((row, rowIndex) => (
                  <tr key={rowIndex} className={`hover:bg-gray-50 ${
                    selection.nameRows.has(rowIndex) ? 'bg-yellow-50' : ''
                  }`}>
                    <td className="border border-gray-200 p-2 text-center">
                      <label className="cursor-pointer" title="대표 행">
                        <input
                          type="checkbox"
                          checked={selection.nameRows.has(rowIndex)}
                          onChange={() => handleRowSelection(rowIndex)}
                          disabled={!selection.nameRows.has(rowIndex) && selection.nameRows.size >= 2}
                          className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                        />
                      </label>
                    </td>
                    <td className="border border-gray-200 p-2 font-medium text-gray-600">{rowIndex + 1}</td>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={`border border-gray-200 p-2 text-gray-700 ${
                        selection.recipientColumn === cellIndex ? 'bg-green-50' : ''
                      }`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 1단계 선택 현황 */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">대표 행 (열의 이름)</h4>
                <p className="text-sm text-yellow-700">
                  {selection.nameRows.size}/2개 선택됨
                </p>
                {selection.nameRows.size > 0 && (
                  <div className="mt-2">
                    {Array.from(selection.nameRows).map(index => (
                      <span key={index} className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs mr-1">
                        행 {index + 1}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">요청 대상자 열</h4>
                <p className="text-sm text-green-700">
                  {selection.recipientColumn !== null ? '1개 선택됨' : '선택되지 않음'}
                </p>
                {selection.recipientColumn !== null && (
                  <div className="mt-2">
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {excelData.headers[selection.recipientColumn]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2단계: 취합할 데이터 열 선택 */}
      {currentStep === 'step2' && excelData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">2단계: 데이터 선택</h2>
                <p className="text-sm text-gray-600 mt-1">
                  취합할 데이터 열을 선택하세요 (최대 5개)
                </p>
              </div>
              <button 
                onClick={handleBackToStep1}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={16} />
                이전 단계
              </button>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">선택 방법:</h4>
              <p className="text-sm text-blue-700">
                <span className="font-medium">데이터 취합 열:</span> 헤더의 파란색 체크박스 (최대 5개)
              </p>
            </div>
          </div>
          
          <div className="p-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-200 p-2 w-16">선택</th>
                  <th className="border border-gray-200 p-2 text-left font-medium text-gray-700">#</th>
                  {excelData.headers.map((header, index) => {
                    // 선택된 대표 행들의 값을 조합해서 새로운 제목 만들기
                    const newHeader = Array.from(selection.nameRows)
                      .map(rowIndex => excelData.rows[rowIndex][index] || '')
                      .filter(val => val.trim() !== '')
                      .join(' / ');
                    
                    return (
                      <th key={index} className="border border-gray-200 p-2 text-left font-medium text-gray-700 min-w-32">
                        <div className="space-y-2">
                          <div className="font-medium">
                            <div className="text-sm text-gray-700">{newHeader || '데이터 없음'}</div>
                          </div>
                          <div className="flex items-center justify-center">
                            {selection.recipientColumn === index ? (
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">대상자 열</span>
                            ) : (
                              <label className="flex items-center cursor-pointer" title="데이터 취합 열">
                                <input
                                  type="checkbox"
                                  checked={selection.dataColumns.has(index)}
                                  onChange={() => handleColumnSelection(index, 'data')}
                                  disabled={!selection.dataColumns.has(index) && selection.dataColumns.size >= 5}
                                  className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-1 text-xs text-blue-600">데이터</span>
                              </label>
                            )}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {excelData.rows
                  .filter((_, index) => !selection.nameRows.has(index)) // 대표 행으로 선택된 행들 제외
                  .slice(0, 10) // 처음 10개 행만 표시
                  .map((row, displayIndex) => {
                    // 원본 행 인덱스 찾기
                    const originalIndex = excelData.rows.findIndex((originalRow, originalIndex) => 
                      !selection.nameRows.has(originalIndex) && 
                      originalRow === row
                    );
                    
                    return (
                      <tr key={originalIndex} className="hover:bg-gray-50">
                        <td className="border border-gray-200 p-2 text-center text-gray-400">-</td>
                        <td className="border border-gray-200 p-2 font-medium text-gray-600">{originalIndex + 1}</td>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className={`border border-gray-200 p-2 text-gray-700 ${
                            selection.dataColumns.has(cellIndex) ? 'bg-blue-50' : 
                            selection.recipientColumn === cellIndex ? 'bg-green-50' : ''
                          }`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <p className="text-sm text-gray-500 mt-2 text-center">
              대표 행을 제외한 데이터 행 중 처음 10개를 표시합니다.
            </p>
          </div>

          {/* 2단계 선택 현황 */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
              <h4 className="font-medium text-blue-800 mb-2">데이터 취합 열</h4>
              <p className="text-sm text-blue-700">
                {selection.dataColumns.size}/5개 선택됨
              </p>
              {selection.dataColumns.size > 0 && (
                <div className="mt-2">
                  {Array.from(selection.dataColumns).map(index => (
                    <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1">
                      {getColumnName(index)}열: {excelData.headers[index]}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setShowPreviewModal(true)}
                disabled={!canSubmitRequest()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  canSubmitRequest()
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Eye size={16} />
                미리보기
              </button>
              
              <button 
                onClick={handleSubmitRequest}
                disabled={!canSubmitRequest()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  canSubmitRequest()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={16} />
                요청 보내기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 완료 단계 */}
      {currentStep === 'complete' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">요청이 완료되었습니다!</h2>
          <p className="text-gray-600 mb-6">선택하신 데이터로 취합 요청이 성공적으로 처리되었습니다.</p>
          <button 
            onClick={() => {
              setCurrentStep('upload');
              setExcelData(null);
              setSelection({
                dataColumns: new Set(),
                recipientColumn: null,
                nameRows: new Set()
              });
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            새 요청 작성하기
          </button>
        </div>
      )}

      {/* 시스템 소개 (업로드 단계에서만 표시) */}
      {currentStep === 'upload' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">취합 요청 시스템</h2>
            <p className="text-gray-600">효율적인 데이터 수집과 리포트 생성을 위한 플랫폼</p>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Send className="text-white" size={16} />
                </div>
                <span className="text-purple-600 font-semibold">지원 파일 형식</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Excel (.xlsx, .xls) 및 CSV (.csv) 파일을 지원합니다. 
                최대 16MB까지 업로드 가능하며, 데이터는 서버에서 안전하게 처리됩니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 파일 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">파일 업로드</h3>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            {uploadError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <span className="text-red-700 text-sm">{uploadError}</span>
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 mb-4">
                Excel (.xlsx, .xls) 또는 CSV 파일을 선택하여 업로드하세요
              </p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`${
                  isUploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
                } text-white px-4 py-2 rounded-lg transition-colors font-medium`}
              >
                {isUploading ? '업로드 중...' : '파일 선택'}
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 미리보기 모달 */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">선택된 데이터 미리보기</h3>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            {(() => {
              const filteredData = getFilteredData();
              if (!filteredData) return null;
              
              return (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {filteredData.headers.map((header, index) => (
                          <th key={index} className="border border-gray-200 p-2 text-left font-medium text-gray-700">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border border-gray-200 p-2 text-gray-700">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectPage;