import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import SignUp from "@/pages/signup";
import SignIn from "@/pages/signin";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import VerifyEmailPage from "@/pages/verify-email-page";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import UserDashboard from "@/pages/user-dashboard";
import FormBuilderExact from "@/pages/form-builder-exact";
import FormBuilderFixed from "@/pages/form-builder-fixed";
import ComponentsOverview from "@/pages/components-overview";
import DFMToJSONBotStable from "@/components/ai-bot/dfm-to-json-bot-stable";
import AdminPage from "@/pages/admin";
import AdminPanel from "@/pages/admin-panel-en";
import Setup2FA from "@/pages/setup-2fa";
import VerifyEmail from "@/pages/verify-email";
import ApiIntegration from "@/pages/api-integration";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log('Auth state:', { isAuthenticated, isLoading, user });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-primary rounded"></div>
          </div>
          <p className="text-slate-600">Loading FormBuilder Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/signin" component={SignIn} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/verify-email/:token" component={VerifyEmailPage} />
      <Route path="/verify-email" component={VerifyEmail} />
      
      {/* Role-based authenticated routes */}
      {isAuthenticated && user?.emailVerified && (
        <>
          {/* Admin routes */}
          {user?.role === 'admin' && (
            <>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin-panel" component={AdminPanel} />
              <Route path="/statistics" component={Statistics} />
            </>
          )}
          
          {/* User routes */}
          {user?.role === 'user' && (
            <>
              <Route path="/program-builder" component={FormBuilderFixed} />
              <Route path="/program-builder/:formId" component={FormBuilderFixed} />
              <Route path="/dashboard" component={UserDashboard} />
            </>
          )}
          
          {/* Common authenticated routes */}
          <Route path="/data-models" component={DataModels} />
          <Route path="/ai-bot" component={DFMToJSONBotStable} />
          <Route path="/setup-2fa" component={Setup2FA} />
        </>
      )}
      
      {/* Root route with role-based redirection */}
      <Route path="/" component={() => {
        if (!isAuthenticated || !user?.emailVerified) {
          return <SignUp />;
        }
        return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
      }} />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
