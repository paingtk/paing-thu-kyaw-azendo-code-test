export type CardType = "Visa" | "MasterCard" | "Unknown";

export interface CardComposable {
  formatCreditCard: (value: string) => string;
  formatExpiryDate: (value: string) => string;
  formatCVV: (value: string) => string;
  getCardType: (value: string) => string;
}

export function useCard(): CardComposable {
  const formatCreditCard = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");

    // Default formatting: 4-4-4-4
    return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiryDate = (value: string): string => {
    let formattedValue = value.replace(/\D/g, "");
    if (formattedValue.length >= 2) {
      formattedValue =
        formattedValue.substring(0, 2) + "/" + formattedValue.substring(2, 4);
    }
    return formattedValue;
  };

  const formatCVV = (value: string): string => {
    return value.replace(/\D/g, "");
  };

  const getCardType = (value: string): string => {
    const number = value.replace(/\s/g, "");
    if (number.match(/^4/)) return "Visa";
    if (number.match(/^5[1-5]/)) return "MasterCard";
    if (number.match(/^2[2-7]/)) return "MasterCard";
    return "💳";
  };

  return {
    getCardType,
    formatCreditCard,
    formatExpiryDate,
    formatCVV,
  };
}
