import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div className="h-full w-full">
      {/* Admin iframe 다시 활성화 */}
      <iframe
        src="http://localhost:3002"
        className="w-full h-full border-none"
        title="관리자 대시보드"
        style={{ minHeight: 'calc(100vh - 100px)' }}
      />
    </div>
  );
};

export default AdminPage;