import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header, Footer, RoleSwitcher, AIChatBot } from './components/SharedComponents';
import { CustomerFlow } from './components/CustomerFlow';
import { OperatorPortal } from './components/OperatorPortal';
import { AdminPortal } from './components/AdminPortal';

function MainLayout() {
  const { theme, activeRole } = useApp();

  // Dynamically apply dark class to document body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${
      theme === 'dark' ? 'bg-[#090a0f] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header Bar */}
      <Header />

      {/* Main Core Platform Content */}
      <main className="flex-1 pb-24">
        {activeRole === 'customer' || activeRole === 'guest' ? (
          <CustomerFlow />
        ) : activeRole === 'admin' ? (
          <AdminPortal />
        ) : (
          <OperatorPortal />
        )}
      </main>

      {/* Footer bar */}
      <Footer />

      {/* Floating Demo Assist Utilities */}
      <RoleSwitcher />
      <AIChatBot />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
