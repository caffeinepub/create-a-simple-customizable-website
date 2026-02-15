import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AccessDeniedScreen() {
  return (
    <div className="py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Unable to Load Editor</AlertTitle>
        <AlertDescription className="mt-2">
          There was an error loading the website editor. Please try again later.
        </AlertDescription>
      </Alert>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>If this problem persists, please refresh the page.</p>
      </div>
    </div>
  );
}
