import React, { useState, lazy, Suspense } from 'react';
import { Layout } from './components/Layout';
import { ActiveTab } from './types/common';
import LoginPage from './pages/LoginPage';
import { ConfigProvider } from './contexts/ConfigContext';

// lazy load 적용
const ExchangePage = lazy(() => import('./pages/exchange_page'));
const ContactPage = lazy(() => import('./pages/contact_page'));
const TaskPage = lazy(() => import('./pages/TaskPage'));
const SCMPage = lazy(() => import('./pages/SCMPage'));
const CollectPage = lazy(() => import('./pages/CollectPage'));
const MeetingRoomPage = lazy(() => import('./pages/MeetingRoomPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'exchange':
        return <ExchangePage />;
      case 'manager':
        return <ContactPage />;
      case 'task':
        return <TaskPage />;
      case 'scm':
        return <SCMPage />;
      case 'collect':
        return <CollectPage />;
      case 'meeting-room':
        return <MeetingRoomPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <DashboardPage />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <ConfigProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        <Suspense fallback={<div>로딩 중...</div>}>
          {renderContent()}
        </Suspense>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
