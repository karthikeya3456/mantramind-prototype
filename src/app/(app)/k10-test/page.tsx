import { K10TestForm } from '@/components/k10-test-form';

export default function K10TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <K10TestForm />
      </div>
    </div>
  );
}
