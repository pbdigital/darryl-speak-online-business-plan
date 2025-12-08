import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  ChevronRight, 
  CheckCircle2, 
  Menu,
  BookOpen,
  TrendingUp,
  Target,
  Smile,
  ShieldCheck,
  Star,
  PenTool,
  Layout,
  Users,
  LineChart,
  Clock,
  MoreHorizontal
} from 'lucide-react';

// --- Styled UI Components (Ebook Aesthetic) ---

// Workbook Style Input (Underlined, not boxed, with subtle interaction)
const WorkbookInput = ({ label, value, onChange, placeholder, prefix }) => (
  <div className="mb-8 group">
    <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide group-focus-within:text-blue-700 transition-colors">{label}</label>
    <div className="relative flex items-center">
      {prefix && <span className="text-slate-500 font-serif text-lg mr-2">{prefix}</span>}
      <input
        type="text"
        className="w-full py-3 bg-transparent border-b-2 border-slate-200 focus:border-slate-900 outline-none transition-all duration-300 text-slate-800 text-lg placeholder:text-slate-300 font-medium"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-slate-900 group-focus-within:w-full transition-all duration-500 ease-out" />
    </div>
  </div>
);

// Workbook Style Textarea
const WorkbookTextArea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-10 group">
    <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide group-focus-within:text-blue-700 transition-colors">{label}</label>
    <div className="relative">
      <textarea
        className="w-full p-6 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-l-4 border-slate-200 focus:border-slate-900 outline-none transition-all duration-300 text-slate-700 leading-relaxed resize-none rounded-r-xl shadow-sm focus:shadow-md"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

// Section Header Layout
const SectionCover = ({ number, title, subtitle, icon: Icon, progress }) => (
  <div className="bg-[#0F172A] text-white p-8 md:p-12 rounded-3xl shadow-xl mb-12 relative overflow-hidden group">
    {/* Abstract Background Decoration */}
    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4 group-hover:scale-105 transition-transform duration-1000">
       <Icon size={400} strokeWidth={0.5} />
    </div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-4">
        <span className="inline-block bg-blue-500/20 text-blue-300 font-bold tracking-widest text-xs px-3 py-1 rounded-full uppercase border border-blue-500/30">Section {number}</span>
        {progress > 0 && (
          <span className="text-slate-400 text-xs font-medium tracking-wide flex items-center gap-1">
            <Clock size={12} /> {progress}% Completed
          </span>
        )}
      </div>
      <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{title}</h1>
      <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl leading-relaxed">{subtitle}</p>
    </div>
  </div>
);

// Definition Box
const DefinitionBox = ({ title, content }) => (
  <div className="mb-6 pl-6 border-l-2 border-slate-200 hover:border-slate-900 transition-colors duration-300">
    <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-2">{title}</h4>
    <p className="text-slate-600 leading-relaxed">{content}</p>
  </div>
);

// Dashboard Card with Progress
const DashboardCard = ({ number, title, description, icon: Icon, progress = 0, status, onClick }) => {
  const isStarted = progress > 0;
  const isComplete = progress === 100;

  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col items-start text-left bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-2xl hover:border-slate-900/10 transition-all duration-300 h-full overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-8 -mt-8 transition-colors group-hover:bg-[#0F172A]" />
      <div className="absolute top-5 right-5 text-slate-300 group-hover:text-white transition-colors duration-300">
        <Icon size={24} strokeWidth={1.5} />
      </div>

      <div className="mb-4">
        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Section {number}</span>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-900 transition-colors leading-tight">{title}</h3>
      <p className="text-slate-500 mb-8 leading-relaxed text-sm line-clamp-3">{description}</p>
      
      <div className="mt-auto w-full">
        <div className="flex justify-between items-end mb-2">
           <span className={`text-xs font-bold uppercase tracking-wide ${isComplete ? 'text-green-600' : 'text-slate-900'}`}>
             {status}
           </span>
           <span className="text-xs font-medium text-slate-400">{progress}%</span>
        </div>
        
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${isComplete ? 'bg-green-500' : 'bg-[#0F172A]'}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="mt-6 flex items-center text-sm font-bold text-slate-900 uppercase tracking-wide group-hover:translate-x-1 transition-transform">
          {isStarted ? 'Continue Workbook' : 'Start Section'} <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </button>
  );
};

