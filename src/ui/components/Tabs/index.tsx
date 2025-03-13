import { useEffect, useRef, useState } from "react";
import { TabComponentProps } from "./@types/props";
import './styles.css'

export const TabComponent = ({ tabs, className, defaultTab }: TabComponentProps) => {

    const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || '');
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
    const tabsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);

    const updateIndicator = (tabId: string) => {
        const button = tabsRef.current.get(tabId);
        const container = containerRef.current;

        if (button && container) {
            const buttonRect = button.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            setIndicatorStyle({
                width: `${buttonRect.width}px`,
                transform: `translateX(${buttonRect.left - containerRect.left}px)`,
            });
        }
    };

    useEffect(() => {
        if (activeTab) {
            updateIndicator(activeTab);

            const handleResize = () => updateIndicator(activeTab);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [activeTab]);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="relative" ref={containerRef}>
                <div className="flex overflow-x-auto hide-scrollbar items-center space-x-4 py-2 mb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            ref={(el) => {
                                if (el) tabsRef.current.set(tab.id, el);
                                else tabsRef.current.delete(tab.id);
                            }}
                            onClick={() => handleTabClick(tab.id)}
                            className={`tab-button relative px-3 py-2 text-md transition-colors duration-300 
                                focus:outline-none whitespace-nowrap
                                ${activeTab === tab.id
                                    ? "text-primary-9--dark"
                                    : "text-dark-11"}`}
                            aria-selected={activeTab === tab.id}
                            role="tab"
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div
                    className="tab-indicator absolute bottom-0 h-0.5 bg-primary-9--dark rounded-full"
                    style={indicatorStyle}
                />
            </div>

            <div className="mt-6">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`tab-content" ${activeTab === tab.id ? "active" : "hidden"}`}
                        role="tabpanel"
                        aria-labelledby={tab.id}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
};