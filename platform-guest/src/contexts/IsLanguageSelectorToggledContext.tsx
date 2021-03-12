import React from 'react';
import { useState } from 'react';

type IsLanguageSelectorToggledContextT = { toggled: boolean; setToggled: () => void };

export const IsLanguageSelectorToggledContext = React.createContext<IsLanguageSelectorToggledContextT>(
  {} as IsLanguageSelectorToggledContextT
);

export const IsLanguageSelectorToggledProvider: React.FC = ({ children }) => {
  const [toggled, setToggled] = useState(false);

  return (
    <IsLanguageSelectorToggledContext.Provider value={{ toggled, setToggled: () => setToggled(!toggled) }}>
      {children}
    </IsLanguageSelectorToggledContext.Provider>
  );
};
