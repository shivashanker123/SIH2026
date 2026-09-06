import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveBackground } from '@/components/InteractiveBackground';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { loginStudent } from '@/services/api';
import { useStudent, type AuthorityRole } from '@/contexts/StudentContext';
import { useToast } from '@/hooks/use-toast';

const AUTH_BYPASS_ENABLED = true;

const roleLabels: Record<AuthorityRole, string> = {
  counsellor: 'Counsellor',
  district: 'District Authority',
  state: 'State Authority',
  national: 'National Authority',
};

const isAuthorityRole = (value: string | undefined): value is AuthorityRole =>
  value === 'counsellor' || value === 'district' || value === 'state' || value === 'national';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { authorityRole: routeRole } = useParams<{ authorityRole: string }>();
  const { setAuthorityRole } = useStudent();
  const selectedRole = isAuthorityRole(routeRole) ? routeRole : null;
  const roleLabel = selectedRole ? roleLabels[selectedRole] : 'Authority';

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (!selectedRole) return;
    setAuthorityRole(selectedRole);
  }, [selectedRole, setAuthorityRole]);

  if (!selectedRole) {
    return <Navigate to="/authority-selection" replace />;
  }

  const completeLogin = (email: string, id: string, token: string) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_email', email);
    localStorage.setItem('admin_id', id);
    setAuthorityRole(selectedRole);
    toast({
      title: `${roleLabel} access enabled`,
      description: `Signed in as ${email}`,
    });
    setIsLoading(false);
    navigate(`/dashboard/${selectedRole}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (AUTH_BYPASS_ENABLED) {
      completeLogin(
        formData.email.trim() || `demo.${selectedRole}@haven.local`,
        `admin_${selectedRole}`,
        'dev-bypass-token'
      );
      return;
    }

    try {
      const response = await loginStudent({
        email: formData.email,
        password: formData.password
      });
      completeLogin(response.email, response.student_id, response.token);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--gradient-background)' }}>
      <InteractiveBackground />

      <div className="relative z-10 container mx-auto px-6 py-12 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate('/authority-selection')}
            className="mb-8 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Change authority level
          </Button>

          <Card className="bg-gray-800/90 backdrop-blur-md border border-gray-700/50 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-cyan-400">
                {roleLabel} Login
              </CardTitle>
              <CardDescription className="text-gray-300 mt-2">
                Secure access for the {roleLabel.toLowerCase()} workspace
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-white">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your authority email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-400"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-200 bg-red-900/50 rounded-md border border-red-600">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Signing in...
                    </>
                  ) : (
                    'Continue to workspace'
                  )}
                </Button>
              </form>

              <p className="mt-6 p-4 bg-gray-700/30 rounded-lg text-xs text-gray-400 text-center">
                Demo access is enabled while authentication is being reworked.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
