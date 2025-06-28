import Image from "next/image";
import Nav from "@/components/navigation";
import loanOffers from "../data/lender.json";

export default function Lender() {
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <Nav />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Lender Dashboard</h1>
            <p className="text-slate-400">Manage your lending portfolio and create new loan offers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Lending Overview */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">R125,430</div>
                      <div className="text-sm text-slate-400">Total Lent</div>
                    </div>
                  </div>
                  <div className="text-green-500 text-sm">+12.5% this month</div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">R8,245</div>
                      <div className="text-sm text-slate-400">Interest Earned</div>
                    </div>
                  </div>
                  <div className="text-green-500 text-sm">+5.2% this month</div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-sm text-slate-400">Active Loans</div>
                    </div>
                  </div>
                  <div className="text-yellow-500 text-sm">3 pending approval</div>
                </div>
              </div>

              {/* Create New Loan Offer */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Create New Loan Offer</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Loan Amount (R)</label>
                    <input 
                      type="number" 
                      placeholder="10,000"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Interest Rate (%)</label>
                    <input 
                      type="number" 
                      placeholder="8.5"
                      step="0.1"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Term (months)</label>
                    <select className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none">
                      <option>1 week</option>
                      <option>2 weeks</option>
                      <option>3 weeks</option>
                      <option>1 month</option>
                      <option>2 months</option>
                    </select>
                  </div>
                </div>
                
                <button className="mt-4 bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors">
                  Create Loan Offer
                </button>
              </div>

              {/* Active Loan Offers from JSON */}
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Active Loan Offers</h2>
                  <span className="text-sm text-slate-400">{loanOffers.length} active offers</span>
                </div>
                
                <div className="space-y-3">
                  {loanOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-slate-700 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            offer.dotColor === "green"
                              ? "bg-green-500"
                              : offer.dotColor === "yellow"
                              ? "bg-yellow-500"
                              : offer.dotColor === "blue"
                              ? "bg-blue-500"
                              : "bg-slate-500"
                          }`}
                        ></div>
                        <div>
                          <div className="font-medium">
                            ${offer.loanAmount.toLocaleString()} at {offer.interestRate}% APR
                          </div>
                          <div className="text-sm text-slate-400">
                            {offer.termMonths} months • Credit Score {offer.creditScoreRequired}+
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {offer.applications} Application{offer.applications !== 1 && "s"}
                        </div>
                        <div className="text-xs text-slate-400">
                          Posted {offer.postedDaysAgo} day{offer.postedDaysAgo !== 1 && "s"} ago
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span>👥</span>
                    <span>View Applications</span>
                  </button>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span>📊</span>
                    <span>Portfolio Analysis</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Recent Applications</h3>
                <div className="space-y-3">
                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">John D.</span>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Approved</span>
                    </div>
                    <div className="text-sm text-slate-400">$15,000 • 7.5% APR</div>
                    <div className="text-xs text-slate-500">Credit Score: 720</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Sarah M.</span>
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Pending</span>
                    </div>
                    <div className="text-sm text-slate-400">$25,000 • 8.2% APR</div>
                    <div className="text-xs text-slate-500">Credit Score: 685</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Mike R.</span>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Declined</span>
                    </div>
                    <div className="text-sm text-slate-400">$30,000 • 9.1% APR</div>
                    <div className="text-xs text-slate-500">Credit Score: 590</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Approval Rate</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Default Rate</span>
                      <span>2.1%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "2.1%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Avg ROI</span>
                      <span>12.8%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
