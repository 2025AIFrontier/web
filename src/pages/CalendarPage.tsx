import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReservationModal from '../components/ReservationModal';
import { useReservationApi } from '../services/reservationApi';

interface CalendarPageProps {}

// 툴팁 위치를 위한 인터페이스 추가
interface HoveredDateInfo {
  date: Date;
  rect: DOMRect;
}

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

  // --- HOVER EFFECT STATE ---
  // 호버된 날짜 정보와 툴팁 위치를 저장할 상태
  const [hoveredDateInfo, setHoveredDateInfo] = useState<HoveredDateInfo | null>(null);
  // --- END HOVER EFFECT STATE ---

  const reservationApi = useReservationApi();

  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  useEffect(() => {
    if (selectedMode === 'car') {
      fetchReservations();
    }
  }, [currentYear, currentMonth, selectedMode]);

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

  const getMonthData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let todayPosition = -1;
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const isToday = currentDate.toDateString() === today.toDateString();
      
      if (isToday) {
        todayPosition = i;
      }
      
      days.push({
        date: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: isToday,
        fullDate: new Date(currentDate),
        weekNumber: getThursdayBasedWeekNumber(currentDate)
      });
    }
    
    // 해당 월의 모든 날짜를 활성화 (과거/미래 구분 없이)
    days.forEach(day => {
      day.isPast = false;
    });
    
    return days;
  };

  const renderMonthView = () => {
    const monthData = getMonthData(currentYear, currentMonth);
    
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto transform transition-all duration-300 hover:shadow-xl">
        <div className="p-6">
          <div className="grid grid-cols-8 gap-1 mb-4">
            <div className="text-center text-sm font-semibold py-3 text-gray-600">주차</div>
            {weekdays.map((day, index) => (
              <div key={day} className={`text-center text-sm font-semibold py-3 ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-600' : 'text-gray-600'}`}>
                {day}
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, weekIndex) => {
              const weekStart = weekIndex * 7;
              const weekData = monthData.slice(weekStart, weekStart + 7);
              if (weekData.length === 0) return null;
              
              return (
                <div key={weekIndex} className="grid grid-cols-8 gap-1">
                  <div className="text-center text-sm py-3 text-gray-500 font-medium flex items-center justify-center">
                    <div className="border border-gray-400 rounded px-2 py-1 bg-gray-50 text-sm">
                      {weekData[0]?.weekNumber}
                    </div>
                  </div>
                  
                  {weekData.map((day, dayIndex) => {
                    const dayReservations = selectedMode === 'car' && viewMode === 'month' ? getReservationsForDate(day.fullDate) : [];
                    
                    return (
                      <div
                        key={weekStart + dayIndex}
                        className={`text-center rounded-lg transition-all duration-200 flex flex-col items-center justify-center ${selectedMode === 'car' && viewMode === 'month' ? 'py-1 h-20' : 'py-3 h-14'} ${day.isPast && day.isCurrentMonth ? 'text-gray-400 cursor-not-allowed opacity-50' : day.isToday ? 'bg-blue-500 text-white font-bold hover:bg-blue-600 cursor-pointer' : dayIndex === 0 ? (day.isCurrentMonth ? 'text-red-500 font-semibold cursor-pointer hover:bg-blue-50' : 'text-red-400 cursor-pointer hover:text-gray-500') : dayIndex === 6 ? (day.isCurrentMonth ? 'text-blue-600 font-semibold cursor-pointer hover:bg-blue-50' : 'text-blue-400 cursor-pointer hover:text-gray-500') : day.isCurrentMonth ? 'text-gray-900 cursor-pointer hover:bg-blue-100' : 'text-gray-300 cursor-pointer hover:text-gray-500'}`}
                        onClick={() => !day.isPast && handleDateClick(day.fullDate)}
                      >
                        <div className="text-lg font-medium">{day.date}</div>
                        
                        {selectedMode === 'car' && viewMode === 'month' && (
                          <div className="mt-1 space-y-1 w-full">
                            <div className="flex justify-center">
                              <div className="flex h-2 bg-gray-200 rounded-sm" style={{ width: '45px' }}>
                                {Array.from({ length: 9 }, (_, i) => {
                                  const hour = 9 + i;
                                  const isReserved = dayReservations.some(res => {
                                    if (res.target !== 1) return false;
                                    let reservationDate: Date;
                                    if (typeof res.time === 'string') {
                                      if (res.time.includes('+09:00')) reservationDate = new Date(res.time);
                                      else if (res.time.includes('Z')) reservationDate = new Date(res.time);
                                      else reservationDate = new Date(res.time + '+09:00');
                                    } else {
                                      reservationDate = new Date(res.time);
                                    }
                                    const startHour = reservationDate.getHours();
                                    return hour >= startHour && hour < startHour + res.session;
                                  });
                                  return (<div key={i} className={`flex-1 ${i > 0 ? 'border-l border-white' : ''} ${isReserved ? 'bg-green-500' : 'bg-gray-200'}`} style={{ width: '5px' }} />);
                                })}
                              </div>
                            </div>
                            
                            <div className="flex justify-center">
                              <div className="flex h-2 bg-gray-200 rounded-sm" style={{ width: '45px' }}>
                                {Array.from({ length: 9 }, (_, i) => {
                                  const hour = 9 + i;
                                  const isReserved = dayReservations.some(res => {
                                    if (res.target !== 2) return false;
                                    let reservationDate: Date;
                                    if (typeof res.time === 'string') {
                                      if (res.time.includes('+09:00')) reservationDate = new Date(res.time);
                                      else if (res.time.includes('Z')) reservationDate = new Date(res.time);
                                      else reservationDate = new Date(res.time + '+09:00');
                                    } else {
                                      reservationDate = new Date(res.time);
                                    }
                                    const startHour = reservationDate.getHours();
                                    return hour >= startHour && hour < startHour + res.session;
                                  });
                                  return (<div key={i} className={`flex-1 ${i > 0 ? 'border-l border-white' : ''} ${isReserved ? 'bg-orange-500' : 'bg-gray-200'}`} style={{ width: '5px' }} />);
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

  // --- HOVER EVENT HANDLERS ---
  const handleDateMouseEnter = (e: React.MouseEvent<HTMLDivElement>, date: Date) => {
    // 마우스가 날짜 위로 올라왔을 때
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDateInfo({ date, rect });
  };

  const handleDateMouseLeave = () => {
    // 마우스가 날짜를 벗어났을 때
    setHoveredDateInfo(null);
  };
  // --- END HOVER EVENT HANDLERS ---

  // 연간 달력 렌더링 (★ 여기가 핵심 수정 부분입니다)
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
                      <div className="border border-gray-400 rounded px-1 py-0.5 bg-gray-50 text-xs">{weekData[0]?.weekNumber}</div>
                    </div>
                    
                    {weekData.map((day, dayIndex) => (
                      <div
                        key={weekStart + dayIndex}
                        className={`text-center text-sm py-2 cursor-pointer rounded-lg transition-all duration-200 hover:bg-blue-50 ${day.isToday ? 'bg-blue-500 text-white font-bold hover:bg-blue-600' : dayIndex === 0 ? (day.isCurrentMonth ? 'text-red-500 font-semibold' : 'text-red-400') : dayIndex === 6 ? (day.isCurrentMonth ? 'text-blue-600 font-semibold' : 'text-blue-400') : day.isCurrentMonth ? 'text-gray-900 hover:bg-blue-100' : 'text-gray-300 hover:text-gray-500'}`}
                        // ★★★ 변경점: onClick 대신 onMouseEnter와 onMouseLeave 사용 ★★★
                        onMouseEnter={(e) => handleDateMouseEnter(e, day.fullDate)}
                        onMouseLeave={handleDateMouseLeave}
                        // 월간 보기로 전환하기 위해 클릭 기능은 유지
                        onClick={() => switchToMonthView(day.month)}
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
  
// --- TOOLTIP COMPONENT (수정된 버전) ---
  const renderTooltip = () => {
    if (!hoveredDateInfo) return null;

    const { date: selectedDate, rect } = hoveredDateInfo;

    // --- 오늘과의 차이 계산 로직 ---
    const today = new Date();
    // 계산의 정확성을 위해 오늘 날짜의 시간은 00:00:00으로 설정
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // 1. 일수 차이 계산
    const diffTime = selectedDate.getTime() - todayStart.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let dayDiffText = '';
    if (diffDays === 0) {
      dayDiffText = '오늘';
    } else if (diffDays > 0) {
      dayDiffText = `${diffDays}일 후`;
    } else {
      dayDiffText = `${Math.abs(diffDays)}일 전`;
    }

    // 2. 주차 차이 계산
    const todayWeek = getThursdayBasedWeekNumber(today);
    const selectedWeek = getThursdayBasedWeekNumber(selectedDate);
    const weekDiff = selectedWeek - todayWeek;
    
    let weekDiffText = '';
    if (weekDiff > 0) {
      weekDiffText = ` (${weekDiff}주 후)`;
    } else if (weekDiff < 0) {
      weekDiffText = ` (${Math.abs(weekDiff)}주 전)`;
    }
    // --- 계산 로직 끝 ---

    const style = {
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top}px`,
      transform: 'translateX(-50%) translateY(-100%) translateY(-8px)',
    };

    return (
      <div 
        className="fixed z-50 p-3 bg-gray-900 text-white rounded-lg shadow-xl text-sm whitespace-nowrap animate-fade-in-up pointer-events-none"
        style={style}
      >
        <div className="font-bold text-base mb-2 text-center">
          {selectedDate.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}
          <span className="ml-2 text-blue-300 font-medium">
            W{getThursdayBasedWeekNumber(selectedDate)}
          </span>
        </div>
        <div className="bg-gray-700 h-px my-1"></div> {/* 구분선 */}
        <div className="text-center text-gray-200">
          {dayDiffText}
          <span className="text-gray-400">{weekDiffText}</span>
        </div>
      </div>
    );
  };
  // --- END TOOLTIP COMPONENT ---

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
      let startTime: string;
      let sessions = 1;
      
      if (reservation.sessions && reservation.sessions > 0) {
        sessions = reservation.sessions;
        startTime = timeRange[0].trim();
      } else if (timeRange.length === 2) {
        startTime = timeRange[0].trim();
        const startHour = parseInt(timeRange[0].split(':')[0]);
        const endHour = parseInt(timeRange[1].split(':')[0]);
        sessions = endHour - startHour + 1;
      } else {
        startTime = reservation.time.trim();
        sessions = 1;
      }

      const timeMatch = startTime.match(/(\d{1,2}):(\d{2})/);
      if (!timeMatch) {
        alert('올바른 시간 형식이 아닙니다.');
        return;
      }

      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      
      const year = reservation.date.getFullYear();
      const month = reservation.date.getMonth();
      const day = reservation.date.getDate();
      
      const reservationDateTime = new Date(year, month, day, hours, minutes, 0, 0);

      const kstISOString = reservationDateTime.getFullYear() + '-' +
        String(reservationDateTime.getMonth() + 1).padStart(2, '0') + '-' +
        String(reservationDateTime.getDate()).padStart(2, '0') + 'T' +
        String(reservationDateTime.getHours()).padStart(2, '0') + ':' +
        String(reservationDateTime.getMinutes()).padStart(2, '0') + ':' +
        String(reservationDateTime.getSeconds()).padStart(2, '0') + '+09:00';

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
        alert(`예약이 완료되었습니다!\n날짜: ${reservation.date.toLocaleDateString('ko-KR')}\n차량: ${reservation.carNumber}번\n시간: ${reservation.time}`);
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
    if (selectedMode === mode) {
      setSelectedMode(null);
      setReservations([]);
    } else {
      setSelectedMode(mode);
      if (mode === 'car') {
        fetchReservations();
      } else {
        setReservations([]);
      }
    }
  };

  const fetchReservations = async () => {
    try {
      // 해당 월 1일에서 -7일, 말일에서 +7일
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      
      // ±7일 확장
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date(lastDay);
      endDate.setDate(endDate.getDate() + 7);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
      const response = await fetch(`${baseUrl}/api/reservation_calendar?date_from=${startDateStr}&date_to=${endDateStr}T23:59:59&type=car`);
      
      if (response.ok) {
        const result = await response.json();
        const data = result.success ? result.data : [];
        setReservations(data);
      }
    } catch (error) {
      console.error('예약 데이터 조회 실패:', error);
    }
  };

  const getReservationsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    return reservations.filter(reservation => {
      let reservationDate: Date;
      
      if (typeof reservation.time === 'string') {
        if (reservation.time.includes('+09:00')) {
          reservationDate = new Date(reservation.time);
        } else if (reservation.time.includes('Z')) {
          reservationDate = new Date(reservation.time);
        } else {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="w-40"></div>
          
          <div className="flex items-center">
            <button onClick={goToPrevious} className="p-2 hover:bg-gray-100 rounded transition-colors duration-200 mr-4" title={viewMode === 'year' ? '이전 년도' : '이전 월'}>
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-4xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-all duration-300 transform hover:scale-105" onClick={goToYearView}>
              <span className={`transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                {viewMode === 'year' ? `${currentYear}년 달력` : `${currentYear}년 ${months[currentMonth]}`}
              </span>
            </h1>
            <button onClick={goToNext} className="p-2 hover:bg-gray-100 rounded transition-colors duration-200 ml-4" title={viewMode === 'year' ? '다음 년도' : '다음 월'}>
              <ChevronRight size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="flex gap-3 w-40 justify-end">
            {viewMode === 'month' && (
              <>
                <button className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium whitespace-nowrap ${selectedMode === 'meeting' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => handleModeToggle('meeting')}>
                  회의실
                </button>
                <button className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium whitespace-nowrap ${selectedMode === 'car' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => handleModeToggle('car')}>
                  차량
                </button>
              </>
            )}
          </div>
        </div>

        <div className={`transition-all duration-500 ease-out transform origin-center ${isTransitioning ? (animationDirection === 'expand' ? 'scale-150 opacity-0' : 'scale-50 opacity-0') : 'scale-100 opacity-100'}`}>
          {viewMode === 'year' ? (
            <div className="space-y-8">
              {[0, 3, 6, 9].map((quarterStart) => (
                <div key={quarterStart} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }, (_, index) => renderMonthCalendar(quarterStart + index))}
                </div>
              ))}
            </div>
          ) : (
            <div className="transform transition-all duration-500 ease-out">
              {renderMonthView()}
            </div>
          )}
        </div>
        
        {/* ★★★ 툴팁 렌더링 호출 ★★★ */}
        {renderTooltip()}


        {isModalOpen && selectedDate && (
          <>
            {selectedMode === 'car' ? (
              <ReservationModal isOpen={isModalOpen} onClose={handleModalClose} selectedDate={selectedDate} onReserve={handleReservation} existingReservations={reservations} />
            ) : (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">날짜 정보</h2>
                    <button onClick={handleModalClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-3">
                          <span>{selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
                          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">W{getThursdayBasedWeekNumber(selectedDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>오늘과의 차이:</span>
                        <span className="font-medium">{(() => {
                          const today = new Date();
                          const diffTime = selectedDate.getTime() - today.setHours(0, 0, 0, 0);
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          const todayWeek = getThursdayBasedWeekNumber(today);
                          const selectedWeek = getThursdayBasedWeekNumber(selectedDate);
                          const weekDiff = selectedWeek - todayWeek;
                          let result = '';
                          if (diffDays === 0) result = '오늘';
                          else if (diffDays > 0) result = `${diffDays}일 후`;
                          else result = `${Math.abs(diffDays)}일 전`;
                          if (weekDiff !== 0) {
                            if (weekDiff > 0) result += ` (${weekDiff}주 후)`;
                            else result += ` (${Math.abs(weekDiff)}주 전)`;
                          }
                          return result;
                        })()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleModalClose} className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">닫기</button>
                    <button className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200" onClick={handleModalClose}>확인</button>
                  </div>
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