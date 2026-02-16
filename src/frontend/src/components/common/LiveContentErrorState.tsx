import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LiveContentErrorStateProps {
  error?: Error | null;
  onRetry: () => void;
}

export default function LiveContentErrorState({ error, onRetry }: LiveContentErrorStateProps) {
  // Log structured error details for debugging
  if (error) {
    console.error('LiveContentErrorState - Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      cause: (error as any).cause,
      fullError: error,
    });
  }

  const errorMessage = error?.message || 'An error occurred while loading the website content. Please try again.';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to Load Content</AlertTitle>
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={onRetry}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Refresh Page
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground text-center">
          If the problem persists, please try refreshing your browser or contact support.
        </p>
      </div>
    </div>
  );
}
