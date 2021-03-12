import React, { useState, useMemo, useEffect } from 'react';
import { usePopper } from 'react-popper';

import { TooltipText } from './TooltipText';
import { MiniDatePicker } from './MiniDatePicker';
import { CloseIcon, EllipsisTypography } from './styles';
export const TooltipDatePicker: React.FC<{
  label: string;
  doneLabel?: string;
  style?: React.CSSProperties;
  start?: Date | null;
  end?: Date | null;
  lang?: string;
  disabled?: boolean;
  onChangeDate: (start: Date | null, end: Date | null) => void;
}> = ({ label, doneLabel, start, end, lang = navigator.language, disabled, onChangeDate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [popperRef, setPopperRef] = useState<HTMLDivElement | null>(null);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(targetRef, popperRef, {
    placement: 'bottom-start',
  });

  useEffect(() => {
    const closePicker = () => setIsOpen(false);
    window.addEventListener('click', closePicker);

    return () => window.removeEventListener('click', closePicker);
  }, [setIsOpen]);

  const rangeToString = useMemo(() => {
    let rangeArray = [];
    const formatOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    start && rangeArray.push(start.toLocaleDateString(lang, formatOptions));
    end && rangeArray.push(end.toLocaleDateString(lang, formatOptions));
    return rangeArray.join(' - ');
  }, [start, end]);

  return (
    <>
      <div
        ref={setTargetRef}
        onClick={(e) => {
          e.stopPropagation();
          !disabled && setIsOpen(true);
        }}
        data-testid="tooltip-date-picker"
      >
        <TooltipText label={label} disabled={disabled}>
          <EllipsisTypography>{rangeToString}</EllipsisTypography>
          {start && (
            <CloseIcon
              height="20"
              width="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                  onChangeDate(null, null);
                  setIsOpen(false);
                }
              }}
            >
              <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
            </CloseIcon>
          )}
        </TooltipText>
      </div>
      <div ref={setPopperRef} style={{ ...styles.popper, zIndex: 10000 }} {...attributes.popper} onClick={(e) => e.stopPropagation()}>
        {isOpen && (
          <MiniDatePicker
            start={start}
            end={end}
            doneLabel={doneLabel}
            onSelectDate={(start, end) => {
              onChangeDate(start, end);
              setIsOpen(false);
            }}
            lang={lang}
          />
        )}
      </div>
    </>
  );
};
