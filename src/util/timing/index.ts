function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay= 1000,
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null;

  return function debouncedFunction(this: any, ...args: Parameters<T>): void {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func.apply(this, args);
      timerId = null;
    }, delay);
  };
}

export { debounce };
