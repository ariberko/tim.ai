import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import StartupError from './components/StartupError';
import { getSupabaseConfigError } from './lib/supabaseConfig';
import './index.css';

// Do not import the backend-dependent app until its configuration is valid.
// A static import would throw before React can render the setup notice.
const App = lazy(() => import('./App.tsx'));
const configError = getSupabaseConfigError(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {configError ? (
      <StartupError message={configError} />
    ) : (
      <Suspense fallback={<p role="status" className="p-8 text-slate-600">Loading Tim.ai…</p>}>
        <App />
      </Suspense>
    )}
  </StrictMode>
);
