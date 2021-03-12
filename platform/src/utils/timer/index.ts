export const startTimer = () => {
  const start = performance.now();
  return {
    end: () => Number(((performance.now() - start) / 1000).toFixed(2)),
  };
};
