const cutAndAppendSuffix = (value: string, maxLength: number, suffix: string = '...'): string => {
  if (value.length > maxLength) {
    return `${value.substring(0, maxLength - 1)}${suffix}`;
  }
  return value;
};

export { cutAndAppendSuffix };
