import { useState } from 'react';
import { Menu, X, Edit } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';

interface HeaderNavProps {
  siteTitle: string;
  onOpenEditor: () => void;
}

export default function HeaderNav({ siteTitle, onOpenEditor }: HeaderNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              {siteTitle}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('content')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </button>
            
            <Button
              onClick={onOpenEditor}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Site
            </Button>
            
            <LoginButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LoginButton />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border/40">
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('content')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              About
            </button>
            
            <button
              onClick={() => {
                onOpenEditor();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit Site
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
