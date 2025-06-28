import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/navigation";
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <Nav />
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Dashboard Panel */}
            <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm text-slate-400 mb-1">Dashboard Overview</h2>
                  <p className="text-3xl font-bold">Welcome Back</p>
                  <p className="text-sm text-slate-400">Manage your lending and borrowing activities</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-700 transition-colors">
                    Quick Action
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-lg font-semibold">Active Loans</div>
                  <div className="text-slate-400 text-sm">12</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-lg font-semibold">Total Lent</div>
                  <div className="text-slate-400 text-sm">$45,230</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-2xl mb-1">📈</div>
                  <div className="text-lg font-semibold">Interest Earned</div>
                  <div className="text-green-500 text-sm">$2,345</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-2xl mb-1">⏰</div>
                  <div className="text-lg font-semibold">Pending</div>
                  <div className="text-yellow-500 text-sm">3</div>
                </div>
              </div>
              
              {/* Chart Area */}
              <div className="relative h-64 bg-gradient-to-b from-green-500/20 to-transparent rounded-lg">
                <div className="absolute inset-0 flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 20 180 Q 80 160 120 140 T 200 120 T 280 100 T 380 80" 
                      stroke="#10b981" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    <path 
                      d="M 20 180 Q 80 160 120 140 T 200 120 T 280 100 T 380 80 L 380 200 L 20 200 Z" 
                      fill="url(#chartGradient)"
                    />
                    <circle cx="280" cy="100" r="4" fill="#10b981" stroke="#1f2937" strokeWidth="2"/>
                  </svg>
                </div>
                
                {/* Chart labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-400 py-2">
                  <span>$50K</span>
                  <span>$35K</span>
                  <span>$20K</span>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-400 px-8">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
                
                <div className="absolute top-4 left-4 text-sm text-slate-300">
                  Portfolio Growth Over Time
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {/* User Profile Section */}
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">👤</span>
                    </div>
                    <span>User Dashboard</span>
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Portfolio Value</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">$78,820.00</span>
                    <span className="text-green-500 text-sm">+$961.12</span>
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Quick Actions Section */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span>💰</span>
                    <span>New Loan</span>
                  </button>
                  
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span>📊</span>
                    <span>View Reports</span>
                  </button>
                  
                  <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <span>⚙️</span>
                    <span>Settings</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <span className="text-lg">📥</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Loan Payment Received</div>
                      <div className="text-xs text-slate-400">2 hours ago</div>
                    </div>
                    <span className="text-green-500 text-sm">+$500</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <span className="text-lg">🔑</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Contract Signed</div>
                      <div className="text-xs text-slate-400">1 day ago</div>
                    </div>
                    <span className="text-blue-500 text-sm">New</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <span className="text-lg">📄</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Transaction Completed</div>
                      <div className="text-xs text-slate-400">3 days ago</div>
                    </div>
                    <span className="text-slate-400 text-sm">Done</span>
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