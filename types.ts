
export interface SalaryState {
  annualSalary: number;
  taxRate: number;
}

export interface EMIState {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  inflationRate: number;
}

export interface CalculationResults {
  yearlyInHand: number;
  monthlyInHand: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  inflationAdjustedCost: number;
  remainingIncome: number;
  savingsPercentage: number;
}
