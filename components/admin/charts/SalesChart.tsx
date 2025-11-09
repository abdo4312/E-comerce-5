import React, { useMemo } from 'react';

interface SalesChartProps {
    data: { day: string; sales: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
    
    const maxSales = useMemo(() => {
        if (!data || data.length === 0) return 0;
        const max = Math.max(...data.map(d => d.sales));
        // Return a minimum value to avoid division by zero and ensure bars are visible even for small values
        return Math.max(max, 100);
    }, [data]);
    
    if (!data || data.length === 0 || data.every(d => d.sales === 0)) {
        return (
            <div className="h-72 flex items-center justify-center text-gray-400">
                <p>لا توجد بيانات مبيعات كافية لعرض الرسم البياني.</p>
            </div>
        );
    }
    
    return (
        <div className="h-72 flex justify-around items-end space-x-2 rtl:space-x-reverse border-b border-gray-200 pb-4">
            {data.map((item, index) => {
                const barHeight = maxSales > 0 ? (item.sales / maxSales) * 100 : 0;
                
                return (
                    <div key={index} className="flex-1 flex flex-col items-center group relative">
                        <div 
                            className="absolute -top-8 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        >
                            {item.sales.toFixed(2)} جنيه
                        </div>
                        <div
                            className="w-3/4 bg-blue-200 rounded-t-md hover:bg-blue-400 transition-colors"
                            style={{ height: `${barHeight}%` }}
                        ></div>
                        <span className="text-xs font-semibold text-gray-500 mt-2">{item.day}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default SalesChart;