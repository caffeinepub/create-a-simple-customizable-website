import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Edit } from 'lucide-react';

interface HeaderNavProps {
  siteTitle: string;
  onOpenEditor: () => void;
}

export default function HeaderNav({ siteTitle, onOpenEditor }: HeaderNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-foreground">{siteTitle}</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <Button 
              onClick={onOpenEditor}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Draft
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Features
              </button>
              <Button 
                onClick={() => {
                  onOpenEditor();
                  setIsMobileMenuOpen(false);
                }}
                variant="outline"
                size="sm"
                className="gap-2 justify-start"
              >
                <Edit className="h-4 w-4" />
                Edit Draft
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
