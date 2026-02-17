import { AlertCircle, LogIn, Key } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

interface AccessDeniedScreenProps {
  variant: 'unauthenticated' | 'unauthorized';
  onClose?: () => void;
}

export default function AccessDeniedScreen({ variant, onClose }: AccessDeniedScreenProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  if (variant === 'unauthenticated') {
    return (
      <div className="py-8">
        <Alert>
          <LogIn className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Authentication Required</AlertTitle>
          <AlertDescription className="mt-2">
            You need to sign in to access the website editor.
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 flex flex-col items-center gap-4">
          <Button 
            onClick={handleLogin} 
            disabled={isLoggingIn}
            className="gap-2"
          >
            <LogIn className="h-4 w-4" />
            {isLoggingIn ? 'Signing in...' : 'Sign in with Internet Identity'}
          </Button>
          
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    );
  }

  // variant === 'unauthorized'
  return (
    <div className="py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Access Denied</AlertTitle>
        <AlertDescription className="mt-2">
          You do not have permission to access the website editor.
        </AlertDescription>
      </Alert>
      
      <div className="mt-6 space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-3">
            <Key className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-2">Admin Access Required</h4>
              <p className="text-sm text-muted-foreground mb-3">
                To gain admin access, add the admin secret token to the URL using the <code className="px-1.5 py-0.5 bg-background rounded text-xs">caffeineAdminToken</code> parameter:
              </p>
              <div className="bg-background p-3 rounded border border-border">
                <code className="text-xs break-all">
                  {window.location.origin}/#caffeineAdminToken=YOUR_SECRET_TOKEN
                </code>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Replace <code className="px-1 py-0.5 bg-background rounded">YOUR_SECRET_TOKEN</code> with your admin secret token, then refresh the page.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
