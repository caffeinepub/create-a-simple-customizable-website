import { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetWebsiteContent } from './hooks/useQueries';
import HeaderNav from './components/navigation/HeaderNav';
import HeroSection from './components/sections/HeroSection';
import ContentSections from './components/sections/ContentSections';
import Footer from './components/sections/Footer';
import AdminEditor from './components/admin/AdminEditor';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: content, isLoading } = useGetWebsiteContent();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const isAuthenticated = !!identity;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderNav 
          siteTitle={content?.siteTitle || 'Welcome'} 
          onOpenEditor={() => setIsEditorOpen(true)}
        />
        
        <main className="flex-1">
          <HeroSection 
            title={content?.heroSection.sectionTitle || ''} 
            body={content?.heroSection.sectionBody || ''} 
          />
          
          <ContentSections 
            title={content?.mainSection.sectionTitle || ''} 
            body={content?.mainSection.sectionBody || ''} 
          />
        </main>
        
        <Footer footerText={content?.footerText || ''} />
      </div>

      {isAuthenticated && <ProfileSetupModal />}
      
      {isEditorOpen && (
        <AdminEditor 
          isOpen={isEditorOpen} 
          onClose={() => setIsEditorOpen(false)} 
        />
      )}

      <Toaster />
    </>
  );
}
