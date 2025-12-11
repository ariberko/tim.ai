import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { X } from 'lucide-react';

const JOB_TITLES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Product Manager',
  'Senior Product Manager',
  'UX Designer',
  'UI Designer',
  'UX/UI Designer',
  'Marketing Manager',
  'Sales Representative',
  'Account Executive',
  'Customer Success Manager',
  'HR Manager',
  'Recruiter',
  'Business Analyst',
  'Project Manager',
  'Scrum Master',
  'QA Engineer',
  'Technical Writer',
  'Other',
];

const LOCATIONS = [
  'Remote',
  'Hybrid',
  'San Francisco, CA',
  'New York, NY',
  'Los Angeles, CA',
  'Austin, TX',
  'Seattle, WA',
  'Boston, MA',
  'Chicago, IL',
  'Denver, CO',
  'Miami, FL',
  'Atlanta, GA',
  'Portland, OR',
  'Washington, DC',
  'Other',
];

const SALARY_RANGES = [
  '$40,000 - $60,000',
  '$60,000 - $80,000',
  '$80,000 - $100,000',
  '$100,000 - $120,000',
  '$120,000 - $140,000',
  '$140,000 - $160,000',
  '$160,000 - $180,000',
  '$180,000 - $200,000',
  '$200,000+',
  'Competitive',
  'Other',
];

interface Job {
  id: string;
  title: string;
  description: string;
  location: string | null;
  employment_type: string;
  salary_range: string | null;
  requirements: string | null;
  status: 'draft' | 'open' | 'closed';
}

interface JobFormModalProps {
  job: Job | null;
  onClose: () => void;
}

interface JobStage {
  name: string;
  order_num: number;
  pass_threshold: number;
  auto_advance: boolean;
}

export default function JobFormModal({ job, onClose }: JobFormModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    location: job?.location || '',
    employment_type: job?.employment_type || 'Full-time',
    salary_range: job?.salary_range || '',
    requirements: job?.requirements || '',
    status: job?.status || 'draft',
  });
  const [customTitle, setCustomTitle] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [customSalary, setCustomSalary] = useState('');
  const [showCustomTitle, setShowCustomTitle] = useState(false);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [showCustomSalary, setShowCustomSalary] = useState(false);
  const [stages, setStages] = useState<JobStage[]>([
    { name: 'Application Review', order_num: 1, pass_threshold: 70, auto_advance: false },
    { name: 'Phone Screen', order_num: 2, pass_threshold: 70, auto_advance: false },
    { name: 'Technical Interview', order_num: 3, pass_threshold: 75, auto_advance: false },
  ]);

  useEffect(() => {
    if (job) {
      loadStages(job.id);
    }
  }, [job]);

  const loadStages = async (jobId: string) => {
    const { data } = await supabase
      .from('job_stages')
      .select('*')
      .eq('job_id', jobId)
      .order('order_num');

    if (data && data.length > 0) {
      setStages(data);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let jobId = job?.id;

      if (job) {
        const { error } = await supabase
          .from('jobs')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', job.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('jobs')
          .insert([{ ...formData, recruiter_id: user!.id }])
          .select()
          .single();

        if (error) throw error;
        jobId = data.id;

        await supabase.from('job_stages').delete().eq('job_id', jobId);

        const stagesData = stages.map((stage) => ({
          ...stage,
          job_id: jobId,
        }));

        const { error: stagesError } = await supabase
          .from('job_stages')
          .insert(stagesData);

        if (stagesError) throw stagesError;
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving job:', error);
      alert(error.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  const addStage = () => {
    setStages([
      ...stages,
      {
        name: '',
        order_num: stages.length + 1,
        pass_threshold: 70,
        auto_advance: false,
      },
    ]);
  };

  const removeStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const updateStage = (index: number, field: keyof JobStage, value: any) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setStages(newStages);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {job ? 'Edit Job' : 'Create New Job'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Title
            </label>
            {showCustomTitle ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => {
                    setCustomTitle(e.target.value);
                    setFormData({ ...formData, title: e.target.value });
                  }}
                  required
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Enter custom job title"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomTitle(false);
                    setCustomTitle('');
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                name="title"
                value={formData.title}
                onChange={(e) => {
                  if (e.target.value === 'Other') {
                    setShowCustomTitle(true);
                  } else {
                    handleChange(e);
                  }
                }}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="">Select a job title</option>
                {JOB_TITLES.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              {showCustomLocation ? (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => {
                      setCustomLocation(e.target.value);
                      setFormData({ ...formData, location: e.target.value });
                    }}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="Enter custom location"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomLocation(false);
                      setCustomLocation('');
                    }}
                    className="text-sm text-slate-600 hover:underline"
                  >
                    Use dropdown
                  </button>
                </div>
              ) : (
                <select
                  name="location"
                  value={formData.location}
                  onChange={(e) => {
                    if (e.target.value === 'Other') {
                      setShowCustomLocation(true);
                    } else {
                      handleChange(e);
                    }
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="">Select location</option>
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Employment Type
              </label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Salary Range
            </label>
            {showCustomSalary ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customSalary}
                  onChange={(e) => {
                    setCustomSalary(e.target.value);
                    setFormData({ ...formData, salary_range: e.target.value });
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Enter custom salary range"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomSalary(false);
                    setCustomSalary('');
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                name="salary_range"
                value={formData.salary_range}
                onChange={(e) => {
                  if (e.target.value === 'Other') {
                    setShowCustomSalary(true);
                  } else {
                    handleChange(e);
                  }
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="">Select salary range</option>
                {SALARY_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="Describe the role, responsibilities, and what makes this position exciting..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="List the qualifications and skills required..."
            />
          </div>

          {!job && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-slate-700">
                  Interview Stages
                </label>
                <button
                  type="button"
                  onClick={addStage}
                  className="text-sm text-slate-900 hover:underline"
                >
                  + Add Stage
                </button>
              </div>
              <div className="space-y-3">
                {stages.map((stage, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
                    <input
                      type="text"
                      value={stage.name}
                      onChange={(e) => updateStage(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      placeholder="Stage name"
                    />
                    <input
                      type="number"
                      value={stage.pass_threshold}
                      onChange={(e) => updateStage(index, 'pass_threshold', parseInt(e.target.value))}
                      className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-slate-600">%</span>
                    {stages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStage(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
