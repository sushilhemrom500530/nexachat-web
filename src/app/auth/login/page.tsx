import type { Metadata } from 'next';
import { LoginCard } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Login — NexaChat',
  description: 'Sign in or register instantly with your phone number and name.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-transparent blur-[140px] rounded-full pointer-events-none" />

      <LoginCard isFullPage={true} />
    </div>
  );
}
