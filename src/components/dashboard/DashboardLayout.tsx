import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart3, Briefcase, Users } from 'lucide-react';
import AnalyticsDashboard from './AnalyticsDashboard';
import JobsManagement from './JobsManagement';
import CandidatesManagement from './CandidatesManagement';

type Tab = 'analytics' | 'jobs' | 'candidates';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('jobs');
  const { recruiter } = useAuth();

  const tabs = [
    { id: 'analytics' as Tab, label: 'Overview', icon: BarChart3 },
    { id: 'jobs' as Tab, label: 'Jobs', icon: Briefcase },
    { id: 'candidates' as Tab, label: 'Candidates', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      <aside className="w-56 border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-blue-600">Tim.ai</h1>
          <p className="text-sm text-slate-600 mt-1">Recruiter Dashboard</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            <p className="font-medium text-slate-900">{recruiter?.full_name}</p>
            {recruiter?.company_name && (
              <p className="text-xs mt-1">{recruiter.company_name}</p>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-50">
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'jobs' && <JobsManagement />}
        {activeTab === 'candidates' && <CandidatesManagement />}
      </main>
    </div>
  );
}
