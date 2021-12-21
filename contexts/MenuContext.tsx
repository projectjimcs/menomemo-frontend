import React, { createContext, useContext, useState } from 'react';

const MENUS = {
  basic: [
    'login',
  ],
  employee: [
    'patients',
    'bookings',
  ],
  admin: [
    'patients',
    'bookings',
    'employees',
  ],
}

interface MenuContextValue {
  menu: string[];
  changeMenu(menuType: string | null): void;
}

const MenuContext = createContext<MenuContextValue>({
  menu: MENUS.basic,
  changeMenu() {},
});

export function useMenu() {
  return useContext(MenuContext);
}

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState(MENUS.basic);

  function changeMenu (menuType: string | null = null) {
    const newMenu = menuType ? MENUS[menuType] : MENUS['basic'];

    setMenu(newMenu);
  }

  return (
    <MenuContext.Provider value={{menu, changeMenu}}>
      {children}
    </MenuContext.Provider>
  );
}