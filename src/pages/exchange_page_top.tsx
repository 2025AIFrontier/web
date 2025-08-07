import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

// ==================================
// 0. API로부터 받는 데이터 타입 정의
// ==================================
interface RawExchangeData {
  [key: string]: number | string;
  date: string;
  USD: number;
  EUR: number;
  JPY100: number;
  CNH: number;
}

// ==================================
// 1. 아이콘 컴포넌트 (SVG)
// ==================================
const ArrowUpRight = ({ size = 16, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 17l10-10"/><path d="M7 7h10v10"/></svg>
);
const ArrowDownRight = ({ size = 16, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 7l10 10"/><path d="M17 7v10H7"/></svg>
);
const CheckCircle2 = ({ size = 20, className = '', fill = 'none' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

// ==================================
// 2. 통화 설정 정보
// ==================================
const CURRENCY_CONFIG = {
  USD: { key: 'USD', label: '미국 달러', stroke: '#3B82F6' },
  EUR: { key: 'EUR', label: '유로', stroke: '#10B981' },
  JPY100: { key: 'JPY100', label: '일본 옌 (100)', stroke: '#8B5CF6' },
  CNH: { key: 'CNH', label: '중국 위안', stroke: '#F59E0B' },
};

// ==================================
// 3. 데이터 처리 로직 (커스텀 훅)
// ==================================
const useExchangeData = (rawData: RawExchangeData[]) => {
  const CROSS_RATE_BASES = ['USD', 'EUR', 'JPY', 'CNH'];
  const CROSS_RATE_QUOTES = ['KRW', 'USD', 'EUR', 'JPY', 'CNH'];

  const formatRate = (rate: number, decimals: number = 2): string =>
    rate.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const chartData = useMemo(() => {
    if (!rawData) return [];
    return rawData.slice(0, 14)
      .map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace(/\s/g, ''),
      }))
      .reverse();
  }, [rawData]);

  const latestRates = useMemo(() => rawData?.[0] || null, [rawData]);

  const getChangeData = (currencyKey: keyof RawExchangeData) => {
    if (!rawData || rawData.length < 2) return { value: 0, percentage: 0, isPositive: true };
    const current = rawData[0][currencyKey] as number;
    const previous = rawData[1][currencyKey] as number;
    const valueChange = current - previous;
    const percentageChange = previous === 0 ? 0 : (valueChange / previous) * 100;
    return {
      value: valueChange,
      percentage: Math.abs(percentageChange),
      isPositive: valueChange >= 0,
    };
  };

  const crossRateData = useMemo(() => {
    if (!rawData) return [];
    return rawData.map(rawItem => {
      const baseRates = {
        USD: rawItem.USD || 0,
        EUR: rawItem.EUR || 0,
        JPY: (rawItem.JPY100 || 0) / 100,
        CNH: rawItem.CNH || 0,
        KRW: 1.0,
      };
      const result: { [key: string]: number | string } = { date: rawItem.date };
      CROSS_RATE_BASES.forEach(base => {
        CROSS_RATE_QUOTES.forEach(quote => {
          if (base === quote) return;
          const key = `${base}/${quote}`;
          const baseRateInKRW = baseRates[base];
          const quoteRateInKRW = baseRates[quote];
          result[key] = quoteRateInKRW === 0 ? 0 : (baseRateInKRW / quoteRateInKRW);
        });
      });
      return result;
    });
  }, [rawData]);

  return { latestRates, chartData, crossRateData, getChangeData, formatRate };
};

// ==================================
// 4. UI 하위 컴포넌트들
// ==================================

const CurrencyCard = ({ currencyConfig, rate, change, isSelected, onToggle, formatRate }) => (
  <div onClick={onToggle} className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${isSelected ? 'bg-blue-50 border-blue-500 shadow-lg' : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-md'}`}>
    {isSelected && <CheckCircle2 className="absolute top-2 right-2 text-blue-500" size={20} fill="white" />}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-8 rounded" style={{ backgroundColor: currencyConfig.stroke }} />
        <div>
          <p className="text-lg font-bold text-gray-800">{currencyConfig.key === 'JPY100' ? 'JPY' : currencyConfig.key}</p>
          <p className="text-xs text-gray-500">{currencyConfig.label}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">{formatRate(rate)}</p>
        <div className={`flex items-center justify-end gap-1 text-sm font-medium ${change.isPositive ? 'text-red-600' : 'text-blue-600'}`}>
          {change.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{formatRate(change.value, 2)} ({change.percentage.toFixed(2)}%)</span>
        </div>
      </div>
    </div>
  </div>
);

const CrossRateMiniChart = ({ pairLabel, data, strokeColor }) => {
  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;
  const yDomain = useMemo(() => {
    const values = data.map(d => d.value).filter(v => v > 0);
    if (values.length === 0) return ['auto', 'auto'];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const margin = (max - min) * 0.2;
    return [min - margin, max + margin];
  }, [data]);
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-sm text-gray-700">{pairLabel}</p>
        <p className="font-bold text-base text-gray-900">{latestValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</p>
      </div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <Tooltip contentStyle={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd' }} labelStyle={{ fontWeight: 'bold' }} formatter={(value) => [value.toFixed(4), '환율']} />
            <defs>
              <linearGradient id={`color-${pairLabel.replace('/', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={strokeColor} fill={`url(#color-${pairLabel.replace('/', '')})`} strokeWidth={2} connectNulls={true} />
            <YAxis domain={yDomain} hide />
            <XAxis dataKey="date" hide />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CrossRateSection = ({ baseCurrency, data }) => {
  const PAIRS_CONFIG = { USD: ['KRW', 'EUR', 'JPY', 'CNH'], EUR: ['KRW', 'USD', 'JPY', 'CNH'], JPY: ['KRW', 'USD', 'EUR', 'CNH'], CNH: ['KRW', 'USD', 'EUR', 'JPY'] };
  const quoteCurrencies = PAIRS_CONFIG[baseCurrency];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {quoteCurrencies.map(quoteCurrency => {
        if (baseCurrency === quoteCurrency) return null;
        const pairKey = `${baseCurrency}/${quoteCurrency}`;
        const chartData = data.map(d => ({ date: d.date, value: d[pairKey] || 0 })).reverse();
        return <CrossRateMiniChart key={pairKey} pairLabel={pairKey} data={chartData} strokeColor="#4A5568" />;
      })}
    </div>
  );
};

// ==================================
// 5. 메인 컴포넌트
// ==================================
export const ExchangeTopSection = ({ rawData }: { rawData: RawExchangeData[] }) => {
  const { latestRates, chartData, crossRateData, getChangeData, formatRate } = useExchangeData(rawData);
  const [selectedCurrencies, setSelectedCurrencies] = useState(['USD']);
  const [crossRateBase, setCrossRateBase] = useState('USD');

  const toggleCurrency = (key: string) => {
    setSelectedCurrencies(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const yAxisDomain = useMemo(() => {
    if (selectedCurrencies.length === 0) return ['auto', 'auto'];
    let min = Infinity, max = -Infinity;
    chartData.forEach(item => {
      selectedCurrencies.forEach(key => {
        const value = item[key] as number;
        if (value < min) min = value;
        if (value > max) max = value;
      });
    });
    if (min === Infinity) return ['auto', 'auto'];
    const margin = (max - min) * 0.1;
    return [Math.floor(min - margin), Math.ceil(max + margin)];
  }, [chartData, selectedCurrencies]);

  if (!latestRates) {
    return <div className="p-6 text-center font-sans">환율 데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="font-sans space-y-8">
      <section className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">주요 통화 환율</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md border border-gray-200 p-4 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={{ stroke: '#d1d5db' }} />
                <YAxis domain={yAxisDomain} fontSize={12} tickLine={false} axisLine={{ stroke: '#d1d5db' }} tickFormatter={(val) => `₩${val.toLocaleString()}`} />
                <Tooltip formatter={(value, name) => [formatRate(value as number), CURRENCY_CONFIG[name as string]?.label || name]} />
                <Legend formatter={(value) => CURRENCY_CONFIG[value as string]?.label || value} />
                {Object.values(CURRENCY_CONFIG).map(config => (
                  selectedCurrencies.includes(config.key) && (
                    <Line key={config.key} type="monotone" dataKey={config.key} stroke={config.stroke} strokeWidth={2} dot={false} name={config.key} />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full lg:w-1/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {Object.values(CURRENCY_CONFIG).map(config => (
              <CurrencyCard key={config.key} currencyConfig={config} rate={latestRates[config.key] as number} change={getChangeData(config.key as keyof RawExchangeData)} isSelected={selectedCurrencies.includes(config.key)} onToggle={() => toggleCurrency(config.key)} formatRate={formatRate} />
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">교차 환율 비교</h2>
          <div className="flex items-center gap-1 p-1 bg-gray-200 rounded-lg">
            {['USD', 'EUR', 'JPY', 'CNH'].map(base => (
              <button key={base} onClick={() => setCrossRateBase(base)} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${crossRateBase === base ? 'bg-white text-blue-600 shadow' : 'bg-transparent text-gray-600 hover:bg-gray-300'}`}>
                {base} 기준
              </button>
            ))}
          </div>
        </div>
        <CrossRateSection baseCurrency={crossRateBase} data={crossRateData} />
      </section>
    </div>
  );
};