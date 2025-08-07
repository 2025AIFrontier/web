import React from 'react';
import { Truck, BarChart3, Clock, CheckCircle } from 'lucide-react';

const SCMPage: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">SCM 조회</h1>
        <p className="text-gray-600 text-lg">공급망 관리 현황과 물류 정보를 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: '공급업체', count: 45, icon: Truck, color: 'blue' },
          { title: '재고 현황', count: '98%', icon: BarChart3, color: 'emerald' },
          { title: '배송 중', count: 23, icon: Clock, color: 'amber' },
          { title: '완료 배송', count: 156, icon: CheckCircle, color: 'purple' }
        ].map((item, index) => (
          <div key={index} className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 rounded-xl shadow-sm p-6 border border-${item.color}-100`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${item.color}-600 rounded-lg`}>
                <item.icon className="text-white" size={20} />
              </div>
              <span className={`text-${item.color}-600 font-bold text-2xl`}>{item.count}</span>
            </div>
            <h3 className="font-semibold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-600">현재 상태</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">공급망 관리 시스템</h2>
          <p className="text-gray-600">실시간 물류 추적과 공급업체 관리를 제공합니다</p>
        </div>
        <div className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Truck className="text-white" size={16} />
              </div>
              <span className="text-blue-600 font-semibold">SCM 통합 관리</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              공급업체 관리, 재고 추적, 주문 처리, 배송 모니터링 등의 종합적인 SCM 기능을 제공할 예정입니다.
              실시간 알림, 예측 분석, 자동 발주 시스템 등의 고급 기능도 포함됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SCMPage;