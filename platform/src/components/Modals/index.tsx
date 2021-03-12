import React, { useEffect, useState, useRef, useContext } from 'react';
import { Overlay, ModalWrapper, CloseIcon } from './styles';
import ReactDOM from 'react-dom';
import { v4 } from 'uuid';
import { ModalContext, useModal } from 'hook/useModal';

const MODAL: React.FC<{ id: string; style?: React.CSSProperties }> = ({ id, style, children }) => {
  const [modalNodeCreated, setModalNodeCreated] = useState(false);
  const { onClose } = useContext(ModalContext);

  const modalRef = useRef(null);
  const modalWrapperId = useRef(v4());

  const ref = useRef(document.createElement('div'));

  useEffect(() => {
    if (modalRef) {
      document.body.style.overflow = 'hidden';

      ref.current.setAttribute('id', modalWrapperId.current);
      const rootElement = document.getElementById('root');
      document.body.insertBefore(ref.current, rootElement);
      setModalNodeCreated(true);
    }

    const modalWrapper = document.getElementById(modalWrapperId.current);
    return () => {
      document.body.style.overflow = '';

      modalWrapper?.parentNode?.removeChild(modalWrapper);
    };
  }, [modalRef]);

  return modalNodeCreated
    ? ReactDOM.createPortal(
        <Overlay
          ref={modalRef}
          onClick={(e) => {
            e.stopPropagation();
            onClose(id);
          }}
        >
          <ModalWrapper style={style} onClick={(e) => e.stopPropagation()}>
            <CloseIcon size={14} name="close" onClick={() => onClose(id)} />
            {children}
          </ModalWrapper>
        </Overlay>,
        ref.current
      )
    : null;
};

export const Modal: React.FC<{ id: string; style?: React.CSSProperties }> = ({ id, style, children }) => {
  const { isModalOpen } = useModal();

  return isModalOpen(id) ? (
    <MODAL id={id} style={style}>
      {children}
    </MODAL>
  ) : null;
};
