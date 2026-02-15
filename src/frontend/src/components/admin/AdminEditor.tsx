import { useState, useEffect } from 'react';
import { useGetAnonymousWebsiteContent, useUpdateAnonymousWebsiteContent } from '../../hooks/useAnonymousWebsiteContent';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Save, Eye, Edit } from 'lucide-react';
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
  const { data: content, isLoading: contentLoading } = useGetAnonymousWebsiteContent();
  const { mutate: updateContent, isPending, error, isSuccess, reset: resetMutation } = useUpdateAnonymousWebsiteContent();

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
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
    if (isSuccess) {
      toast.success('Website content updated successfully!');
      handleClose();
    }
  }, [isSuccess]);

  const handleClose = () => {
    resetMutation();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use custom URL if provided, otherwise use selected image
    const finalImageSrc = formData.heroImageCustomUrl.trim() || formData.heroImageSrc;
    
    updateContent({
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

  const previewImageSrc = formData.heroImageCustomUrl.trim() || formData.heroImageSrc;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Website Content</DialogTitle>
          <DialogDescription>
            Update your website content and preview changes in real-time before saving.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to update content: {error instanceof Error ? error.message : 'Unknown error'}
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
                        <div className="aspect-video rounded overflow-hidden border border-border">
                          <img
                            src={previewImageSrc}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-3 bg-background rounded border border-border">
                    <h4 className="font-medium text-sm">Layout & Positioning</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="titleHorizontal">Title Alignment</Label>
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
                        <Label htmlFor="titleVertical">Title Vertical Position</Label>
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
                        <Label htmlFor="bodyHorizontal">Body Alignment</Label>
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
                        <Label htmlFor="bodyVertical">Body Vertical Position</Label>
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
                        <Label htmlFor="imageHorizontal">Image Position</Label>
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
                        <Label htmlFor="imageVertical">Image Vertical Position</Label>
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
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Main Content Section</h3>
                  
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
                  <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-[calc(95vh-180px)]">
              <div className="space-y-8 pb-8">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Hero Section Preview</h3>
                  <div className="bg-background rounded border border-border overflow-hidden">
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
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Main Content Preview</h3>
                  <div className="bg-background rounded border border-border p-8">
                    <div className="max-w-4xl mx-auto text-center">
                      <h2 className="text-3xl font-bold mb-4">{formData.mainTitle}</h2>
                      <p className="text-lg text-muted-foreground">{formData.mainBody}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Footer Preview</h3>
                  <div className="bg-background rounded border border-border p-6">
                    <p className="text-center text-sm text-muted-foreground">{formData.footerText}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
