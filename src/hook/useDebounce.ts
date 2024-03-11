// import { useState, useEffect } from "react";

// const useDebounce = (value: string, delay: number = 500) => {
//   const [debounced, setDebounced] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => setDebounced(value), delay);

//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   // 0.5초안에 입력이 있을 경우 돌아야되니까
//   return debounced;
// };

// export default useDebounce;

import { useState, useEffect } from "react";

function useDebounce(value: string, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
