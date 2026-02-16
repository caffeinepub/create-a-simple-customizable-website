import { useState } from 'react';
import { useGetLiveContent } from './hooks/useQueries';
import HeaderNav from './components/navigation/HeaderNav';
import HeroSection from './components/sections/HeroSection';
import ContentSections from './components/sections/ContentSections';
import Footer from './components/sections/Footer';
import AdminEditor from './components/admin/AdminEditor';
import LiveContentErrorState from './components/common/LiveContentErrorState';
import { Toaster } from 'sonner';

export default function App() {
  const { data: content, isLoading, isError, error, refetch } = useGetLiveContent();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  if (isError || !content) {
    return (
      <>
        <LiveContentErrorState 
          error={error} 
          onRetry={() => refetch()} 
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
        <HeaderNav 
          siteTitle={content.siteTitle} 
          onOpenEditor={() => setIsEditorOpen(true)}
        />
        
        <main className="flex-1">
          <HeroSection 
            title={content.heroSection.sectionTitle} 
            body={content.heroSection.sectionBody} 
            imageSrc={content.heroSection.imageSrc}
            titlePosition={content.heroSection.titlePosition}
            bodyPosition={content.heroSection.bodyPosition}
            imagePosition={content.heroSection.imagePosition}
          />
          
          <ContentSections 
            title={content.mainSection.sectionTitle} 
            body={content.mainSection.sectionBody} 
          />
        </main>
        
        <Footer footerText={content.footerText} />
      </div>
      
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
