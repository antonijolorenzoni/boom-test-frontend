import React, { useEffect, useState } from 'react';
import spinnerImg from 'assets/icons/loading.svg';

const stepNumber = 12;

export const SpinnerIcon = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    setTimeout(() => setStep((s) => (s + 1) % stepNumber), 100);
  }, [step]);
  return (
    <img alt="spinner" src={spinnerImg} style={{ width: '10px', height: '10px', transform: `rotate(${(360 / stepNumber) * step}deg)` }} />
  );
};
