export type TabItem = {
    id: string;
    label: string;
    content: React.ReactNode;
  };
  
export type TabComponentProps = {
    tabs: TabItem[];
    defaultTab?: string;
    className?: string;
  };