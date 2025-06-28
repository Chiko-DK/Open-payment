// src/app/Borrower/page.tsx
import Nav from "@/components/navigation";

export default function Borrower() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar Navigation */}
      <Nav />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Borrower Dashboard</h1>
          <p className="text-slate-400">Find the perfect loan and manage your borrowing activities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Current Loans Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">R0</div>
                    <div className="text-sm text-slate-400">Total Borrowed</div>
                  </div>
                </div>
                <div className="text-blue-500 text-sm">0 active loans</div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">R0</div>
                    <div className="text-sm text-slate-400">Monthly Payment</div>
                  </div>
                </div>
                <div className="text-green-500 text-sm">Next due: Dec 15</div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">320</div>
                    <div className="text-sm text-slate-400">Credit Score</div>
                  </div>
                </div>
                <div className="text-green-500 text-sm">+0.5 points this month</div>
              </div>
            </div>

            {/* Loan Application Form */}
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Apply for a New Loan</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Desired Loan Amount (R)</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Loan Purpose</label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none">
                    <option>Daily Neccesseties</option>
                    <option>Rent</option>
                    <option>School Fees</option>
                    <option>Transport Expenses</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Preferred Term</label>
                  <select className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none">
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                    <option>3 Weeks</option>
                    <option>1 Month</option>
                    <option>2 months</option>
                    <option>6 Months</option>
                  </select>
                </div>
              </div>

              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Submit Application
              </button>
            </div>

            {/* Available Loan Offers */}
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Available Loan Offers</h2>
                <span className="text-sm text-slate-400">12 offers match your profile</span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-700 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">BEST MATCH</span>
                      <span className="text-lg font-semibold">6.8% APR</span>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg font-medium transition-colors">
                      Apply Now
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Amount</div>
                      <div className="font-medium">Up to R50,000</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Term</div>
                      <div className="font-medium">36-60 months</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Credit Required</div>
                      <div className="font-medium">700+</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">8.2% APR</span>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Apply Now
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Amount</div>
                      <div className="font-medium">Up to R35,000</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Term</div>
                      <div className="font-medium">24-48 months</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Credit Required</div>
                      <div className="font-medium">650+</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">9.5% APR</span>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Apply Now
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Amount</div>
                      <div className="font-medium">Up to R25,000</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Term</div>
                      <div className="font-medium">12-36 months</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Credit Required</div>
                      <div className="font-medium">600+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary / Notifications */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              <ul className="space-y-4 text-sm">
                <li className="bg-slate-700 p-3 rounded-lg flex justify-between items-center">
                  <span>Loan payment due on Dec 15</span>
                  <span className="text-green-500 text-xs">Upcoming</span>
                </li>
                <li className="bg-slate-700 p-3 rounded-lg flex justify-between items-center">
                  <span>New loan offer: 6.8% APR</span>
                  <span className="text-blue-500 text-xs">New</span>
                </li>
                <li className="bg-slate-700 p-3 rounded-lg flex justify-between items-center">
                  <span>Credit score updated</span>
                  <span className="text-purple-500 text-xs">Update</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Tips</h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-400">
                <li>Always pay your installments on time to maintain your credit score.</li>
                <li>Compare loan offers to find the best rates.</li>
                <li>Borrow only what you need to manage debt responsibly.</li>
              </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
