import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ProjectData } from './TaskPage';

interface TaskPageBottomSectionProps {
  projectData: ProjectData[];
}

export const TaskPageBottomSection: React.FC<TaskPageBottomSectionProps> = ({ projectData }) => {
  const [baseDate, setBaseDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const getChartData = () => {
    const startDate = new Date(baseDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6);
    
    const chartData: any[] = [];
    
    // 매달 1일 기준점들을 먼저 생성
    const monthlyPoints: any[] = [];
    const currentDate = new Date(startDate);
    currentDate.setDate(1); // 월 첫째날로 설정
    
    while (currentDate <= endDate) {
      monthlyPoints.push({
        date: currentDate.getTime(),
        dateStr: currentDate.toLocaleDateString('ko-KR', { month: 'short' }),
        isMonthMarker: true
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    // 프로젝트별 데이터 처리
    projectData.forEach((project, projectIndex) => {
      const stages = [
        { name: 'DVR', planned: project.DVR_계획, actual: project.DVR_실행, color: '#3b82f6', lightColor: '#93c5fd' },
        { name: 'PVR', planned: project.PVR_계획, actual: project.PVR_실행, color: '#10b981', lightColor: '#6ee7b7' },
        { name: 'PRA', planned: project.PRA_계획, actual: project.PRA_실행, color: '#f59e0b', lightColor: '#fbbf24' },
        { name: 'SRA', planned: project.SRA_계획, actual: project.SRA_실행, color: '#ef4444', lightColor: '#f87171' }
      ];
      
      stages.forEach(stage => {
        const hasPlanned = stage.planned && stage.planned.trim() !== '';
        const hasActual = stage.actual && stage.actual.trim() !== '';
        
        if (hasPlanned || hasActual) {
          const plannedDate = hasPlanned ? new Date(stage.planned) : null;
          const actualDate = hasActual ? new Date(stage.actual) : null;
          
          // 계획일이 범위 내에 있는 경우
          if (plannedDate && plannedDate >= startDate && plannedDate <= endDate) {
            chartData.push({
              date: plannedDate.getTime(),
              dateStr: plannedDate.toLocaleDateString('ko-KR'),
              project: project.과제,
              projectType: project.과제구분,
              stage: stage.name,
              type: '계획',
              color: stage.lightColor,
              y: projectIndex,
              [`${stage.name}_${projectIndex}`]: projectIndex,
              projectIndex: projectIndex,
              stageName: stage.name
            });
          }
          
          // 실행일이 범위 내에 있는 경우
          if (actualDate && actualDate >= startDate && actualDate <= endDate) {
            chartData.push({
              date: actualDate.getTime(),
              dateStr: actualDate.toLocaleDateString('ko-KR'),
              project: project.과제,
              projectType: project.과제구분,
              stage: stage.name,
              type: '실행',
              color: stage.color,
              y: projectIndex,
              [`${stage.name}_${projectIndex}`]: projectIndex,
              projectIndex: projectIndex,
              stageName: stage.name
            });
          }
        }
      });
    });
    
    // 날짜순으로 정렬
    chartData.sort((a, b) => a.date - b.date);
    
    // 월별 마커와 함께 반환
    return { chartData, monthlyPoints };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.isMonthMarker) return null;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.project} ({data.projectType})</p>
          <p className="text-sm text-gray-600">{data.stage} - {data.type}</p>
          <p className="text-sm">{data.dateStr}</p>
        </div>
      );
    }
    return null;
  };

  const getDateRange = () => {
    const startDate = new Date(baseDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6);
    
    return {
      start: startDate.getTime(),
      end: endDate.getTime()
    };
  };

  const getMonthlyTicks = () => {
    const startDate = new Date(baseDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6);
    
    const ticks = [];
    const currentDate = new Date(startDate);
    currentDate.setDate(1);
    
    while (currentDate <= endDate) {
      ticks.push(currentDate.getTime());
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return ticks;
  };

  const generateLines = () => {
    const { chartData } = getChartData();
    const lines: JSX.Element[] = [];
    
    // 프로젝트별, 단계별로 라인 생성
    const groupedData = chartData.reduce((acc: any, item: any) => {
      const key = `${item.projectIndex}_${item.stageName}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    Object.entries(groupedData).forEach(([key, data]: [string, any]) => {
      const sortedData = data.sort((a: any, b: any) => a.date - b.date);
      if (sortedData.length >= 2) {
        const stageColor = sortedData[0].stage === 'DVR' ? '#3b82f6' :
                          sortedData[0].stage === 'PVR' ? '#10b981' :
                          sortedData[0].stage === 'PRA' ? '#f59e0b' : '#ef4444';
        
        lines.push(
          <Line
            key={key}
            type="linear"
            dataKey={`${sortedData[0].stageName}_${sortedData[0].projectIndex}`}
            stroke={stageColor}
            strokeWidth={3}
            dot={{ fill: stageColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: stageColor, strokeWidth: 2 }}
            connectNulls={false}
          />
        );
      }
    });

    return lines;
  };

  const { chartData, monthlyPoints } = getChartData();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">프로젝트 타임라인</h2>
            <p className="text-gray-600">선택한 시작일로부터 6개월간의 프로젝트 일정을 시각화합니다</p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="baseDate" className="text-sm font-medium text-gray-700">
              시작일:
            </label>
            <input
              id="baseDate"
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* 범례 */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-600"></div>
            <span className="text-sm text-gray-600">DVR (계획 → 실행)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-600"></div>
            <span className="text-sm text-gray-600">PVR (계획 → 실행)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-yellow-600"></div>
            <span className="text-sm text-gray-600">PRA (계획 → 실행)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-600"></div>
            <span className="text-sm text-gray-600">SRA (계획 → 실행)</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            
            {/* 매달 1일 세로선 */}
            {getMonthlyTicks().map((tick, index) => (
              <ReferenceLine 
                key={`month-${index}`}
                x={tick} 
                stroke="#e5e7eb" 
                strokeDasharray="2 2"
              />
            ))}
            
            <XAxis 
              type="number"
              dataKey="date"
              domain={[getDateRange().start, getDateRange().end]}
              ticks={getMonthlyTicks()}
              tickFormatter={(value) => new Date(value).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
              stroke="#666"
            />
            <YAxis 
              type="number"
              dataKey="y"
              domain={[0, projectData.length - 1]}
              tickFormatter={(value) => {
                const projectIndex = Math.round(value);
                return projectData[projectIndex]?.과제 || '';
              }}
              width={90}
              stroke="#666"
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* 동적으로 생성된 라인들 */}
            {generateLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};