import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ==================================
// 0. 타입 정의
// ==================================
interface RawExchangeData {
  [key: string]: number | string;
  date: string;
  USD: number;
  EUR: number;
  JPY100: number;
  CNH: number;
}

interface ProcessedExchangeData {
  date: string;
  [key: string]: number | string;
}

interface CurrencyPair {
  base: string;
  quote: string;
  key: string;
}

// ==================================
// 내부 설정 및 로직
// ==================================
const CHART_COLORS = ['#2563eb','#dc2626','#16a34a','#ca8a04','#9333ea','#c2410c','#0891b2','#be123c','#4338ca','#059669'] as const;
const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'JPY', 'CNH', 'KRW'] as const;
type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

const CURRENCY_NAMES: Record<SupportedCurrency, string> = {
  USD: '미국 달러', EUR: '유로', JPY: '일본 엔', CNH: '중국 위안', KRW: '한국 원'
};

const DEFAULT_SELECTED_PAIRS: CurrencyPair[] = [
  { base: 'USD', quote: 'KRW', key: 'USD/KRW' }, { base: 'EUR', quote: 'KRW', key: 'EUR/KRW' },
  { base: 'JPY', quote: 'KRW', key: 'JPY/KRW' }, { base: 'CNH', quote: 'KRW', key: 'CNH/KRW' },
  { base: 'EUR', quote: 'USD', key: 'EUR/USD' }, { base: 'USD', quote: 'JPY', key: 'USD/JPY' },
];

const convertToBaseRates = (rawItem: RawExchangeData): Record<string, number> => ({
    USD: rawItem.USD || 0, EUR: rawItem.EUR || 0, JPY: (rawItem.JPY100 || 0) / 100, CNH: rawItem.CNH || 0, KRW: 1.0
});

const calculateCrossRate = (baseRates: Record<string, number>, base: string, quote: string): number => {
    const baseRate = baseRates[base], quoteRate = baseRates[quote];
    if (!baseRate || !quoteRate || quoteRate === 0) return 0;
    return Number((baseRate / quoteRate).toFixed(4));
};

const processExchangeData = (rawData: RawExchangeData[], selectedPairs: CurrencyPair[]): ProcessedExchangeData[] => {
    if (!rawData || rawData.length === 0) return [];
    return rawData.map(rawItem => {
        const baseRates = convertToBaseRates(rawItem);
        const result: ProcessedExchangeData = { date: rawItem.date };
        selectedPairs.forEach(pair => {
            result[pair.key] = calculateCrossRate(baseRates, pair.base, pair.quote);
        });
        return result;
    });
};

