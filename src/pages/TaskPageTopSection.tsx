import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, Calendar, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { ProjectData } from './TaskPage';

type SortField = '과제구분' | '과제' | 'DVR_계획' | 'DVR_실행' | 'PVR_계획' | 'PVR_실행' | 'PRA_계획' | 'PRA_실행' | 'SRA_계획' | 'SRA_실행';
type SortDirection = 'asc' | 'desc';

interface TaskPageTopSectionProps {
  projectData: ProjectData[];
}

export const TaskPageTopSection: React.FC<TaskPageTopSectionProps> = ({ projectData }) => {
  const [filteredData, setFilteredData] = useState<ProjectData[]>([]);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setFilteredData(projectData);
  }, [projectData]);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString.trim() === '') return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  const getProjectStats = () => {
    const totalProjects = filteredData.length;
    const completedProjects = filteredData.filter(project => 
      project.SRA_실행 && project.SRA_실행.trim() !== '' && new Date(project.SRA_실행) <= new Date()
    ).length;
    const delayedProjects = filteredData.filter(project => {
      if (!project.SRA_계획 || project.SRA_계획.trim() === '') return false;
      const sraPlanned = new Date(project.SRA_계획);
      const sraActual = project.SRA_실행 && project.SRA_실행.trim() !== '' ? new Date(project.SRA_실행) : new Date();
      return sraActual > sraPlanned;
    }).length;

    return { totalProjects, completedProjects, delayedProjects };
  };

  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'MOB': return 'bg-blue-100 text-blue-800';
      case 'TAB': return 'bg-green-100 text-green-800';
      case 'ETC': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (planned: string, actual: string) => {
    if (!actual || actual.trim() === '') return '';
    if (!planned || planned.trim() === '') return 'bg-gray-100 text-gray-800';
    
    const plannedDate = new Date(planned);
    const actualDate = new Date(actual);
    
    if (isNaN(plannedDate.getTime()) || isNaN(actualDate.getTime())) {
      return 'bg-gray-100 text-gray-800';
    }
    
    if (actualDate <= plannedDate) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    
    const sorted = [...filteredData].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      // 날짜 필드의 경우 Date 객체로 변환
      if (field.includes('계획') || field.includes('실행')) {
        const aDate = aValue && aValue.trim() !== '' ? new Date(aValue) : new Date(0);
        const bDate = bValue && bValue.trim() !== '' ? new Date(bValue) : new Date(0);
        aValue = aDate.getTime().toString();
        bValue = bDate.getTime().toString();
      }
      
      if (newDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
    
    setFilteredData(sorted);
  };

  const handleFilter = () => {
    let filtered = [...projectData];
    
    // 과제구분 필터
    if (filterType !== 'all') {
      filtered = filtered.filter(project => project.과제구분 === filterType);
    }
    
    // 상태 필터
    if (filterStatus !== 'all') {
      filtered = filtered.filter(project => {
        const isCompleted = project.SRA_실행 && project.SRA_실행.trim() !== '' && new Date(project.SRA_실행) <= new Date();
        const isDelayed = project.SRA_계획 && project.SRA_계획.trim() !== '' && 
          ((project.SRA_실행 && project.SRA_실행.trim() !== '' && new Date(project.SRA_실행) > new Date(project.SRA_계획)) ||
           (!project.SRA_실행 && new Date() > new Date(project.SRA_계획)));
        
        switch (filterStatus) {
          case 'completed':
            return isCompleted;
          case 'delayed':
            return isDelayed;
          case 'inProgress':
            return !isCompleted && !isDelayed;
          default:
            return true;
        }
      });
    }
    
    setFilteredData(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [filterType, filterStatus, projectData]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-gray-600" /> : 
      <ChevronDown className="w-4 h-4 text-gray-600" />;
  };

  const stats = getProjectStats();

  return (
    <>
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <span className="text-blue-600 text-2xl font-bold">{stats.totalProjects}</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">전체 과제</h3>
          <p className="text-sm text-gray-600">진행 중인 프로젝트</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl shadow-sm p-6 border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-600 rounded-lg">
              <CheckCircle className="text-white" size={24} />
            </div>
            <span className="text-emerald-600 text-2xl font-bold">{stats.completedProjects}</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">완료된 과제</h3>
          <p className="text-sm text-gray-600">SRA 완료 기준</p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl shadow-sm p-6 border border-amber-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-600 rounded-lg">
              <Clock className="text-white" size={24} />
            </div>
            <span className="text-amber-600 text-2xl font-bold">{stats.delayedProjects}</span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">지연된 과제</h3>
          <p className="text-sm text-gray-600">계획 대비 지연</p>
        </div>
      </div>

      {/* 과제 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">과제 일정 관리</h2>
              <p className="text-gray-600">프로젝트별 단계별 진행 상황과 일정을 확인하세요</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체 구분</option>
                  <option value="MOB">MOB</option>
                  <option value="TAB">TAB</option>
                  <option value="ETC">ETC</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">전체 상태</option>
                  <option value="completed">완료</option>
                  <option value="inProgress">진행중</option>
                  <option value="delayed">지연</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  onClick={() => handleSort('과제구분')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    과제구분
                    {getSortIcon('과제구분')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('과제')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    과제명
                    {getSortIcon('과제')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('DVR_계획')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    DVR
                    {getSortIcon('DVR_계획')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('PVR_계획')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    PVR
                    {getSortIcon('PVR_계획')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('PRA_계획')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    PRA
                    {getSortIcon('PRA_계획')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('SRA_계획')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    SRA
                    {getSortIcon('SRA_계획')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((project, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProjectTypeColor(project.과제구분)}`}>
                      {project.과제구분}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.과제}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {project.DVR_계획 && project.DVR_계획.trim() !== '' && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          <span>계획: {formatDate(project.DVR_계획)}</span>
                        </div>
                      )}
                      {project.DVR_실행 && project.DVR_실행.trim() !== '' && (
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.DVR_계획, project.DVR_실행)}`}>
                            실행: {formatDate(project.DVR_실행)}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {project.PVR_계획 && project.PVR_계획.trim() !== '' && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          <span>계획: {formatDate(project.PVR_계획)}</span>
                        </div>
                      )}
                      {project.PVR_실행 && project.PVR_실행.trim() !== '' && (
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.PVR_계획, project.PVR_실행)}`}>
                            실행: {formatDate(project.PVR_실행)}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {project.PRA_계획 && project.PRA_계획.trim() !== '' && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          <span>계획: {formatDate(project.PRA_계획)}</span>
                        </div>
                      )}
                      {project.PRA_실행 && project.PRA_실행.trim() !== '' && (
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.PRA_계획, project.PRA_실행)}`}>
                            실행: {formatDate(project.PRA_실행)}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {project.SRA_계획 && project.SRA_계획.trim() !== '' && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          <span>계획: {formatDate(project.SRA_계획)}</span>
                        </div>
                      )}
                      {project.SRA_실행 && project.SRA_실행.trim() !== '' && (
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.SRA_계획, project.SRA_실행)}`}>
                            실행: {formatDate(project.SRA_실행)}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};