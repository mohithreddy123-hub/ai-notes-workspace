import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import { ROUTES } from '../utils/constants';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 -translate-y-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-md w-full text-center relative z-10">
        <h1 className="text-9xl font-display font-black text-slate-200 dark:text-slate-800 animate-pulse">
          404
        </h1>
        <div className="-mt-12">
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Lost in thought?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            The page you're looking for doesn't exist or has been moved to another space.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              icon={ArrowLeft}
            >
              Go Back
            </Button>
            <Button 
              variant="primary" 
              onClick={() => navigate(ROUTES.APP.BASE)}
              icon={Home}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
