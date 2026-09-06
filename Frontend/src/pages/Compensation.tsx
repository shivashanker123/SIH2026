import React from 'react';
import { BadgeIndianRupee, CheckCircle2, Clock3, FileText, WalletCards } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const schemes = [
  {
    name: 'Immediate Relief Assistance',
    status: 'Applied',
    description: 'Short-term financial support for urgent household and safety needs.',
    icon: FileText,
  },
  {
    name: 'Rehabilitation Support',
    status: 'Under Review',
    description: 'Support for safe relocation, essential services, and rebuilding stability.',
    icon: Clock3,
  },
  {
    name: 'Compensation Disbursement',
    status: 'Sanctioned',
    description: 'Approved compensation connected to the registered case and relief process.',
    icon: CheckCircle2,
  },
] as const;

const statusClasses = {
  Applied: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  'Under Review': 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  Sanctioned: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  Disbursed: 'bg-violet-500/15 text-violet-300 border-violet-400/30',
} as const;

export const Compensation: React.FC = () => {
  return (
    <DashboardLayout userType="student">
      <div className="space-y-8 animate-fade-in">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 mb-3">Relief and rehabilitation</p>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <WalletCards className="w-9 h-9 text-cyan-400" />
            My Compensation
          </h1>
          <p className="text-lg text-gray-300 mt-3">
            Track the support schemes connected to your registered case.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {schemes.map((scheme) => {
            const Icon = scheme.icon;

            return (
              <Card key={scheme.name} className="glass-card border-0 h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-cyan-300" />
                    </div>
                    <Badge variant="outline" className={statusClasses[scheme.status]}>
                      {scheme.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-white mt-5">{scheme.name}</CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed">
                    {scheme.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BadgeIndianRupee className="w-4 h-4 text-cyan-400" />
                    Status updates will appear here as the process moves forward.
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};