// ==================================
// 메인 컴포넌트
// ==================================
export const ExchangeBottomSection = ({ rawData }: { rawData: RawExchangeData[] }) => {
    const [selectedPairs, setSelectedPairs] = useState<CurrencyPair[]>(DEFAULT_SELECTED_PAIRS);
    const [isSelecting, setIsSelecting] = useState(false);
    
    const processedData = useMemo(() => processExchangeData(rawData, selectedPairs), [rawData, selectedPairs]);

    const { chartData, normalizationInfo } = useMemo(() => {
        if (processedData.length === 0 || selectedPairs.length === 0) return { chartData: [], normalizationInfo: new Map() };
        
        const pairRanges = new Map<string, { min: number; max: number }>();
        selectedPairs.forEach(pair => {
            const values = processedData.slice(0, 14).map(item => item[pair.key] as number).filter(v => typeof v === 'number' && v > 0);
            if (values.length > 0) pairRanges.set(pair.key, { min: Math.min(...values), max: Math.max(...values) });
        });
        
        const formattedData = processedData.slice(0, 14).reverse().map(item => {
            const formattedItem: any = { date: new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) };
            selectedPairs.forEach(pair => {
                const originalValue = item[pair.key] as number;
                const range = pairRanges.get(pair.key);
                if (range && typeof originalValue === 'number' && originalValue > 0) {
                    formattedItem[pair.key] = range.max === range.min ? 0.5 : (originalValue - range.min) / (range.max - range.min);
                } else {
                    formattedItem[pair.key] = 0;
                }
            });
            return formattedItem;
        });
        return { chartData: formattedData, normalizationInfo: pairRanges };
    }, [processedData, selectedPairs]);

    const denormalizeValue = (normalized: number, key: string) => {
        const range = normalizationInfo.get(key);
        return !range ? 0 : range.min + (normalized * (range.max - range.min));
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload || payload.length === 0) return null;
        return (
            <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900 mb-2">{label}</p>
                {payload.map((entry: any, i: number) => (
                    <p key={i} className="text-sm" style={{ color: entry.color }}>
                        <span className="font-medium">{entry.dataKey}:</span> {denormalizeValue(entry.value, entry.dataKey).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    </p>
                ))}
            </div>
        );
    };

    const allPossiblePairs = useMemo((): CurrencyPair[] => {
        const pairs: CurrencyPair[] = [];
        for (const base of SUPPORTED_CURRENCIES) {
            for (const quote of SUPPORTED_CURRENCIES) {
                if (base !== quote && base !== 'KRW') pairs.push({ base, quote, key: `${base}/${quote}` });
            }
        }
        return pairs;
    }, []);

    const groupedPairs = useMemo(() => allPossiblePairs.reduce((acc, p) => ({...acc, [p.base]: [...(acc[p.base]||[]), p]}), {} as {[key:string]: CurrencyPair[]}), [allPossiblePairs]);
    const krwPresetPairs = useMemo(() => allPossiblePairs.filter(p => p.quote === 'KRW'), [allPossiblePairs]);

    const togglePair = (pair: CurrencyPair) => {
        setSelectedPairs(prev => {
            const exists = prev.some(p => p.key === pair.key);
            if (exists) return prev.filter(p => p.key !== pair.key);
            if (prev.length >= 10) { alert('최대 10개의 교차환율만 선택할 수 있습니다.'); return prev; }
            return [...prev, pair];
        });
    };
    
    const applyPreset = (preset: CurrencyPair[]) => {
        setSelectedPairs(prev => {
           const newPairs = preset.filter(p => !prev.some(sp => sp.key === p.key));
           if (prev.length + newPairs.length > 10) {
               alert('최대 10개까지 선택 가능합니다. 일부만 추가됩니다.');
               const remainingSlots = 10 - prev.length;
               return [...prev, ...newPairs.slice(0, remainingSlots)];
           }
           return [...prev, ...newPairs];
        });
    };

    const formatRate = (rate: number): string => {
        if (rate === 0 || !rate) return '-';
        return rate.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    };

    if (!rawData || rawData.length === 0) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-7xl mx-auto">
            <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">교차환율 상세 분석</h2>
                    <p className="text-gray-600 text-sm">선택된 환율의 14일간 추세와 데이터를 비교합니다.</p>
                </div>
                <button onClick={() => setIsSelecting(!isSelecting)} className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">{isSelecting ? '선택 완료' : '환율 선택'}</button>
            </div>

            {isSelecting && (
                <div className="p-6 bg-blue-50 border-b border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">표시할 교차환율 선택 (최대 10개)</h3>
                    <div className="flex items-center gap-2 mb-4">
                        <button onClick={() => applyPreset(krwPresetPairs)} className="px-3 py-1 text-xs rounded-md border bg-green-100 text-green-700 border-green-300 hover:bg-green-200">KRW 프리셋 추가</button>
                        <button onClick={() => setSelectedPairs([])} className="px-3 py-1 text-xs bg-red-100 text-red-600 border border-red-300 rounded-md hover:bg-red-200">선택 초기화</button>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(groupedPairs).map(([base, pairs]) => (
                            <div key={base} className="flex flex-wrap items-center gap-2">
                                <strong className="w-16 text-sm text-gray-800">{base} 기준</strong>
                                <div className="flex flex-wrap gap-2">
                                    {pairs.map(p => {
                                        const isSelected = selectedPairs.some(sp => sp.key === p.key);
                                        return <button key={p.key} onClick={() => togglePair(p)} disabled={!isSelected && selectedPairs.length >= 10} className={`px-3 py-1.5 text-sm rounded-md border ${isSelected ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50'}`}>{p.key}</button>
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-6">
                {selectedPairs.length > 0 ? (
                    <>
                        <div className="h-96 mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
                                    <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} stroke="#666" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    {selectedPairs.map((p, i) => <Line key={p.key} type="monotone" dataKey={p.key} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2} dot={false} />)}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500 text-sm text-purple-800 mb-6">
                            <span className="font-medium">정규화 차트:</span> 각 환율의 14일간 Min-Max 값을 0~100% 범위로 변환하여 상대적 변화 추이를 비교합니다.
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-600">날짜</th>
                                        {selectedPairs.map(p => <th key={p.key} className="px-4 py-2 text-right font-medium text-gray-600">{p.key}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {processedData.slice(0, 14).map((row, i) => (
                                        <tr key={i} className={i === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                                            <td className="px-4 py-2 font-medium text-gray-800">{new Date(row.date).toLocaleDateString('ko-KR')}</td>
                                            {selectedPairs.map(p => <td key={p.key} className="px-4 py-2 text-right text-gray-900 font-mono">{formatRate(row[p.key] as number)}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p className="mb-2">표시할 교차환율을 선택해주세요.</p>
                        <p className="text-sm">'환율 선택' 버튼을 눌러 시작하세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
