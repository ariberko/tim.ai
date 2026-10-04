interface StartupErrorProps {
  message: string;
}

export default function StartupError({ message }: StartupErrorProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <section aria-labelledby="setup-title" className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-8">
        <p className="text-sm font-semibold tracking-wide text-slate-500 mb-3">Tim.ai</p>
        <h1 id="setup-title" className="text-2xl font-bold text-slate-900 mb-4">
          Backend setup required
        </h1>
        <p className="text-slate-600 mb-4">{message}</p>
        <p className="text-slate-600 mb-4">
          This app uses Supabase for sign-in and recruiting data. Those features are
          unavailable until a backend is connected.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
          <p className="mb-3">Add these values through the Base44 Secrets page:</p>
          <ul className="space-y-2">
            <li><code className="break-all">VITE_SUPABASE_URL</code></li>
            <li><code className="break-all">VITE_SUPABASE_ANON_KEY</code></li>
          </ul>
          <p className="mt-3">Use your Supabase project URL and anon/public key, not a service-role key.</p>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          After saving the settings, wait for the preview to restart, then refresh this page.
        </p>
      </section>
    </main>
  );
}
