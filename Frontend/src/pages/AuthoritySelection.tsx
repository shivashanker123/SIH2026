import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Globe2, MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InteractiveBackground } from '@/components/InteractiveBackground';
import { useStudent, type AuthorityRole } from '@/contexts/StudentContext';

const authorityOptions: Array<{
  role: AuthorityRole;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}> = [
  {
    role: 'counsellor',
    title: 'Counsellor',
    subtitle: 'Full case detail, direct victim contact',
    icon: ShieldCheck,
    accent: 'text-cyan-400',
  },
  {
    role: 'district',
    title: 'District Authority',
    subtitle: 'District-level case monitoring',
    icon: MapPin,
    accent: 'text-blue-400',
  },
  {
    role: 'state',
    title: 'State Authority',
    subtitle: 'State-level aggregated analytics',
    icon: Building2,
    accent: 'text-violet-400',
  },
  {
    role: 'national',
    title: 'National Authority',
    subtitle: 'National policy-level analytics',
    icon: Globe2,
    accent: 'text-emerald-400',
  },
];

export const AuthoritySelection: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthorityRole } = useStudent();

  const handleSelect = (role: AuthorityRole) => {
    setAuthorityRole(role);
    navigate(`/admin-login/${role}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-background)' }}>
      <InteractiveBackground />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/mindcare')}
            className="mb-10 btn-glass"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-5">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Select your authority level
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Choose the level of access that matches your role in the victim wellbeing monitoring system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {authorityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => handleSelect(option.role)}
                  className="glass-card animated-border text-left p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <Card className="bg-transparent border-0 shadow-none">
                    <CardHeader className="p-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${option.accent}`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-500 pt-2">
                          Select
                        </span>
                      </div>
                      <CardTitle className="text-2xl text-white mt-6">{option.title}</CardTitle>
                      <CardDescription className="text-gray-300 text-base mt-2">
                        {option.subtitle}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
