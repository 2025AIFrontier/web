import React from 'react';
import { LogIn } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">A.IPC Dashboard</h1>
          <p className="text-gray-600">Internal 통합 관리 시스템</p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              시스템에 접속하려면 아래 버튼을 클릭하세요
            </p>
            <p className="text-sm text-blue-600 mb-6">
              향후 AD SSO 인증이 적용될 예정입니다.
            </p>
            
            <button
              onClick={onLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <LogIn size={20} />
              바로 접속
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>© 2024 Internal A.IPC Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;