import React, { useCallback, useContext, useState } from 'react';

interface ModalContextValue {
  openModal: (id: string) => void;
  onClose: (id: string) => void;
  isModalOpen: (id: string) => boolean;
}

export const ModalContext = React.createContext<ModalContextValue>({} as ModalContextValue);

export const ModalProvider: React.FC = ({ children }) => {
  const [open, setOpen] = useState<Array<string>>([]);

  const onClose = useCallback((id: string) => {
    setOpen((ids) => ids.filter((currentIds) => currentIds !== id));
  }, []);

  const openModal = useCallback(
    (id: string) =>
      setOpen((ids) => {
        return Array.from(new Set([...ids, id]));
      }),
    []
  );

  const isModalOpen = useCallback((id: string) => open.includes(id), [open]);

  return <ModalContext.Provider value={{ isModalOpen, onClose, openModal }}>{children}</ModalContext.Provider>;
};

export const useModal = () => useContext(ModalContext);
