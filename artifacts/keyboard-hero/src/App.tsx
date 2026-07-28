import Navbar from '@/components/Navbar';
import MustangHero from '@/components/MustangHero';
import LegacySection from '@/components/LegacySection';
import RaritySection from '@/components/RaritySection';
import PerformanceSection from '@/components/PerformanceSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import MusicPlayer from '@/components/MusicPlayer';
import CinematicIntro from '@/components/CinematicIntro';

function App() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <CinematicIntro />
      <Navbar />
      <MustangHero />
      <LegacySection />
      <RaritySection />
      <PerformanceSection />
      <ContactSection />
      <Footer />
      <MusicPlayer />
    </div>
  );
}

export default App;
