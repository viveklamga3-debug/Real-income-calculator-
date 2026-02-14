
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount) || !isFinite(amount)) return '₹ 0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateFinancials = (salary: number, tax: number, loan: number, interest: number, tenure: number, inflation: number) => {
  // Salary Calculations
  const taxMultiplier = Math.max(0, 1 - (tax / 100));
  const yearlyInHand = Math.max(0, salary * taxMultiplier);
  const monthlyInHand = yearlyInHand / 12;

  // EMI Calculations
  const r = (interest / 12) / 100; // monthly interest rate
  const n = tenure * 12; // total number of months
  
  let monthlyEMI = 0;
  let totalPayment = 0;
  let totalInterest = 0;
  let inflationAdjustedCost = 0;

  if (loan > 0 && n > 0) {
    if (r > 0) {
      // Standard EMI formula
      monthlyEMI = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      // 0% interest case
      monthlyEMI = loan / n;
    }

    totalPayment = monthlyEMI * n;
    totalInterest = Math.max(0, totalPayment - loan);

    // Inflation Adjusted Cost (Present Value of the stream of EMI payments)
    const monthlyInflation = (inflation / 12) / 100;
    if (monthlyInflation > 0) {
      inflationAdjustedCost = 0;
      for (let i = 1; i <= n; i++) {
        inflationAdjustedCost += monthlyEMI / Math.pow(1 + monthlyInflation, i);
      }
    } else {
      inflationAdjustedCost = totalPayment;
    }
  }

  // Summary Calculations
  const remainingIncome = monthlyInHand - monthlyEMI;
  const savingsPercentage = monthlyInHand > 0 ? (remainingIncome / monthlyInHand) * 100 : 0;

  return {
    yearlyInHand,
    monthlyInHand,
    monthlyEMI,
    totalInterest,
    totalPayment,
    inflationAdjustedCost,
    remainingIncome,
    savingsPercentage
  };
};
