import React, { useState, useMemo } from 'react';
import { calculateFinancials, formatCurrency } from './utils';
import { 
  Wallet, 
  CreditCard, 
  PieChart, 
  Info, 
  ShieldCheck, 
  HelpCircle, 
  RotateCcw, 
  X, 
  MessageCircleQuestion 
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

// Modal component for supplemental information (About & Legal)
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
      <div className="bg-[#1A1A1A] border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 bg-[#1A1A1A] border-b border-zinc-800 p-6 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-[#10B981]">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded">
            <X size={24} />
          </button>
        </div>
        <div className="p-8 text-gray-400 leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [annualSalary, setAnnualSalary] = useState<string>('');
  const [taxRate, setTaxRate] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [tenure, setTenure] = useState<string>('');
  const [inflationRate, setInflationRate] = useState<string>('');
  
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'about' | null>(null);

  const results = useMemo(() => {
    return calculateFinancials(
      parseFloat(annualSalary) || 0,
      parseFloat(taxRate) || 0,
      parseFloat(loanAmount) || 0,
      parseFloat(interestRate) || 0,
      parseFloat(tenure) || 0,
      parseFloat(inflationRate) || 0
    );
  }, [annualSalary, taxRate, loanAmount, interestRate, tenure, inflationRate]);

  const debtRatio = useMemo(() => {
    if (!results.monthlyInHand || results.monthlyInHand <= 0) return 0;
    return (results.monthlyEMI / results.monthlyInHand) * 100;
  }, [results.monthlyEMI, results.monthlyInHand]);

  const handleClear = () => {
    setAnnualSalary('');
    setTaxRate('');
    setLoanAmount('');
    setInterestRate('');
    setTenure('');
    setInflationRate('');
  };

  const getStatusColor = (percentage: number, invert = false) => {
    if (invert) {
        if (percentage > 40) return 'text-red-500';
        if (percentage > 25) return 'text-amber-500';
        return 'text-[#10B981]';
    }
    if (percentage < 0) return 'text-red-500';
    if (percentage < 15) return 'text-amber-500';
    return 'text-[#10B981]';
  };

  const getBarColor = (percentage: number) => {
    if (percentage > 45) return 'bg-red-500';
    if (percentage > 30) return 'bg-amber-500';
    return 'bg-[#10B981]';
  };

  const scrollToFAQ = () => {
    const element = document.getElementById('faq-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-[#EDEDED] selection:bg-[#10B981] selection:text-black">
      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        <header className="mb-12 text-center relative">
          <button 
            onClick={handleClear}
            className="absolute right-0 top-0 flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors bg-[#1A1A1A] px-3 py-2 rounded border border-zinc-800"
          >
            <RotateCcw size={14} /> CLEAR ALL
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-[#10B981] mb-4">Real Income Calculator</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Calculate your true spending power after taxes, loans, and inflation.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Section 1: Income */}
          <section className="bg-[#1A1A1A] p-8 border border-zinc-800 rounded-lg shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#10B981]/10 rounded">
                <Wallet className="text-[#10B981]" size={24} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Income</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Annual Salary (₹)</label>
                <input
                  type="number"
                  placeholder="Gross Yearly Pay"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] text-[#EDEDED] transition-all text-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] text-[#EDEDED] transition-all text-lg"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-800">
                <div className="bg-[#0F0F0F] p-4 rounded border border-zinc-800">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Yearly Net</p>
                  <p className="text-xl font-bold text-[#10B981]">{formatCurrency(results.yearlyInHand)}</p>
                </div>
                <div className="bg-[#0F0F0F] p-4 rounded border border-zinc-800">
                  <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Monthly Net</p>
                  <p className="text-xl font-bold text-[#10B981]">{formatCurrency(results.monthlyInHand)}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Debt */}
          <section className="bg-[#1A1A1A] p-8 border border-zinc-800 rounded-lg shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#10B981]/10 rounded">
                <CreditCard className="text-[#10B981]" size={24} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Debt</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Loan Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Total Loan Principal"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] text-[#EDEDED] transition-all text-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Interest (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="p.a."
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] text-[#EDEDED] transition-all text-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tenure (Yrs)</label>
                <input
                  type="number"
                  placeholder="Years"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] text-[#EDEDED] transition-all text-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Inflation (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Annual inflation"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-zinc-700 rounded-md px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] text-[#EDEDED] transition-all text-lg"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Section 3: Results */}
        <section className="bg-[#1A1A1A] p-8 border border-zinc-800 rounded-lg shadow-2xl mb-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-[#10B981]/10 rounded">
              <PieChart className="text-[#10B981]" size={24} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Analysis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Monthly EMI</p>
              <p className="text-3xl font-bold">{formatCurrency(results.monthlyEMI)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Real Cost (Adj.)</p>
              <p className="text-3xl font-bold text-amber-500">{formatCurrency(results.inflationAdjustedCost)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Interest</p>
              <p className="text-3xl font-bold text-red-500">{formatCurrency(results.totalInterest)}</p>
            </div>
          </div>

          <div className="bg-[#0F0F0F] p-8 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Debt-to-Income Ratio</h3>
              <p className={`text-4xl font-black ${getStatusColor(debtRatio, true)}`}>
                {debtRatio.toFixed(1)}%
              </p>
            </div>
            <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden mb-8">
              <div 
                className={`h-full transition-all duration-700 ${getBarColor(debtRatio)}`}
                style={{ width: `${Math.min(100, debtRatio)}%` }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-[#1A1A1A] rounded border border-zinc-800">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">In-Hand Left</p>
                <p className={`text-2xl font-bold ${getStatusColor(results.remainingIncome)}`}>
                  {formatCurrency(results.remainingIncome)}
                </p>
              </div>
              <div className="p-4 bg-[#1A1A1A] rounded border border-zinc-800">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Savings Potential</p>
                <p className={`text-2xl font-bold ${getStatusColor(results.savingsPercentage)}`}>
                  {results.savingsPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#1A1A1A] p-6 rounded border border-zinc-800 flex gap-4">
            <ShieldCheck className="text-[#10B981] shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-sm mb-1">Tax Deducted</h4>
              <p className="text-xs text-gray-500">Net salary after income tax.</p>
            </div>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded border border-zinc-800 flex gap-4">
            <Info className="text-amber-500 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-sm mb-1">Inflation Adjusted</h4>
              <p className="text-xs text-gray-500">Present value of future debt.</p>
            </div>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded border border-zinc-800 flex gap-4">
            <HelpCircle className="text-blue-500 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-sm mb-1">Budget Safety</h4>
              <p className="text-xs text-gray-500">Goal: Keep debt under 30%.</p>
            </div>
          </div>
        </div>

        {/* FAQ - FRONT PAGE ONLY (As requested) */}
        <section id="faq-section" className="mb-16 border-t border-zinc-800 pt-16">
          <div className="flex items-center gap-3 mb-10 justify-center">
            <MessageCircleQuestion className="text-[#10B981]" size={28} />
            <h2 className="text-3xl font-bold text-center">FAQ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#10B981]">What is 'Real Income'?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Real Income is what you actually have left after all mandatory expenses (taxes, EMIs) are subtracted from your gross pay, and then adjusted for inflation to see its true purchasing power.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#10B981]">Why Inflation Adjustment?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Money loses value over time. An EMI of ₹50,000 in 10 years is "cheaper" than ₹50,000 today. Our tool shows you the "Present Value" of your loan obligations.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#10B981]">Healthy Debt Ratio?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ideally, your total debt obligations should be less than 30% of your net monthly income. Above 40% is considered high-risk for your financial health.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#10B981]">Tax Accuracy?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                This tool uses a simplified percentage for tax. For exact figures including deductions and surcharges, consult a local tax advisor.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="mt-12 text-center text-[10px] text-gray-600 uppercase tracking-widest bg-[#1A1A1A]/50 p-6 rounded-lg border border-zinc-800 max-w-3xl mx-auto">
          "Disclaimer: Estimates only. Not financial advice. Real Income Calculator is an educational tool."
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] border-t border-zinc-800 py-12 mt-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-[#10B981] mb-2">Real Income Calculator</h3>
              <p className="text-sm text-gray-500">© 2026 Real income calculator. All rights reserved</p>
            </div>
            <nav className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
              <button onClick={() => setModalType('about')} className="hover:text-white transition-colors">ABOUT</button>
              <button onClick={scrollToFAQ} className="hover:text-white transition-colors">FAQ</button>
              <button onClick={() => setModalType('terms')} className="hover:text-white transition-colors">TERMS</button>
              <button onClick={() => setModalType('privacy')} className="hover:text-white transition-colors">PRIVACY</button>
            </nav>
          </div>
        </div>
      </footer>

      {/* Modals for About, Terms, Privacy */}
      <Modal 
        isOpen={modalType === 'about'} 
        onClose={() => setModalType(null)} 
        title="About Real Income"
      >
        <p>Real Income Calculator helps you see past the gross salary number. We calculate taxes, debt servicing, and inflation impact to reveal your true net wealth potential.</p>
        <p>Built for professionals who want to make data-driven decisions about loans and lifestyle changes.</p>
      </Modal>

      <Modal 
        isOpen={modalType === 'terms'} 
        onClose={() => setModalType(null)} 
        title="Terms of Service"
      >
        <p>By using this tool, you acknowledge that calculations are estimates. We are not responsible for financial decisions made using this data. Always consult a professional for legal or financial planning.</p>
      </Modal>

      <Modal 
        isOpen={modalType === 'privacy'} 
        onClose={() => setModalType(null)} 
        title="Privacy Policy"
      >
        <p>We do not store or track any of the financial data you enter. All calculations are performed entirely within your browser locally. Your data never leaves your device.</p>
      </Modal>
      <Analytics />
    </div>
  );
};

export default App;
