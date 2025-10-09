import { useState } from 'react';
import AuthForm from '../AuthForm';

export default function AuthFormExample() {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <AuthForm 
        mode={mode} 
        onToggleMode={() => setMode(mode === 'login' ? 'register' : 'login')} 
      />
    </div>
  );
}
