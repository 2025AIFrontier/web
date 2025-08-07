import React from 'react';

const MeetingRoomPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">회의실 예약</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center text-gray-600">
            <div className="mb-4">
              <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">회의실 예약 시스템</h2>
            <p className="text-gray-500">회의실 예약 기능이 곧 제공될 예정입니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoomPage;