import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ReservationModal 및 useReservationApi는 실제 프로젝트에 맞게 import 경로를 확인해야 합니다.
// 예시를 위해 임시 컴포넌트와 hook을 정의합니다.
const ReservationModal = ({ isOpen, onClose, selectedDate, onReserve, existingReservations }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-800">차량 예약</h2>
        <p className="my-4">{selectedDate.toLocaleDateString('ko-KR')}의 예약을 진행합니다.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">닫기</button>
          <button onClick={() => onReserve({ date: selectedDate, carNumber: '1', time: '09:00', sessions: 1 })} className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600">1번 차량 예약</button>
        </div>
      </div>
    </div>
  );
};

const useReservationApi = () => ({
  createReservation: async (reservation: any) => {
    console.log("Creating reservation:", reservation);
    // 실제 API 호출 로직
    return { success: true, message: "예약이 완료되었습니다." };
  }
});


interface CalendarPageProps {}

const CalendarPage: React.FC<CalendarPageProps> = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [viewMode, setViewMode] = useState<'year' | 'month'>('month');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'expand' | 'shrink'>('expand');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'meeting' | 'car' | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const reservationApi = useReservationApi();

  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 달 변경 시 차량 모드에서 데이터 자동 새로고침
  useEffect(() => {
    if (selectedMode === 'car') {
      fetchReservations();
    }
  }, [currentYear, currentMonth, selectedMode]);

  // 목요일 기준 주차 계산 함수
  const getThursdayBasedWeekNumber = (date: Date) => {
    const tempDate = new Date(date.getTime());
    const dayOfWeek = tempDate.getDay();
    const daysToThursday = (4 - dayOfWeek + 7) % 7;
    const thursday = new Date(tempDate);
    thursday.setDate(tempDate.getDate() + daysToThursday);
    
    const year = thursday.getFullYear();
    const firstThursday = new Date(year, 0, 1);
    const firstThursdayDayOfWeek = firstThursday.getDay();
    const daysToFirstThursday = (4 - firstThursdayDayOfWeek + 7) % 7;
    firstThursday.setDate(1 + daysToFirstThursday);
    
    const diffInDays = Math.floor((thursday.getTime() - firstThursday.getTime()) / (24 * 60 * 60 * 1000));
    return Math.floor(diffInDays / 7) + 1;
  };

  // 해당 월의 첫 번째 날과 마지막 날 계산
  const getMonthData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 자정으로 설정
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      days.push({
        date: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === today.toDateString(),
        fullDate: new Date(currentDate),
        weekNumber: getThursdayBasedWeekNumber(currentDate)
      });
    }
    
    days.forEach(day => {
      day.isPast = day.fullDate < today;
    });
    
    return days;
  };

  // 월간 달력 렌더링
  const renderMonthView = () => {
    const monthData = getMonthData(currentYear, currentMonth);
    
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto transform transition-all duration-300 hover:shadow-xl">
        <div className="p-6">
          {/* 요일 헤더 (주차 포함) */}
          <div className="grid grid-cols-8 gap-1 mb-4">
            <div className="text-center text-sm font-semibold py-3 text-gray-600">
              주차
            </div>
            {weekdays.map((day, index) => (
              <div
                key={day}
                className={`text-center text-sm font-semibold py-3 ${
                  index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* 날짜 그리드 (주차 포함) */}
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, weekIndex) => {
              const weekStart = weekIndex * 7;
              const weekData = monthData.slice(weekStart, weekStart + 7);
              if (weekData.length === 0) return null;
              
              return (
                <div key={weekIndex} className="grid grid-cols-8 gap-1">
                  {/* 주차 번호 */}
                  <div className="text-center text-sm py-3 text-gray-500 font-medium flex items-center justify-center">
                    <div className="border border-gray-400 rounded px-2 py-1 bg-gray-50 text-sm">
                      {weekData[0]?.weekNumber}
                    </div>
                  </div>
                  
                  {/* 해당 주의 날짜들 */}
                  {weekData.map((day, dayIndex) => {
                    const dayReservations = selectedMode === 'car' && viewMode === 'month' 
                      ? getReservationsForDate(day.fullDate) 
                      : [];
                    
                    return (
                      <div
                        key={weekStart + dayIndex}
                        className={`
                          text-center rounded-lg transition-all duration-200 flex flex-col items-center justify-center
                          ${selectedMode === 'car' && viewMode === 'month' ? 'py-1 h-20' : 'py-3 h-14'}
                          ${
                            // --- [수정된 스타일링 로직] ---
                            // 1순위: 현재 달이 아닌 날짜 처리
                            !day.isCurrentMonth
                              ? day.isPast // 다른 달의 과거 날짜
                                ? 'text-gray-400 opacity-50'
                                : 'text-gray-300' // 다른 달의 미래 날짜
                            // 2순위: 현재 달의 과거 날짜 처리
                            : day.isPast
                              ? 'text-gray-400 cursor-not-allowed opacity-50'
                            // 3순위: 오늘 날짜 처리
                            : day.isToday
                              ? 'bg-blue-500 text-white font-bold hover:bg-blue-600 cursor-pointer'
                            // 4순위: 현재 달의 미래 날짜 (주말/평일) 처리
                            : dayIndex === 0 // 일요일
                              ? 'text-red-500 font-semibold cursor-pointer hover:bg-red-50'
                            : dayIndex === 6 // 토요일
                              ? 'text-blue-600 font-semibold cursor-pointer hover:bg-blue-50'
                            : 'text-gray-900 cursor-pointer hover:bg-gray-100' // 평일
                          }
                        `}
                        onClick={() => !day.isPast && day.isCurrentMonth && handleDateClick(day.fullDate)}
                      >
                        <div className="text-lg font-medium">
                          {day.date}
                        </div>
                        
                        {/* 예약현황 표시 (차량 모드 + 월간 모드에서만) */}
                        {selectedMode === 'car' && viewMode === 'month' && (
                          <div className="mt-1 space-y-1 w-full">
                            {/* 1번차 타임라인 */}
                            <div className="flex justify-center">
                              <div className="flex h-2 bg-gray-200 rounded-sm" style={{ width: '45px' }}>
                                {Array.from({ length: 9 }, (_, i) => {
                                  const hour = 9 + i;
                                  const isReserved = dayReservations.some(res => res.target === 1 && hour >= new Date(res.time).getHours() && hour < new Date(res.time).getHours() + res.session);
                                  return (
                                    <div 
                                      key={i} 
                                      className={`flex-1 ${i > 0 ? 'border-l border-white' : ''} ${isReserved ? 'bg-green-500' : 'bg-gray-200'}`}
                                      style={{ width: '5px' }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* 2번차 타임라인 */}
                            <div className="flex justify-center">
                              <div className="flex h-2 bg-gray-200 rounded-sm" style={{ width: '45px' }}>
                                {Array.from({ length: 9 }, (_, i) => {
                                  const hour = 9 + i;
                                  const isReserved = dayReservations.some(res => res.target === 2 && hour >= new Date(res.time).getHours() && hour < new Date(res.time).getHours() + res.session);
                                  return (
                                    <div 
                                      key={i} 
                                      className={`flex-1 ${i > 0 ? 'border-l border-white' : ''} ${isReserved ? 'bg-orange-500' : 'bg-gray-200'}`}
                                      style={{ width: '5px' }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 연간 달력 렌더링
  const renderMonthCalendar = (monthIndex: number) => {
    const monthData = getMonthData(currentYear, monthIndex);
    
    return (
      <div key={monthIndex} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-visible transform hover:scale-110 hover:-translate-y-2">
        <h3 
          className="text-lg font-bold text-gray-800 py-3 text-center bg-gray-50 border-b rounded-t-xl cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 active:scale-90"
          onClick={() => switchToMonthView(monthIndex)}
        >
          {months[monthIndex]}
        </h3>
        
        <div className="p-4">
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="text-center text-xs font-semibold py-2 text-gray-600">주차</div>
              {weekdays.map((day, index) => (
                <div key={day} className={`text-center text-xs font-semibold py-2 ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-600' : 'text-gray-600'}`}>
                  {day}
                </div>
              ))}
            </div>
            
            <div className="space-y-1">
              {Array.from({ length: 6 }, (_, weekIndex) => {
                const weekStart = weekIndex * 7;
                const weekData = monthData.slice(weekStart, weekStart + 7);
                if (weekData.length === 0) return null;
                
                return (
                  <div key={weekIndex} className="grid grid-cols-8 gap-1">
                    <div className="text-center text-xs py-2 text-gray-500 font-medium flex items-center justify-center">
                      <div className="border border-gray-400 rounded px-1 py-0.5 bg-gray-50 text-xs">
                        {weekData[0]?.weekNumber}
                      </div>
                    </div>
                    
                    {weekData.map((day, dayIndex) => (
                      <div
                        key={weekStart + dayIndex}
                        className={`
                          text-center text-sm py-2 rounded-lg transition-all duration-200
                          ${
                            // --- [수정된 스타일링 로직] ---
                            !day.isCurrentMonth
                              ? day.isPast
                                ? 'text-gray-400 opacity-50'
                                : 'text-gray-300'
                            : day.isPast
                              ? 'text-gray-400 cursor-not-allowed opacity-50'
                            : day.isToday
                              ? 'bg-blue-500 text-white font-bold'
                            : dayIndex === 0
                              ? 'text-red-500 font-semibold'
                              : dayIndex === 6
                                ? 'text-blue-600 font-semibold'
                                : 'text-gray-900'
                          }
                          ${!day.isPast && day.isCurrentMonth ? 'cursor-pointer hover:bg-blue-50' : ''}
                          ${day.isToday ? 'hover:bg-blue-600' : ''}
                        `}
                        onClick={() => !day.isPast && day.isCurrentMonth && handleDateClick(day.fullDate)}
                      >
                        {day.date}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
      </div>
    );
  };

  const goToPrevious = () => {
    if (viewMode === 'year') {
      setCurrentYear(currentYear - 1);
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const goToNext = () => {
    if (viewMode === 'year') {
      setCurrentYear(currentYear + 1);
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const goToYearView = () => {
    if (viewMode === 'month') {
      setAnimationDirection('shrink');
      setIsTransitioning(true);
      setTimeout(() => {
        setViewMode('year');
        setTimeout(() => setIsTransitioning(false), 50);
      }, 400);
    }
  };

  const switchToMonthView = (monthIndex: number) => {
    setAnimationDirection('expand');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentMonth(monthIndex);
      setViewMode('month');
      setTimeout(() => setIsTransitioning(false), 50);
    }, 400);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleReservation = async (reservation: { date: Date; carNumber: string; time: string; sessions?: number }) => {
    try {
      const timeRange = reservation.time.split(' - ');
      let startTime = timeRange[0].trim();
      let sessions = reservation.sessions || 1;

      const timeMatch = startTime.match(/(\d{1,2}):(\d{2})/);
      if (!timeMatch) {
        alert('올바른 시간 형식이 아닙니다.');
        return;
      }

      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      
      const reservationDateTime = new Date(reservation.date.getFullYear(), reservation.date.getMonth(), reservation.date.getDate(), hours, minutes);

      const kstISOString = `${reservationDateTime.getFullYear()}-${String(reservationDateTime.getMonth() + 1).padStart(2, '0')}-${String(reservationDateTime.getDate()).padStart(2, '0')}T${String(reservationDateTime.getHours()).padStart(2, '0')}:${String(reservationDateTime.getMinutes()).padStart(2, '0')}:${String(reservationDateTime.getSeconds()).padStart(2, '0')}+09:00`;

      const apiReservation = {
        type: 'car',
        target: parseInt(reservation.carNumber),
        emailaddress: 'user@example.com',
        time: kstISOString,
        session: sessions,
        reason: '차량 예약'
      };
      
      const response = await reservationApi.createReservation(apiReservation);
      
      if (response.success) {
        alert(`예약 완료: ${reservation.date.toLocaleDateString('ko-KR')} ${reservation.time}`);
        await fetchReservations();
        handleModalClose();
      } else {
        alert(`예약 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('예약 생성 중 오류:', error);
      alert('예약 생성 중 오류가 발생했습니다.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleModeToggle = (mode: 'meeting' | 'car') => {
    setSelectedMode(prev => (prev === mode ? null : mode));
    if (mode === 'car' && selectedMode !== 'car') {
      fetchReservations();
    } else {
      setReservations([]);
    }
  };

  const fetchReservations = async () => {
    try {
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const startDate = firstDay > today ? firstDay : today;
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = lastDay.toISOString().split('T')[0];
      
      const query = `time=gte.${startDateStr}&time=lte.${endDateStr}T23:59:59&type=eq.car&order=time.asc`;
      // 실제 fetch 로직은 주석 처리. PostgREST 환경이 필요합니다.
      // const response = await fetch(`/postgrest/reservation_table?${query}`);
      // if (response.ok) {
      //   const data = await response.json();
      //   setReservations(data);
      // }
      console.log(`Fetching reservations with query: ${query}`);
      // 임시 데이터 설정
      setReservations([
          { target: 1, time: new Date(currentYear, currentMonth, 15, 10, 0).toISOString(), session: 2, type: 'car' },
          { target: 2, time: new Date(currentYear, currentMonth, 20, 14, 0).toISOString(), session: 1, type: 'car' },
      ]);
    } catch (error) {
      console.error('예약 데이터 조회 실패:', error);
    }
  };

  const getReservationsForDate = (date: Date) => {
    // 로컬 시간 기준으로 날짜 문자열 생성 (UTC 오프셋 문제 방지)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    return reservations.filter(reservation => {
      // 예약 시간이 한국시간 기준인지 확인하고 파싱
      let reservationDate: Date;
      
      if (typeof reservation.time === 'string') {
        // ISO 문자열이면 한국시간 기준으로 파싱
        if (reservation.time.includes('+09:00')) {
          // 이미 한국시간 타임존 정보가 있는 경우
          reservationDate = new Date(reservation.time);
        } else if (reservation.time.includes('Z')) {
          // UTC 시간인 경우 -> 그대로 파싱하면 로컬 시간으로 자동 변환됨
          reservationDate = new Date(reservation.time);
        } else {
          // 타임존 정보가 없으면 한국시간으로 가정
          reservationDate = new Date(reservation.time + '+09:00');
        }
      } else {
        reservationDate = new Date(reservation.time);
      }
      
      const reservationYear = reservationDate.getFullYear();
      const reservationMonth = String(reservationDate.getMonth() + 1).padStart(2, '0');
      const reservationDay = String(reservationDate.getDate()).padStart(2, '0');
      const reservationDateString = `${reservationYear}-${reservationMonth}-${reservationDay}`;
      
      return reservationDateString === dateString && reservation.type === 'car';
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="w-40"></div>
          
          <div className="flex items-center">
            <button onClick={goToPrevious} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title={viewMode === 'year' ? '이전 년도' : '이전 월'}>
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            
            <h1 className="text-4xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-all mx-4" onClick={goToYearView}>
              <span className={`transition-all duration-500 ease-out inline-block ${isTransitioning ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                {viewMode === 'year' ? `${currentYear}년` : `${currentYear}년 ${months[currentMonth]}`}
              </span>
            </h1>
            
            <button onClick={goToNext} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title={viewMode === 'year' ? '다음 년도' : '다음 월'}>
              <ChevronRight size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="flex gap-3 w-40 justify-end">
            {viewMode === 'month' && (
              <>
                <button
                  className={`px-4 py-2 rounded-lg transition-all font-medium whitespace-nowrap shadow-sm hover:shadow-md ${selectedMode === 'meeting' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => handleModeToggle('meeting')}
                >
                  회의실
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-all font-medium whitespace-nowrap shadow-sm hover:shadow-md ${selectedMode === 'car' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => handleModeToggle('car')}
                >
                  차량
                </button>
              </>
            )}
          </div>
        </div>

        <div className={`transition-all duration-500 ease-out transform ${isTransitioning ? (animationDirection === 'expand' ? 'scale-150 opacity-0' : 'scale-50 opacity-0') : 'scale-100 opacity-100'}`}>
          {viewMode === 'year' ? (
            <div className="space-y-8">
              {[0, 3, 6, 9].map((quarterStart) => (
                <div key={quarterStart} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }, (_, index) => renderMonthCalendar(quarterStart + index))}
                </div>
              ))}
            </div>
          ) : (
            <div>{renderMonthView()}</div>
          )}
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-sm mx-auto">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-blue-500 rounded-full"></div><span className="text-gray-600">오늘</span></div>
              <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-red-100 border border-red-300 rounded-full"></div><span className="text-gray-600">일요일</span></div>
              <div className="flex items-center space-x-2"><div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded-full"></div><span className="text-gray-600">토요일</span></div>
            </div>
          </div>
        </div>

        {isModalOpen && selectedDate && (
          <>
            {selectedMode === 'car' ? (
              <ReservationModal isOpen={isModalOpen} onClose={handleModalClose} selectedDate={selectedDate} onReserve={handleReservation} existingReservations={reservations} />
            ) : (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                  <h2 className="text-2xl font-bold text-gray-800">날짜 정보</h2>
                  <p className="my-4">{selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
                  <button onClick={handleModalClose} className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">닫기</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
