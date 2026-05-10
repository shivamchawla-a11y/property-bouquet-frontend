export const formatPrice = (value) => {
  if (!value) return "0";

  const num = Number(value);

  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + " Cr";
  }

  if (num >= 100000) {
    return (num / 100000).toFixed(2) + " Lakh";
  }

  return num.toString();
};