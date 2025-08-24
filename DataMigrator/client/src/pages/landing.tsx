import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Key } from "lucide-react";

export default function Landing() {
  const handleReplitAuth = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-maroon flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-navy mb-2">Taletique</h1>
            <p className="text-dark-gray">Welcome to Premium Tailoring</p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleReplitAuth}
              className="w-full bg-navy text-white hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
              data-testid="button-replit-auth"
            >
              <Key className="w-5 h-5" />
              Continue with Authorization
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Sign in to access your tailoring account
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
