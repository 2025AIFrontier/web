import React, { useState } from 'react';
import { Activity, Users, FileText, TrendingUp, Clock, AlertCircle, Zap } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handlePerformanceOptimization = async () => {
    setIsOptimizing(true);
    try {
      // Windows에서만 실행 가능한지 확인
      if (!navigator.userAgent.includes('Windows')) {
        alert('이 기능은 Windows에서만 사용할 수 있습니다.');
        return;
      }

      // 배치 파일 내용 생성
      const batchContent = `@echo off
echo Windows 전원 옵션을 고성능 모드로 변경합니다...
echo.
echo 관리자 권한이 필요합니다. UAC 창이 나타나면 "예"를 클릭해주세요.
echo.

REM 관리자 권한으로 실행되었는지 확인
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo 관리자 권한으로 다시 실행합니다...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo 고성능 전원 계획으로 변경 중...
powercfg -setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

if %errorLevel% equ 0 (
    echo.
    echo ✓ 성공! 컴퓨터가 고성능 모드로 설정되었습니다.
    echo.
    echo 현재 전원 계획을 확인합니다:
    powercfg -getactivescheme
) else (
    echo.
    echo ✗ 오류가 발생했습니다. 관리자 권한으로 실행되었는지 확인해주세요.
)

echo.
echo 아무 키나 누르면 창이 닫힙니다...
pause >nul`;

      // 사용자 확인
      const confirmed = confirm(
        'Windows 전원 옵션을 고성능 모드로 변경합니다.\n\n' +
        '배치 파일을 다운로드하여 실행하시겠습니까?\n' +
        '(관리자 권한이 자동으로 요청됩니다)'
      );

      if (confirmed) {
        // 배치 파일 다운로드
        const blob = new Blob([batchContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'optimize_performance.bat';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        alert(
          '배치 파일(optimize_performance.bat)이 다운로드되었습니다!\n\n' +
          '다운로드 폴더에서 파일을 찾아 더블클릭하여 실행하세요.\n' +
          '관리자 권한 요청 창이 나타나면 "예"를 클릭해주세요.\n\n' +
          '실행이 완료되면 컴퓨터가 자동으로 고성능 모드로 설정됩니다.'
        );
      }
    } catch (error) {
      console.error('Performance optimization error:', error);
      alert('성능 최적화 기능 실행 중 오류가 발생했습니다.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">대시보드</h1>
          <p className="text-gray-600">Internal A.IPC 통합 관리 시스템</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">총 사용자</p>
                <p className="text-2xl font-bold text-gray-800">1,234</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">활성 세션</p>
                <p className="text-2xl font-bold text-gray-800">856</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">처리된 요청</p>
                <p className="text-2xl font-bold text-gray-800">2,847</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">시스템 성능</p>
                <p className="text-2xl font-bold text-gray-800">98.5%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* 최근 활동 및 알림 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-gray-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">최근 활동</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">환율 데이터 업데이트</p>
                  <p className="text-xs text-gray-600">2분 전</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">새로운 담당자 등록</p>
                  <p className="text-xs text-gray-600">15분 전</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">과제 상태 변경</p>
                  <p className="text-xs text-gray-600">1시간 전</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-gray-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">시스템 알림</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-3 border-blue-500">
                <p className="text-sm font-medium text-blue-800">정기 점검 예정</p>
                <p className="text-xs text-blue-600">오늘 오후 6시부터 30분간</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-3 border-green-500">
                <p className="text-sm font-medium text-green-800">백업 완료</p>
                <p className="text-xs text-green-600">모든 데이터 백업이 성공적으로 완료되었습니다</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border-l-3 border-yellow-500">
                <p className="text-sm font-medium text-yellow-800">업데이트 알림</p>
                <p className="text-xs text-yellow-600">새로운 기능이 추가되었습니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* 컴퓨터 성능 개선 버튼 */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">컴퓨터 성능 최적화</h3>
                  <p className="text-sm text-gray-600">Windows 전원 옵션을 고성능 모드로 변경합니다</p>
                </div>
              </div>
              <button
                onClick={handlePerformanceOptimization}
                disabled={isOptimizing}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isOptimizing
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {isOptimizing ? '최적화 중...' : '성능 개선하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;