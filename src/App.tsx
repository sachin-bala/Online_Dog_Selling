import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LoadingScreen } from './components/common/LoadingScreen';

// Home Components
import { HeroSection } from './components/home/HeroSection';
import { StatsCounter } from './components/home/StatsCounter';
import { FeaturedCategories } from './components/home/FeaturedCategories';
import { FeaturedDogsSection } from './components/home/FeaturedDogsSection';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { HowItWorks } from './components/home/HowItWorks';
import { ServiceLocationsSection } from './components/home/ServiceLocationsSection';
import { AiTeaserSection } from './components/home/AiTeaserSection';
import { BreedCarousel } from './components/home/BreedCarousel';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { PetCareBlog } from './components/home/PetCareBlog';
import { FaqAccordionSection } from './components/home/FaqAccordionSection';
import { CtaSection } from './components/home/CtaSection';

// View Pages
import { ExploreDogsView } from './components/explore/ExploreDogsView';
import { DogShowsView } from './components/shows/DogShowsView';
import { FoodAccessoriesView } from './components/products/FoodAccessoriesView';
import { SellerDashboard } from './components/dashboards/SellerDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { CustomerDashboard } from './components/dashboards/CustomerDashboard';

// Modals & Floating Drawers
import { DogDetailsModal } from './components/details/DogDetailsModal';
import { CompareModal } from './components/common/CompareModal';
import { CheckoutModal } from './components/common/CheckoutModal';
import { VideoCallModal } from './components/common/VideoCallModal';
import { AiBreedFinderModal } from './components/ai-finder/AiBreedFinderModal';
import { AiChatbotDrawer } from './components/common/AiChatbotDrawer';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { RegisterSellerModal } from './components/auth/RegisterSellerModal';
import { DogShowRegisterModal } from './components/shows/DogShowRegisterModal';

const MainApp: React.FC = () => {
  const { activeTab, theme } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  // Sync theme class to root html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#FEFCE8] dark:bg-[#FEFCE8] text-[#0A0A0A] dark:text-[#0A0A0A] flex flex-col justify-between font-sans selection:bg-[#FACC15] selection:text-black transition-colors duration-200">
      {/* Top Navigation Header */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 w-full animate-in fade-in duration-300">
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <StatsCounter />
            <FeaturedCategories />
            <FeaturedDogsSection />
            <div id="why-choose-us">
              <WhyChooseUs />
            </div>
            <HowItWorks />
            <ServiceLocationsSection />
            <AiTeaserSection />
            <BreedCarousel />
            <TestimonialsSection />
            <PetCareBlog />
            <FaqAccordionSection />
            <CtaSection />
          </>
        )}

        {(activeTab === 'explore' || activeTab === 'ai-finder') && <ExploreDogsView />}
        {activeTab === 'shows' && <DogShowsView />}
        {activeTab === 'store' && <FoodAccessoriesView />}
        {activeTab === 'seller' && <SellerDashboard />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'customer' && <CustomerDashboard />}
      </main>

      {/* Modern Multi-Column Footer */}
      <Footer />

      {/* Global Interactive Modals */}
      <DogDetailsModal />
      <CompareModal />
      <CheckoutModal />
      <VideoCallModal />
      <AiBreedFinderModal />
      <AiChatbotDrawer />
      <AdminLoginModal />
      <RegisterSellerModal />
      <DogShowRegisterModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
