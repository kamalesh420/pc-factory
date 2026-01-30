import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import { ShoppingCart, ShieldCheck, ChevronRight, CheckCircle2, Package, ArrowLeft, BarChart3, Truck, TicketPercent, GraduationCap, Gift, Zap } from 'lucide-react';
import { BUILD_TIERS, ASSEMBLY_FEE, TAX_RATE } from './constants';
import { BuildTier, ComponentType, PCComponent, AppStep, UserConfiguration } from './types';
import { ComponentCard } from './components/ComponentCard';
import { GeminiAdvisor } from './components/GeminiAdvisor';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

function MainApp() {
  const [step, setStep] = useState<AppStep>('home');
  const [selectedTier, setSelectedTier] = useState<BuildTier | null>(null);
  const [userConfig, setUserConfig] = useState<UserConfiguration>({
    ram: {} as PCComponent,
    storage: {} as PCComponent
  });

  // Calculate current build based on tier + user overrides
  const currentBuild = useMemo(() => {
    if (!selectedTier) return [];

    // Replace base components with user config if type matches
    return selectedTier.baseBuild.map(comp => {
      if (comp.type === ComponentType.RAM && userConfig.ram.id) return userConfig.ram;
      if (comp.type === ComponentType.STORAGE && userConfig.storage.id) return userConfig.storage;
      return comp;
    });
  }, [selectedTier, userConfig]);

  const pricing = useMemo(() => {
    const partsTotal = currentBuild.reduce((sum, part) => sum + part.price, 0);
    const subtotal = partsTotal + ASSEMBLY_FEE;
    const gst = subtotal * TAX_RATE;
    const total = subtotal + gst;
    return { partsTotal, subtotal, gst, total };
  }, [currentBuild]);

  const handleTierSelect = (tier: BuildTier) => {
    setSelectedTier(tier);
    // Initialize config with base parts
    const baseRam = tier.baseBuild.find(c => c.type === ComponentType.RAM);
    const baseStorage = tier.baseBuild.find(c => c.type === ComponentType.STORAGE);

    if (baseRam && baseStorage) {
      setUserConfig({ ram: baseRam, storage: baseStorage });
    }
    setStep('config');
  };

  const handleConfigChange = (type: 'ram' | 'storage', component: PCComponent) => {
    setUserConfig(prev => ({ ...prev, [type]: component }));
  };

  const costData = [
    { name: 'Core Parts', value: pricing.partsTotal },
    { name: 'Assembly', value: ASSEMBLY_FEE },
    { name: 'GST', value: pricing.gst }
  ];
  const COLORS = ['#2563eb', '#10b981', '#94a3b8'];

  // --- RENDER STEPS ---

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center space-y-8 animate-fade-in py-12">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
        <ShieldCheck size={18} />
        <span>Factory Assembled & Tested</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
        The Honest PC Builder.
      </h1>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl">
        Stop paying for hidden compromises. Choose your budget and get the best possible components with full transparency.
      </p>
      <button
        onClick={() => setStep('budget')}
        className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 z-10"
      >
        Choose Your Budget
        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Hero Image */}
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-slate-200 mt-6 relative group">
        <img
          src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=2042"
          alt="Premium Gaming PC Setup"
          className="w-full h-auto object-cover max-h-[400px] transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end">
          <div className="p-8 text-white text-left">
            <p className="font-bold text-lg">Builds starting at ₹35,000</p>
            <p className="text-slate-300 text-sm">Pre-tested. Warranty backed. Student friendly.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-5xl">
        {[
          { icon: <CheckCircle2 className="text-green-500" />, title: "No Hidden Junk", desc: "No generic PSUs or motherboards. We list every exact model." },
          { icon: <Package className="text-blue-500" />, title: "Ready to Use", desc: "Professionally assembled, cable-managed, and stress-tested." },
          { icon: <ShieldCheck className="text-purple-500" />, title: "3 Year Warranty", desc: "Full component warranty coverage managed by us." },
        ].map((feat, idx) => (
          <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
            <div className="mb-4 flex">{feat.icon}</div>
            <h3 className="font-bold text-slate-900 mb-2">{feat.title}</h3>
            <p className="text-sm text-slate-500">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Exclusive Offers Section */}
      <div className="w-full max-w-5xl mt-16 text-left">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Zap className="text-yellow-500 fill-yellow-500" size={24} />
          Current Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offer 1 */}
          <div
            onClick={() => setStep('budget')}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg group cursor-pointer hover:shadow-indigo-500/30 transition-all hover:-translate-y-1"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                <GraduationCap size={14} /> STUDENT SPECIAL
              </div>
              <h3 className="text-2xl font-bold mb-2">Flat ₹1,500 OFF</h3>
              <p className="text-indigo-100 mb-4 max-w-xs">Valid on all builds for students with a valid university ID card.</p>
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
                Claim Discount
              </button>
            </div>
            <TicketPercent className="absolute -bottom-6 -right-6 text-white/10 rotate-12 transition-transform group-hover:rotate-6 duration-700" size={180} />
          </div>

          {/* Offer 2 */}
          <div
            onClick={() => setStep('budget')}
            className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg group cursor-pointer hover:shadow-pink-500/30 transition-all hover:-translate-y-1"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                <Gift size={14} /> LIMITED TIME
              </div>
              <h3 className="text-2xl font-bold mb-2">Free WiFi Adapter</h3>
              <p className="text-rose-100 mb-4 max-w-xs">Get a high-speed WiFi 6 USB adapter free with 'Balanced Gamer' builds.</p>
              <button className="bg-white text-rose-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-50 transition-colors">
                View Builds
              </button>
            </div>
            <Gift className="absolute -bottom-6 -right-6 text-white/10 rotate-12 transition-transform group-hover:rotate-0 duration-700" size={160} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBudget = () => (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button onClick={() => setStep('home')} className="flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
        <ArrowLeft size={18} className="mr-1" /> Back
      </button>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Select your Budget Range</h2>
      <p className="text-slate-500 mb-10">We have optimized the best possible value for every tier.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BUILD_TIERS.map(tier => {
          // Find the case image for the preview
          const caseImage = tier.baseBuild.find(c => c.type === ComponentType.CASE)?.image;

          return (
            <div
              key={tier.id}
              onClick={() => handleTierSelect(tier)}
              className="group relative cursor-pointer bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-blue-500 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col"
            >
              <div className="absolute top-4 right-4 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10">
                {tier.rangeLabel}
              </div>

              {/* Tier Image Preview */}
              <div className="mb-6 h-48 flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden p-4 border border-slate-100 group-hover:bg-white transition-colors">
                {caseImage ? (
                  <img src={caseImage} alt={tier.name} className="h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <Package size={48} className="text-slate-300" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{tier.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-blue-600 shrink-0"><BarChart3 size={16} /></div>
                    <span className="truncate"><strong>CPU:</strong> {tier.baseBuild.find(c => c.type === ComponentType.CPU)?.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3 text-purple-600 shrink-0"><BarChart3 size={16} /></div>
                    <span className="truncate"><strong>GPU:</strong> {tier.baseBuild.find(c => c.type === ComponentType.GPU)?.name}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center text-blue-600 font-semibold group-hover:underline">
                Customize this Build <ChevronRight size={18} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderConfig = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => setStep('budget')} className="flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-1" /> Change Budget
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Parts */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{selectedTier?.name} Configuration</h2>
            <p className="text-slate-500 text-sm">Review component transparency. Safe upgrades available for RAM & Storage.</p>
          </div>

          <div className="space-y-3">
            {currentBuild.map((comp) => {
              const isRam = comp.type === ComponentType.RAM;
              const isStorage = comp.type === ComponentType.STORAGE;
              const isConfigurable = isRam || isStorage;

              return (
                <ComponentCard
                  key={comp.type}
                  component={comp}
                  isConfigurable={isConfigurable}
                  options={isRam ? selectedTier?.upgrades[ComponentType.RAM] : isStorage ? selectedTier?.upgrades[ComponentType.STORAGE] : undefined}
                  onSelect={(c) => handleConfigChange(isRam ? 'ram' : 'storage', c)}
                />
              );
            })}
          </div>

          {/* AI Advisor Section */}
          <GeminiAdvisor components={currentBuild} tierName={selectedTier?.name || ''} />
        </div>

        {/* Right Col: Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white">
              <h3 className="font-bold text-lg">Order Summary</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Components Total</span>
                <span>₹{pricing.partsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Assembly & Testing</span>
                <span>₹{ASSEMBLY_FEE}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>GST (18%)</span>
                <span>₹{pricing.gst.toLocaleString()}</span>
              </div>

              <div className="h-px bg-slate-200 my-4"></div>

              <div className="flex justify-between items-end">
                <span className="font-bold text-slate-900">Total Price</span>
                <span className="text-2xl font-bold text-blue-600">₹{pricing.total.toLocaleString()}</span>
              </div>

              {/* Simple Recharts Visualization of Cost Breakdown */}
              <div className="h-32 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {costData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span>Parts</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Labor</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span>Tax</span>
                </div>
              </div>

              <button
                onClick={() => setStep('checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg shadow-md transition-all mt-4 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ChevronRight size={20} />
              </button>

              <p className="text-xs text-center text-slate-400 mt-2">
                Estimated Delivery: 5-7 Business Days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCheckout = () => (
    <div className="flex items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Truck size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Ship!</h2>
        <p className="text-slate-600 mb-8">
          This is a demo application. In a real scenario, you would be redirected to a payment gateway for
          <span className="font-bold text-slate-900"> ₹{pricing.total.toLocaleString()}</span>.
        </p>
        <button
          onClick={() => setStep('home')}
          className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="bg-slate-900 text-white text-xs font-bold text-center py-2 px-4 tracking-wide">
        🎉 SUMMER SALE: Free Assembly on all orders above ₹50,000! Use Code: FREEBUILD
      </div>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep('home')}>
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">HonestPC</span>
          </div>
          <div className="flex items-center gap-4">
            {selectedTier && step !== 'home' && (
              <div className="hidden sm:block text-xs font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                Current Build: {selectedTier.name}
              </div>
            )}
            <button className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors">
              <ShoppingCart size={24} />
              {step === 'config' && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {step === 'home' && renderHome()}
        {step === 'budget' && renderBudget()}
        {step === 'config' && renderConfig()}
        {step === 'checkout' && renderCheckout()}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 HonestPC Factory Platform. Built for Transparency.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <MainApp />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;