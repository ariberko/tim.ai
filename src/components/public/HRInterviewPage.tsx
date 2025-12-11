import React, { useEffect } from 'react';
import { Briefcase, Mic, CheckCircle2 } from 'lucide-react';

interface HRInterviewPageProps {
  candidateName: string;
  jobTitle: string;
}

export default function HRInterviewPage({ candidateName, jobTitle }: HRInterviewPageProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      const scriptElement = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white p-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome to Your HR Interview</h1>
                <p className="text-slate-300 mt-1">AI-Powered Conversation</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-slate-700 mb-2">
                    Thank you, <span className="font-medium">{candidateName}</span>, for applying to the{' '}
                    <span className="font-medium">{jobTitle}</span> position.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-slate-900 p-2 rounded-lg">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Next Step: HR Interview
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 mb-6">
                <p className="leading-relaxed">
                  To continue with your application, please complete a brief HR interview with our AI assistant.
                  This conversation will help us better understand your background, experience, and fit for the role.
                </p>

                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">What to expect:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>The interview will take approximately 10-15 minutes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>You'll be asked about your background, skills, and experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Speak clearly and naturally - the AI will understand you</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Make sure you're in a quiet environment with a working microphone</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Your responses will be reviewed by our hiring team</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-slate-900 shadow-lg">
                <p className="text-center text-slate-700 mb-4 font-medium">
                  Click the widget below to start your HR interview
                </p>
                <div className="flex justify-center">
                  <elevenlabs-convai agent-id="agent_3801kc77ha1gexgszk4rfbdaxnxy"></elevenlabs-convai>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-slate-600">
                <p>
                  Having technical issues? Please contact{' '}
                  <a href="mailto:support@example.com" className="text-slate-900 hover:underline font-medium">
                    support@example.com
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Tips for a successful interview:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                <div className="space-y-2">
                  <p className="font-medium text-slate-900">Before you start:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Test your microphone</li>
                    <li>• Find a quiet space</li>
                    <li>• Have your resume handy</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-slate-900">During the interview:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Be authentic and honest</li>
                    <li>• Take your time to think</li>
                    <li>• Ask questions if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
