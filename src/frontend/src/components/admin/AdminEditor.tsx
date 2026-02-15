import { useState, useEffect } from 'react';
import { useGetWebsiteContent, useUpdateWebsiteContent } from '../../hooks/useQueries';
import { useAdminAccess } from '../../hooks/useAdminAccess';
import AccessDeniedScreen from './AccessDeniedScreen';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AdminEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminEditor({ isOpen, onClose }: AdminEditorProps) {
  const { isAdmin, isLoading: adminLoading, isAuthenticated } = useAdminAccess();
  const { data: content, isLoading: contentLoading } = useGetWebsiteContent();
  const { mutate: updateContent, isPending, error, isSuccess } = useUpdateWebsiteContent();

  const [formData, setFormData] = useState({
    siteTitle: '',
    heroTitle: '',
    heroBody: '',
    mainTitle: '',
    mainBody: '',
    footerText: '',
  });

  useEffect(() => {
    if (content) {
      setFormData({
        siteTitle: content.siteTitle,
        heroTitle: content.heroSection.sectionTitle,
        heroBody: content.heroSection.sectionBody,
        mainTitle: content.mainSection.sectionTitle,
        mainBody: content.mainSection.sectionBody,
        footerText: content.footerText,
      });
    }
  }, [content]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Website content updated successfully!');
      onClose();
    }
  }, [isSuccess, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateContent({
      siteTitle: formData.siteTitle,
      heroSection: {
        sectionTitle: formData.heroTitle,
        sectionBody: formData.heroBody,
      },
      mainSection: {
        sectionTitle: formData.mainTitle,
        sectionBody: formData.mainBody,
      },
      footerText: formData.footerText,
    });
  };

  if (!isAuthenticated || (!adminLoading && !isAdmin)) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <AccessDeniedScreen />
        </DialogContent>
      </Dialog>
    );
  }

  if (adminLoading || contentLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading editor...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Website Content</DialogTitle>
          <DialogDescription>
            Update your website content below. Changes will be visible immediately after saving.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={formData.siteTitle}
                onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                placeholder="Enter site title"
                required
              />
            </div>

            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Hero Section</h3>
              
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Headline</Label>
                <Input
                  id="heroTitle"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="Enter hero headline"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroBody">Hero Description</Label>
                <Textarea
                  id="heroBody"
                  value={formData.heroBody}
                  onChange={(e) => setFormData({ ...formData, heroBody: e.target.value })}
                  placeholder="Enter hero description"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Main Section</h3>
              
              <div className="space-y-2">
                <Label htmlFor="mainTitle">Section Title</Label>
                <Input
                  id="mainTitle"
                  value={formData.mainTitle}
                  onChange={(e) => setFormData({ ...formData, mainTitle: e.target.value })}
                  placeholder="Enter section title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mainBody">Section Body</Label>
                <Textarea
                  id="mainBody"
                  value={formData.mainBody}
                  onChange={(e) => setFormData({ ...formData, mainBody: e.target.value })}
                  placeholder="Enter section body"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="footerText">Footer Text</Label>
              <Input
                id="footerText"
                value={formData.footerText}
                onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                placeholder="Enter footer text"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error instanceof Error ? error.message : 'Failed to update content. Please try again.'}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
