import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ROUTES } from '../../utils/constants';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await signup({
        email: data.email,
        username: data.username,
        full_name: data.full_name,
        password: data.password,
        password_confirm: data.password_confirm
      });
      toast.success('Account created successfully!');
      navigate(ROUTES.APP.NOTES);
    } catch (error) {
      if (error.response?.data) {
        const errs = error.response.data;
        Object.keys(errs).forEach(key => {
          toast.error(`${key}: ${errs[key]}`);
        });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -translate-y-12 right-0 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -translate-x-12 left-0 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-display font-bold text-slate-900 dark:text-white">
            Create your workspace
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
              Sign in instead
            </Link>
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl animate-slide-up">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
            <Input
              label="Full Name"
              placeholder="John Doe"
              {...register("full_name")}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Username *"
                placeholder="johndoe"
                error={errors.username?.message}
                {...register("username", { 
                  required: "Username is required", 
                  minLength: { value: 3, message: "Min 3 chars" } 
                })}
              />

              <Input
                label="Email *"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                })}
              />
            </div>

            <Input
              label="Password *"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password", { 
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" }
              })}
            />

            <Input
              label="Confirm Password *"
              type="password"
              placeholder="••••••••"
              error={errors.password_confirm?.message}
              {...register("password_confirm", { 
                validate: value => value === password || "Passwords do not match"
              })}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-2.5 mt-2"
            >
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