// --- Pages ---

const Dashboard = ({ onNavigate }) => {
  // Mock data with progress states to show variation
  const sections = [
    {
      id: 1,
      title: "Annual Reflection & Intention Setting",
      description: "Reflect on the past year and set intentional goals. Understand where you've been to plan where you're going.",
      icon: Target,
      progress: 35,
      status: "In Progress"
    },
    {
      id: 2,
      title: "SWOT Analysis",
      description: "Evaluate your Strengths, Weaknesses, Opportunities, and Threats to build a resilient business strategy.",
      icon: Layout,
      progress: 0,
      status: "Not Started"
    },
    {
      id: 3,
      title: "Vision, Goals & Income Planning",
      description: "Calculate your GCI, transaction targets, and the daily activities required to fund your ideal life.",
      icon: TrendingUp,
      progress: 0,
      status: "Not Started"
    },
    {
      id: 4,
      title: "Mindset, Self-Care & Motivation",
      description: "Build your personal stability system with affirmations, grounding rituals, and boundary setting.",
      icon: Smile,
      progress: 0,
      status: "Not Started"
    },
    {
      id: 5,
      title: "Accountability & Progress Tracking",
      description: "Manage projects, define your prospecting mix, and sign your commitment contract.",
      icon: ShieldCheck,
      progress: 0,
      status: "Not Started"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header */}
      <header className="bg-[#0F172A] text-white pt-12 pb-32 px-6 md:px-12 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <TrendingUp className="absolute top-10 right-20 text-white w-64 h-64" strokeWidth={0.5}/>
           <Star className="absolute bottom-10 left-20 text-white w-48 h-48" strokeWidth={0.5}/>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6 text-blue-300 font-bold tracking-widest uppercase text-xs border border-blue-500/30 px-4 py-1.5 rounded-full w-fit">
              <PenTool size={14} /> 2026 Edition
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-none">
              The Ultimate <br/>Real Estate Business Plan
            </h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              Your blueprint for breakthroughs, listings, and a life worth smiling about.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-full md:w-auto min-w-[240px]">
             <div className="flex justify-between items-start mb-4">
               <div>
                  <p className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">Total Progress</p>
                  <p className="text-3xl font-bold text-white">7%</p>
               </div>
               <div className="bg-green-500 w-2 h-2 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
             </div>
             <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
               <div className="bg-blue-400 h-full w-[7%]" />
             </div>
          </div>
        </div>
      </header>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 pb-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <DashboardCard 
              key={section.id}
              number={section.id}
              title={section.title}
              description={section.description}
              icon={section.icon}
              progress={section.progress}
              status={section.status}
              onClick={() => onNavigate(`section-${section.id}`)}
            />
          ))}
          
          {/* Call to Action Card (Digital Darryl) */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white flex flex-col items-start justify-between shadow-lg hover:shadow-xl transition-shadow group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                <Users size={24} text-white />
              </div>
              <h3 className="text-2xl font-bold mb-2">Digital Coach</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">Stuck on your SWOT analysis? Need help calculating GCI? Ask your AI assistant.</p>
            </div>
            <button className="relative z-10 w-full py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg">
              Chat Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const SectionOneBuilder = ({ onBack }) => {
  const [activeStep, setActiveStep] = useState(1); // Starting at 1 for "Last Year's Numbers" to show progress
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1500);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { id: 0, label: "Overview" },
    { id: 1, label: "Numbers" },
    { id: 2, label: "Reflection" },
    { id: 3, label: "Gratitude" },
    { id: 4, label: "Goals" },
    { id: 5, label: "Wellness" },
    { id: 6, label: "Closing" }
  ];

  const currentProgress = Math.round(((activeStep) / (steps.length - 1)) * 100);

  const renderContent = () => {
    switch (activeStep) {
      case 0: // Introduction
        return (
          <div className="animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <SectionCover 
              number="1" 
              title="Annual Reflection & Intention Setting"
              subtitle="The foundation of your 2026 success starts with understanding your 2025 journey."
              icon={BookOpen}
              progress={0}
            />
            
            <div className="max-w-3xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 mb-12">
                 <DefinitionBox 
                   title="What It Is"
                   content="This section is your opportunity to thoughtfully (and honestly) reflect on the past year and set goals for the year ahead with intentionality and purpose."
                 />
                 <DefinitionBox 
                   title="Why It Matters"
                   content="By understanding where you've been, you can better plan where you're going. Self-awareness fosters clarity, motivation, and meaningful progress."
                 />
              </div>

              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-600 italic mb-6">"How to Fill It Out: Answer the prompts as honestly and fully as possible. Take your time, and feel free to revisit this section throughout the year."</p>
                <button 
                  onClick={() => setActiveStep(1)}
                  className="px-10 py-4 bg-[#0F172A] text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Reflection
                </button>
              </div>
            </div>
          </div>
        );

      case 1: // Last Year in Review
        return (
          <div className="max-w-3xl mx-auto px-4 animate-in slide-in-from-bottom-8 duration-700 fade-in">
             <div className="mb-12 text-center">
               <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Step 1 of 6</span>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Last Year in Review</h2>
               <p className="text-slate-500">Understanding the past helps you tackle the future.</p>
             </div>

             <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-100 mb-8 relative overflow-hidden">
                {/* Decorative background for the card */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                    <LineChart className="text-slate-900" size={24} />
                    <h3 className="font-extrabold text-slate-900 uppercase tracking-widest text-sm">Production Numbers</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <WorkbookInput label="Listings Taken" placeholder="#" />
                    <WorkbookInput label="Seller Sides Closed" placeholder="#" />
                    <WorkbookInput label="Buyer Sides Closed" placeholder="#" />
                    <WorkbookInput label="Renter Transactions" placeholder="#" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50">
                    <WorkbookInput label="Gross Closed Commissions" placeholder="0.00" prefix="$" />
                  </div>
                </div>
             </div>
          </div>
        );

      case 2: // Reflection Questions
        return (
          <div className="max-w-3xl mx-auto px-4 animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <div className="mb-12 text-center">
               <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Step 2 of 6</span>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Reflection Questions</h2>
               <p className="text-slate-500">Dig deep. Honesty is your best tool here.</p>
             </div>

            <div className="space-y-2">
              <WorkbookTextArea 
                label="Did you achieve your goals last year? Why or why not?" 
                placeholder="Be specific..."
              />
              <WorkbookTextArea 
                label="What were your biggest struggles?" 
                placeholder="Market? Mindset? Inventory?"
              />
              <WorkbookTextArea 
                label="What was your biggest accomplishment?" 
                placeholder="Don't be shy, brag a little!"
              />
              <WorkbookTextArea 
                label="What went well that you want to continue?" 
                placeholder="Strategies worth keeping..."
              />
            </div>
          </div>
        );

      case 3: // Gratitude & Values
        return (
           <div className="max-w-3xl mx-auto px-4 animate-in slide-in-from-bottom-8 duration-700 fade-in">
             <div className="mb-10 text-center">
               <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Step 3 of 6</span>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Gratitude & Values</h2>
               <p className="text-slate-500">Aligning your aspirations with your heart.</p>
             </div>

             <div className="bg-[#FFFBEB] p-8 rounded-3xl border border-yellow-200 mb-12 shadow-[0_10px_40px_-10px_rgba(251,191,36,0.3)]">
                <h3 className="flex items-center gap-2 font-bold text-yellow-900 mb-8 uppercase tracking-wider text-sm border-b border-yellow-200 pb-4">
                  <Smile size={18} /> Gratitude Practice
                </h3>
                <div className="space-y-6">
                  <WorkbookInput label="What are you most grateful for from the past year?" placeholder="Experiences, wins..." />
                  <WorkbookInput label="Who are the people you are most grateful for?" placeholder="Family, mentors, clients..." />
                  <WorkbookInput label="What moments brought you the most joy?" placeholder="Small or big moments..." />
                </div>
             </div>

             <div className="space-y-2">
               <WorkbookTextArea 
                 label="What are your core values?" 
                 placeholder="Integrity, Family, Excellence..." 
               />
               <WorkbookTextArea 
                 label="Are there any values you want to shift focus to?" 
                 placeholder="I want to focus more on..." 
               />
             </div>
           </div>
        );
        
      case 4: // Goals
        return (
          <div className="max-w-3xl mx-auto px-4 animate-in slide-in-from-bottom-8 duration-700 fade-in">
             <div className="mb-10 text-center">
               <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Step 4 of 6</span>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Goals & Obstacles</h2>
               <p className="text-slate-500">What do you want, and what's in the way?</p>
             </div>

             <WorkbookTextArea 
               label="Top Goals for 2026" 
               placeholder="Personal, professional, health..." 
               rows={4}
             />
             
             <div className="grid md:grid-cols-2 gap-8 mt-12">
               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wide flex items-center gap-2">
                    <ShieldCheck size={16} /> Obstacles
                  </h4>
                  <textarea className="w-full bg-transparent outline-none resize-none text-slate-600 placeholder:text-slate-300" rows={6} placeholder="What specific challenges might hold you back?" />
               </div>
               <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-blue-900 mb-4 uppercase text-sm tracking-wide flex items-center gap-2">
                    <Target size={16} /> Strategies
                  </h4>
                  <textarea className="w-full bg-transparent outline-none resize-none text-slate-600 placeholder:text-blue-200" rows={6} placeholder="What are the specific actions to overcome them?" />
               </div>
             </div>
          </div>
        );

      case 5: // Wellness
        return (
          <div className="max-w-3xl mx-auto px-4 animate-in slide-in-from-bottom-8 duration-700 fade-in">
             <div className="mb-10 text-center">
               <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Step 5 of 6</span>
               <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Self-Care & Growth</h2>
               <p className="text-slate-500">You are the most valuable asset in your business.</p>
             </div>

             <div className="space-y-4">
              <WorkbookTextArea label="What self-care practices will you prioritize?" rows={2} placeholder="Meditation, exercise, time off..." />
              <WorkbookTextArea label="What skills do you want to acquire?" rows={2} placeholder="Negotiation, social media marketing..." />
             </div>
             
             <div className="mt-12 bg-[#0F172A] text-white p-10 rounded-3xl text-center relative overflow-hidden shadow-2xl">
                <Star className="absolute top-0 left-0 text-white opacity-5 w-64 h-64 -ml-12 -mt-12 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-[0.2em] relative z-10">My 2026 Word or Mantra</h3>
                <input 
                  type="text" 
                  className="w-full bg-transparent text-center text-4xl md:text-6xl font-black text-white border-b-2 border-slate-700 focus:border-blue-500 outline-none pb-4 uppercase tracking-tight placeholder:text-slate-800 transition-colors relative z-10"
                  placeholder="UNSTOPPABLE"
                />
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
       {/* Top Navigation Bar */}
       <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 z-50 flex items-center justify-between shadow-sm">
          <button 
            onClick={onBack} 
            className="flex items-center text-slate-500 hover:text-slate-900 font-bold uppercase text-xs tracking-widest transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
          </button>
          
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">
               <span>Section Progress</span>
               <span>{currentProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
               <div 
                 className="bg-slate-900 h-full transition-all duration-700 ease-out" 
                 style={{ width: `${currentProgress}%` }}
               />
            </div>
          </div>

          <div className="w-auto text-right flex items-center gap-4">
             <div className={`text-xs font-bold text-slate-400 uppercase flex items-center gap-2 transition-opacity duration-500 ${isSaving ? 'opacity-100' : 'opacity-0'}`}>
                <Save size={12} /> Saving...
             </div>
             <button className="text-slate-400 hover:text-slate-900">
                <MoreHorizontal size={20} />
             </button>
          </div>
       </div>

       {/* Main Content */}
       <div className="pt-12">
          {renderContent()}
       </div>

       {/* Floating Navigation Footer */}
       {activeStep > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6 z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
             <div className="max-w-3xl mx-auto flex justify-between items-center">
                <button 
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="text-slate-400 hover:text-slate-600 font-bold uppercase text-xs tracking-widest px-6 py-4 transition-colors"
                >
                  Back
                </button>
                
                <button 
                  onClick={() => activeStep < steps.length - 1 ? setActiveStep(activeStep + 1) : onBack()}
                  className="group flex items-center bg-[#0F172A] text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  {activeStep === steps.length - 1 ? 'Complete Section' : 'Next Step'} 
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>
       )}
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {currentView === 'dashboard' ? (
        <Dashboard onNavigate={setCurrentView} />
      ) : (
        <SectionOneBuilder onBack={() => setCurrentView('dashboard')} />
      )}
    </div>
  );
};

export default App;