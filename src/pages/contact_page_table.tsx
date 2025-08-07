import React from 'react';
import { User, Search, RefreshCw, X } from 'lucide-react';
import { Employee } from '../types/api';

interface ContactPageTableProps {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  totalCount: number;
  onSearchChange: (term: string) => void;
  onRefresh: () => void;
}

const ContactPageTable: React.FC<ContactPageTableProps> = ({
  employees,
  loading,
  error,
  searchTerm,
  totalCount,
  onSearchChange,
  onRefresh
}) => {
  const filteredEmployees = employees.filter(employee =>
    employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const departmentStats = employees.reduce((acc, employee) => {
    const dept = employee.department_name || '기타';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topDepartments = Object.entries(departmentStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  const colors = ['blue', 'emerald', 'purple', 'amber'];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {topDepartments.map(([dept, count], index) => {
          const color = colors[index] || 'gray';
          return (
            <div key={dept} className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-xl shadow-sm p-6 border border-${color}-100`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${color}-600 rounded-lg`}>
                  <User className="text-white" size={20} />
                </div>
                <span className={`text-${color}-600 font-bold text-2xl`}>{count}</span>
              </div>
              <h3 className="font-semibold text-gray-800">{dept}</h3>
              <p className="text-sm text-gray-600">명의 담당자</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">담당자 목록</h2>
              <p className="text-gray-600">총 {totalCount}명의 담당자가 등록되어 있습니다</p>
            </div>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="이름, 이메일, 부서로 검색..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                title="검색어 지우기"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">데이터를 불러오는 중...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={onRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                다시 시도
              </button>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">이름</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">이메일</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">부서</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">회사</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">설명</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{employee.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{employee.email_address}</td>
                      <td className="py-3 px-4 text-gray-600">{employee.department_name}</td>
                      <td className="py-3 px-4 text-gray-600">{employee.company_name}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{employee.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPageTable;