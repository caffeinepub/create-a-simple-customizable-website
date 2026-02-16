import { useState, useEffect } from 'react';
import { useGetDraftContent, useUpdateDraftContent, usePublishDraft } from '../../hooks/useAnonymousWebsiteContent';
import HeroSection from '../sections/HeroSection';
import type { Alignment } from '../../backend';
import { Variant_top_middle_bottom } from '../../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Save, Eye, Edit, RefreshCw, Rocket } from 'lucide-react';
import { toast } from 'sonner';

interface AdminEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_IMAGES = [
  { value: '/assets/generated/hero-illustration.dim_1600x900.png', label: 'Hero Illustration (Default)' },
  { value: '/assets/generated/hero-illustration-alt-1.dim_1600x900.png', label: 'Hero Illustration Alt 1' },
  { value: '/assets/generated/hero-illustration-alt-2.dim_1600x900.png', label: 'Hero Illustration Alt 2' },
  { value: '/assets/generated/hero-illustration-alt-3.dim_1600x900.png', label: 'Hero Illustration Alt 3' },
];

export default function AdminEditor({ isOpen, onClose }: AdminEditorProps) {
  const { data: content, isLoading: contentLoading, error: contentError, refetch } = useGetDraftContent(isOpen);
  const { mutate: updateDraft, isPending: isSaving, error: saveError, isSuccess: saveSuccess, reset: resetSaveMutation } = useUpdateDraftContent();
  const { mutate: publishDraft, isPending: isPublishing, error: publishError, isSuccess: publishSuccess, reset: resetPublishMutation } = usePublishDraft();

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [formData, setFormData] = useState({
    siteTitle: '',
    heroTitle: '',
    heroBody: '',
    heroImageSrc: '',
    heroImageCustomUrl: '',
    titleHorizontal: 'left' as Alignment,
    titleVertical: Variant_top_middle_bottom.top,
    bodyHorizontal: 'left' as Alignment,
    bodyVertical: Variant_top_middle_bottom.middle,
    imageHorizontal: 'right' as Alignment,
    imageVertical: Variant_top_middle_bottom.top,
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
        heroImageSrc: content.heroSection.imageSrc || '',
        heroImageCustomUrl: '',
        titleHorizontal: content.heroSection.titlePosition?.horizontal || 'left',
        titleVertical: content.heroSection.titlePosition?.vertical || Variant_top_middle_bottom.top,
        bodyHorizontal: content.heroSection.bodyPosition?.horizontal || 'left',
        bodyVertical: content.heroSection.bodyPosition?.vertical || Variant_top_middle_bottom.middle,
        imageHorizontal: content.heroSection.imagePosition?.horizontal || 'right',
        imageVertical: content.heroSection.imagePosition?.vertical || Variant_top_middle_bottom.top,
        mainTitle: content.mainSection.sectionTitle,
        mainBody: content.mainSection.sectionBody,
        footerText: content.footerText,
      });
    }
  }, [content]);

  useEffect(() => {
    if (saveSuccess) {
      toast.success('Draft saved successfully!');
      resetSaveMutation();
    }
  }, [saveSuccess, resetSaveMutation]);

  useEffect(() => {
    if (publishSuccess) {
      toast.success('Changes published live!', {
        description: 'Your website has been updated and is now visible to all visitors.',
      });
      resetPublishMutation();
      handleClose();
    }
  }, [publishSuccess, resetPublishMutation]);

  // Log errors for debugging
  useEffect(() => {
    if (contentError) {
      console.error('AdminEditor - Draft content load error:', {
        message: contentError instanceof Error ? contentError.message : 'Unknown error',
        error: contentError,
        stack: contentError instanceof Error ? contentError.stack : undefined,
      });
    }
  }, [contentError]);

  useEffect(() => {
    if (saveError) {
      console.error('AdminEditor - Draft save error:', {
        message: saveError instanceof Error ? saveError.message : 'Unknown error',
        error: saveError,
        stack: saveError instanceof Error ? saveError.stack : undefined,
      });
    }
  }, [saveError]);

  useEffect(() => {
    if (publishError) {
      console.error('AdminEditor - Publish error:', {
        message: publishError instanceof Error ? publishError.message : 'Unknown error',
        error: publishError,
        stack: publishError instanceof Error ? publishError.stack : undefined,
      });
    }
  }, [publishError]);

  const handleClose = () => {
    resetSaveMutation();
    resetPublishMutation();
    onClose();
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use custom URL if provided, otherwise use selected image
    const finalImageSrc = formData.heroImageCustomUrl.trim() || formData.heroImageSrc;
    
    updateDraft({
      siteTitle: formData.siteTitle,
      heroSection: {
        sectionTitle: formData.heroTitle,
        sectionBody: formData.heroBody,
        imageSrc: finalImageSrc,
        titlePosition: {
          horizontal: formData.titleHorizontal,
          vertical: formData.titleVertical,
        },
        bodyPosition: {
          horizontal: formData.bodyHorizontal,
          vertical: formData.bodyVertical,
        },
        imagePosition: {
          horizontal: formData.imageHorizontal,
          vertical: formData.imageVertical,
        },
      },
      mainSection: {
        sectionTitle: formData.mainTitle,
        sectionBody: formData.mainBody,
      },
      footerText: formData.footerText,
    });
  };

  const handlePublishClick = () => {
    setShowPublishConfirm(true);
  };

  const handlePublishConfirm = () => {
    publishDraft();
    setShowPublishConfirm(false);
  };

  const handleRetry = () => {
    refetch();
  };

  if (contentLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
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

  if (contentError) {
    const errorMessage = contentError instanceof Error 
      ? contentError.message 
      : 'An unexpected error occurred while loading the website content. Please try again.';
    
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Unable to Load Content</DialogTitle>
            <DialogDescription>
              There was a problem loading the website content for editing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Loading Failed</AlertTitle>
              <AlertDescription className="mt-2">
                {errorMessage}
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleRetry} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const previewImageSrc = formData.heroImageCustomUrl.trim() || formData.heroImageSrc;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Website Content</DialogTitle>
            <DialogDescription>
              Make changes to your draft. Save your work, then publish when ready to make it live.
            </DialogDescription>
          </DialogHeader>

          {saveError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to save draft: {saveError instanceof Error ? saveError.message : 'Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {publishError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to publish changes: {publishError instanceof Error ? publishError.message : 'Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-[calc(95vh-220px)] pr-4">
                <form onSubmit={handleSaveDraft} className="space-y-6">
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

                    <div className="space-y-4 p-3 bg-background rounded border border-border">
                      <h4 className="font-medium text-sm">Hero Image</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="heroImageSelect">Select from Gallery</Label>
                        <Select
                          value={formData.heroImageSrc}
                          onValueChange={(value) => setFormData({ ...formData, heroImageSrc: value, heroImageCustomUrl: '' })}
                        >
                          <SelectTrigger id="heroImageSelect">
                            <SelectValue placeholder="Choose an image" />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_IMAGES.map((img) => (
                              <SelectItem key={img.value} value={img.value}>
                                {img.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="heroImageCustomUrl">Custom Image URL</Label>
                        <Input
                          id="heroImageCustomUrl"
                          value={formData.heroImageCustomUrl}
                          onChange={(e) => setFormData({ ...formData, heroImageCustomUrl: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter a custom URL to override the gallery selection
                        </p>
                      </div>

                      {previewImageSrc && (
                        <div className="space-y-2">
                          <Label>Current Image Preview</Label>
                          <div className="relative w-full h-32 bg-muted rounded overflow-hidden">
                            <img
                              src={previewImageSrc}
                              alt="Hero preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 p-3 bg-background rounded border border-border">
                      <h4 className="font-medium text-sm">Layout Controls</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="titleHorizontal">Title Horizontal</Label>
                          <Select
                            value={formData.titleHorizontal}
                            onValueChange={(value) => setFormData({ ...formData, titleHorizontal: value as Alignment })}
                          >
                            <SelectTrigger id="titleHorizontal">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="titleVertical">Title Vertical</Label>
                          <Select
                            value={formData.titleVertical}
                            onValueChange={(value) => setFormData({ ...formData, titleVertical: value as Variant_top_middle_bottom })}
                          >
                            <SelectTrigger id="titleVertical">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={Variant_top_middle_bottom.top}>Top</SelectItem>
                              <SelectItem value={Variant_top_middle_bottom.middle}>Middle</SelectItem>
                              <SelectItem value={Variant_top_middle_bottom.bottom}>Bottom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bodyHorizontal">Body Horizontal</Label>
                          <Select
                            value={formData.bodyHorizontal}
                            onValueChange={(value) => setFormData({ ...formData, bodyHorizontal: value as Alignment })}
                          >
                            <SelectTrigger id="bodyHorizontal">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bodyVertical">Body Vertical</Label>
                          <Select
                            value={formData.bodyVertical}
                            onValueChange={(value) => setFormData({ ...formData, bodyVertical: value as Variant_top_middle_bottom })}
                          >
                            <SelectTrigger id="bodyVertical">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={Variant_top_middle_bottom.top}>Top</SelectItem>
                              <SelectItem value={Variant_top_middle_bottom.middle}>Middle</SelectItem>
                              <SelectItem value={Variant_top_middle_bottom.bottom}>Bottom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="imageHorizontal">Image Horizontal</Label>
                          <Select
                            value={formData.imageHorizontal}
                            onValueChange={(value) => setFormData({ ...formData, imageHorizontal: value as Alignment })}
                          >
                            <SelectTrigger id="imageHorizontal">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Left</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="imageVertical">Image Vertical</Label>
                          <Select
                            value={formData.imageVertical}
                            onValueChange={(value) => setFormData({ ...formData, imageVertical: value as Variant_top_middle_bottom })}
                          >
                            <SelectTrigger id="imageVertical">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={Variant_top_middle_bottom.top}>Top</SelectItem>
                              <SelectItem value={Variant_top_middle_bottom.middle}>Middle</SelectItem>
                              <SelectItem value={Variant_top_middle_bottom.bottom}>Bottom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
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
                      <Label htmlFor="mainBody">Section Description</Label>
                      <Textarea
                        id="mainBody"
                        value={formData.mainBody}
                        onChange={(e) => setFormData({ ...formData, mainBody: e.target.value })}
                        placeholder="Enter section description"
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Footer</h3>
                    
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
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving} className="gap-2">
                      {isSaving ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Draft
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handlePublishClick}
                      disabled={isPublishing}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      {isPublishing ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4" />
                          Publish Live
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-[calc(95vh-220px)]">
                <div className="space-y-8 pb-8">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Hero Section Preview</h3>
                    <div className="bg-background rounded border">
                      <HeroSection
                        title={formData.heroTitle}
                        body={formData.heroBody}
                        imageSrc={previewImageSrc}
                        titlePosition={{
                          horizontal: formData.titleHorizontal,
                          vertical: formData.titleVertical,
                        }}
                        bodyPosition={{
                          horizontal: formData.bodyHorizontal,
                          vertical: formData.bodyVertical,
                        }}
                        imagePosition={{
                          horizontal: formData.imageHorizontal,
                          vertical: formData.imageVertical,
                        }}
                        isPreview
                      />
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Main Section Preview</h3>
                    <div className="bg-background rounded border p-8">
                      <h2 className="text-3xl font-bold mb-4">{formData.mainTitle}</h2>
                      <p className="text-muted-foreground">{formData.mainBody}</p>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Footer Preview</h3>
                    <div className="bg-background rounded border p-6 text-center">
                      <p className="text-sm text-muted-foreground">{formData.footerText}</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Changes Live?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make your draft changes visible to all visitors immediately. Make sure you've saved your draft first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublishConfirm} className="bg-green-600 hover:bg-green-700">
              Publish Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
