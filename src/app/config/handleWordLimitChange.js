export const handleWordLimitChange = (value, setWordLimit, setError) => {
    // Allow null or numbers only
    if (value === null || (Number(value) >= 0 && Number(value) <= 1000)) {
      setWordLimit(value);
      setError(''); // Clear any existing word limit errors
    }
  };
  