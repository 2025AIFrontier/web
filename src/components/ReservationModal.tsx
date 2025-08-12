import React, { useState, useMemo, useEffect } from 'react';
import { Reservation } from '../types/reservation';
import { X, Calendar, Car, Clock, Sparkles } from 'lucide-react';

// ... (인터페이스 및 컴포넌트 선언부는 이전과 동일)
const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onReserve,
  existingReservations,
}) => {
  // ... (useState, useEffect, useMemo 등 상단 로직은 이전과 동일)
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedCar(null);
      setSelectedTimes([]);
      setSelectedPreset('');
    }
  }, [isOpen]);

  const timeSlots = useMemo(() => [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ], []);
  
  const timeLabels = useMemo(() => [
    '9시', '10시', '11시', '12시', '13시', '14시', '15시', '16시', '17시', '18시'
  ], []);

  const getReservedSlots = (carId: number) => {
    if (!selectedDate) return new Set<string>();
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    const reserved = new Set<string>();
    existingReservations
      .filter(res => {
        let reservationDate: Date;
        if (typeof res.time === 'string') {
          reservationDate = new Date(res.time.includes('Z') ? res.time : res.time.replace(' ', 'T') + '+09:00');
        } else {
          reservationDate = new Date(res.time);
        }
        const reservationDateString = `${reservationDate.getFullYear()}-${String(reservationDate.getMonth() + 1).padStart(2, '0')}-${String(reservationDate.getDate()).padStart(2, '0')}`;
        return reservationDateString === dateString && res.target === carId;
      })
      .forEach(res => {
        let reservationDate: Date;
        if (typeof res.time === 'string') {
            reservationDate = new Date(res.time.includes('Z') ? res.time : res.time.replace(' ', 'T') + '+09:00');
        } else {
            reservationDate = new Date(res.time);
        }
        const startHour = reservationDate.getHours();
        for (let i = 0; i < res.session; i++) {
          const hour = startHour + i;
          reserved.add(`${String(hour).padStart(2, '0')}:00`);
        }
      });
    return reserved;
  };

  const reservedSlotsCar1 = useMemo(() => getReservedSlots(1), [selectedDate, existingReservations]);
  const reservedSlotsCar2 = useMemo(() => getReservedSlots(2), [selectedDate, existingReservations]);

  const handleTimeClick = (clickedTime: string, carId: number) => {
    const reservedSlots = carId === 1 ? reservedSlotsCar1 : reservedSlotsCar2;
    if (reservedSlots.has(clickedTime)) return;
    setSelectedPreset('');
    if (selectedCar !== carId) {
      setSelectedCar(carId);
      setSelectedTimes([clickedTime]);
      return;
    }
    if (selectedTimes.length === 1 && selectedTimes[0] !== clickedTime) {
        const startIndex = timeSlots.indexOf(selectedTimes[0]);
        const endIndex = timeSlots.indexOf(clickedTime);
        const [start, end] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
        const newRange = timeSlots.slice(start, end + 1);
        const isRangeReserved = newRange.some(time => reservedSlots.has(time));
        if (isRangeReserved) {
            alert('선택한 범위에 이미 예약된 시간이 포함되어 있습니다. 다시 선택해주세요.');
            setSelectedTimes([clickedTime]);
        } else {
            setSelectedTimes(newRange);
        }
    } else {
        setSelectedTimes([clickedTime]);
    }
  };
  
  const handlePresetClick = (preset: 'morning' | 'afternoon' | 'allday') => {
    let presetTimes: string[] = [];
    switch (preset) {
      case 'morning': presetTimes = ['09:00', '10:00', '11:00']; break;
      case 'afternoon': presetTimes = ['13:00', '14:00', '15:00', '16:00','17:00']; break;
      case 'allday': presetTimes = timeSlots; break;
    }
    
    // 각 차량별 예약 가능 여부 확인
    const isCar1Available = !presetTimes.some(time => reservedSlotsCar1.has(time));
    const isCar2Available = !presetTimes.some(time => reservedSlotsCar2.has(time));
    
    let carAssigned = false;
    let selectedCarId = null;
    
    // 스마트 할당: 예약이 더 많은 차량을 우선 선택
    if (isCar1Available && isCar2Available) {
      // 둘 다 가능할 때: 예약이 더 많은 차량 우선 선택 (로드밸런싱)
      const car1ReservationCount = reservedSlotsCar1.size;
      const car2ReservationCount = reservedSlotsCar2.size;
      
      selectedCarId = car1ReservationCount >= car2ReservationCount ? 1 : 2;
    } else if (isCar1Available) {
      selectedCarId = 1;
    } else if (isCar2Available) {
      selectedCarId = 2;
    }
    
    if (selectedCarId) {
      setSelectedCar(selectedCarId);
      setSelectedTimes(presetTimes);
      carAssigned = true;
    }
    
    if (carAssigned) {
      setSelectedPreset(preset);
    } else {
      alert(`예약 가능한 차량이 없습니다.`);
      setSelectedPreset('');
      setSelectedCar(null);
      setSelectedTimes([]);
    }
  };

  const handleReserve = () => {
    if (selectedCar !== null && selectedTimes.length > 0) {
      onReserve({
        date: selectedDate,
        carNumber: String(selectedCar),
        time: selectedTimes[0],
        sessions: selectedTimes.length,
      });
      onClose();
    }
  };

  const getEndTime = () => {
    if (selectedTimes.length === 0) return '';
    const lastTime = selectedTimes[selectedTimes.length - 1];
    const hour = parseInt(lastTime.substring(0, 2), 10) + 1;
    return `${String(hour).padStart(2, '0')}:00`;
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto max-h-[95vh] flex flex-col">
        {/* ... (Header 부분은 이전과 동일) ... */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">차량 예약</h2>
            <div className="flex items-center text-gray-500 mt-2 space-x-4 text-sm">
              <div className="flex items-center"><Calendar size={16} className="mr-1.5" /> {selectedDate.toLocaleDateString('ko-KR')}</div>
              <div className="flex items-center"><Car size={16} className="mr-1.5" /> {selectedCar ? `${selectedCar}번 차량` : '타임라인에서 시간 선택'}</div>
              <div className="flex items-center"><Clock size={16} className="mr-1.5" /> {selectedTimes.length > 0 ? `${selectedTimes[0]} - ${getEndTime()} (${selectedTimes.length}시간)` : '시간 선택 전'}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* ... (스마트 예약 부분은 이전과 동일) ... */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <Sparkles size={20} className="mr-2 text-blue-500" />
              스마트 예약
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'morning', label: '오전' },
                { id: 'afternoon', label: '오후' },
                { id: 'allday', label: '종일' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePresetClick(p.id as any)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    selectedPreset === p.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <div className="font-semibold">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection Timeline */}
          <div className="space-y-6">
            {[
              { id: 1, name: '1번 차량', reserved: reservedSlotsCar1 },
              { id: 2, name: '2번 차량', reserved: reservedSlotsCar2 },
            ].map(car => (
              <div key={car.id}>
                <h3 className="mb-3 font-semibold text-gray-700">{car.name}</h3>
                <div className="relative pb-5"> {/* ✅ 레이블이 들어갈 공간 확보를 위해 padding-bottom 추가 */}
                  {/* 시간 블록 컨테이너 */}
                  <div className="flex rounded-md overflow-hidden">
                    {timeSlots.map(time => {
                      const isReserved = car.reserved.has(time);
                      const isSelected = selectedCar === car.id && selectedTimes.includes(time);
                      
                      const selectedStyle = isSelected ? { 
                        backgroundImage: 'linear-gradient(to top, #e0f2fe 25%, #10b981 35%)' 
                      } : {};

                      return (
                        <button
                          key={`${car.id}-${time}`}
                          onClick={() => handleTimeClick(time, car.id)}
                          disabled={isReserved}
                          style={selectedStyle}
                          className={`
                            flex-1 h-12 transition-colors duration-150
                            border-gray-300 border-l first:border-l-0
                            ${isReserved ? 'bg-gray-200 cursor-not-allowed' : 'bg-sky-100 hover:bg-sky-200'}
                          `}
                          aria-label={`${time}부터 1시간 예약`}
                        />
                      );
                    })}
                  </div>

                  {/* ✅ 수정된 타임라인 시간 레이블: Absolute Positioning 사용 */}
                  <div className="absolute w-full mt-1">
                    {timeLabels.map((label, index) => {
                      // 전체 타임라인(9칸) 대비 각 레이블의 위치 계산
                      const leftPosition = `${(index / timeSlots.length) * 100}%`;

                      // 첫번째, 마지막, 중간 레이블의 정렬을 위한 transform 클래스 설정
                      let transformClass = '-translate-x-1/2'; // 중간: 레이블 너비의 50%만큼 왼쪽으로 이동
                      if (index === 0) {
                        transformClass = 'translate-x-0'; // 첫번째: 이동 없음 (왼쪽 정렬)
                      } else if (index === timeLabels.length - 1) {
                        transformClass = '-translate-x-full'; // 마지막: 레이블 너비의 100%만큼 왼쪽으로 이동 (오른쪽 정렬)
                      }

                      return (
                        <div
                          key={label}
                          className={`absolute text-xs text-gray-500 ${transformClass} whitespace-nowrap`}
                          style={{ left: leftPosition }}
                        >
                          {label}
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ... (Footer 부분은 이전과 동일) ... */}
        <div className="p-6 border-t border-gray-200 mt-auto">
          <button
            onClick={handleReserve}
            disabled={selectedCar === null || selectedTimes.length === 0}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;