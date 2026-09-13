import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let success = false;
    
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await register(name, email, password);
    }
    
    setIsSubmitting(false);
    if (success) {
      const origin = location.state?.from?.pathname || '/';
      navigate(origin);
    }
  };

  const handleDemoLogin = async (role) => {
    setIsSubmitting(true);
    const demoEmail = role === 'admin' ? 'admin@northstar.test' : 'customer@northstar.test';
    const demoPass = role === 'admin' ? 'admin1234' : 'customer1234';
    
    const success = await login(demoEmail, demoPass);
    setIsSubmitting(false);
    
    if (success) {
      navigate(role === 'admin' ? '/admin' : '/');
    }
  };

  return (
    <div className="page-wrap flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-12">
          <span className="eyebrow mb-2">Account</span>
          <h1 className="m-0">{isLogin ? 'Welcome back.' : 'Create an account.'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mb-8">
          {!isLogin && (
            <label>
              Full Name
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}
          
          <label>
            Email Address
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          
          <label>
            Password
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit" disabled={isSubmitting} className="button dark w-full mt-2">
            {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center border-b border-line pb-8 mb-8">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-caption text-muted underline hover:text-ink transition-colors bg-transparent border-0"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="bg-mutedBg p-6 border border-line">
          <p className="text-caption font-semibold mb-4 text-center">Quick Demo Access</p>
          <div className="flex flex-col gap-3">
            <button 
              type="button" 
              onClick={() => handleDemoLogin('customer')}
              className="button border border-line bg-card w-full"
            >
              Sign in as Customer
            </button>
            <button 
              type="button" 
              onClick={() => handleDemoLogin('admin')}
              className="button border border-line bg-card w-full"
            >
              Sign in as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
