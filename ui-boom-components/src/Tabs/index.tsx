import React from 'react';
import { ReactElement } from 'react';

import { TabsContainer } from './styles';

export interface TabsProps {
  activeTab: string;
  onClick: (name: string) => void;
  color?: string;
}

const TabContent: React.FC<{
  content: React.ReactNode;
  isVisible: boolean;
}> = ({ content, isVisible }) => <div style={{ display: isVisible ? 'block' : 'none' }}>{content}</div>;

const MemoizedTabContent = React.memo(TabContent, (prevProps, nextProps) => prevProps.isVisible === nextProps.isVisible);

const Tabs: React.FC<TabsProps> = ({ children, activeTab, onClick, color = '#5ac0b1' }) => (
  <>
    <TabsContainer>
      {React.Children.map(children, (element) => {
        const e = element as ReactElement;
        return React.cloneElement(e, {
          ...e.props,
          activeTab,
          onClick,
          color,
        });
      })}
    </TabsContainer>
    {React.Children.map(children, (element) => {
      const { name, children } = (element as ReactElement).props;
      return <MemoizedTabContent content={children} isVisible={name === activeTab} />;
    })}
  </>
);

export { Tabs };
