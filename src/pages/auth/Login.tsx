
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AuthLayout from '@/components/AuthLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/administrator/dashboard');
    }
  }, [user, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) throw error;
      
      if (authData.user) {
        // Check if user is an administrator
        const { data: adminData, error: adminError } = await supabase
          .from('administrators')
          .select('id, role, school_id, status')
          .eq('user_id', authData.user.id)
          .eq('status', 'active')
          .single();

        if (adminError && adminError.code !== 'PGRST116') {
          console.error('Error checking admin status:', adminError);
        }

        if (adminData) {
          // User is an administrator
          toast({
            title: 'Login successful',
            description: 'Welcome back to the administration panel.',
          });
          
          // Redirect to admin dashboard
          navigate('/administrator/dashboard');
        } else {
          // Check if user has school assignments
          const { data: schoolData, error: schoolError } = await supabase
            .from('users_to_schools')
            .select('school_id, role')
            .eq('user_id', authData.user.id)
            .eq('is_active', true)
            .single();

          if (schoolError && schoolError.code !== 'PGRST116') {
            console.error('Error checking school assignment:', schoolError);
          }

          if (schoolData) {
            // User has school access
            toast({
              title: 'Login successful',
              description: 'Welcome back to the school management system.',
            });
            
            // Redirect to school dashboard
            navigate('/school/dashboard');
          } else {
            // Regular user or no specific role
            toast({
              title: 'Login successful',
              description: 'Welcome back to the system.',
            });
            
            // Redirect to main dashboard
            navigate('/school-management/dashboard');
          }
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Please check your credentials and try again.';
      
      // Handle specific error cases
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before logging in.';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
      } else if (error.message?.includes('User not found')) {
        errorMessage = 'No account found with this email address.';
      }
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthLayout
      title="Administrator Login"
      description="Sign in to your administrator account"
      footer={
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/auth/register" className="font-medium text-primary hover:underline">
            Register
          </Link>
        </p>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="admin@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      {...field} 
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between items-center mt-2">
            <Link 
              to="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full border-current" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </span>
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;
