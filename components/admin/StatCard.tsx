import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'indigo' | 'amber' | 'emerald';
}

const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
};


const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    const classes = colorClasses[color];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 rtl:space-x-reverse">
            <div className={`p-4 rounded-full ${classes.bg} ${classes.text}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
