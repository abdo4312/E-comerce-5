import React from 'react';

interface BreadcrumbItem {
  name: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const ChevronLeftIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
);

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="bg-gray-100">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
            {items.map((item, index) => (
            <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2"><ChevronLeftIcon /></span>}
                {item.onClick ? (
                <a
                    href="#"
                    onClick={(e) => {
                    e.preventDefault();
                    item.onClick?.();
                    }}
                    className="hover:text-orange-500 hover:underline"
                >
                    {item.name}
                </a>
                ) : (
                <span className="font-medium text-gray-700">{item.name}</span>
                )}
            </li>
            ))}
        </ol>
        </nav>
    </div>
  );
};

export default Breadcrumbs;
