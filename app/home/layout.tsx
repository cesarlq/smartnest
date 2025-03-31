import React from 'react';
import MenuComponent from '../components/lateralMenu/MenuComponent';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid">
      <MenuComponent>
        {children}
     </MenuComponent>
    </div>
  );
}