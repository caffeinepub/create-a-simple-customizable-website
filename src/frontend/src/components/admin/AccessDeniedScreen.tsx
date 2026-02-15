import { ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AccessDeniedScreen() {
  return (
    <div className="py-8">
      <Alert variant="destructive">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Access Denied</AlertTitle>
        <AlertDescription className="mt-2">
          You do not have permission to access the website editor. Only administrators can edit site content.
        </AlertDescription>
      </Alert>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>If you believe this is an error, please contact your administrator.</p>
      </div>
    </div>
  );
}
