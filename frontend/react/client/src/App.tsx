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
import ModernLogin from "@/pages/modern-login";
import ModernSignup from "@/pages/modern-signup";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import FormBuilderExact from "@/pages/form-builder-exact";
import FormBuilderFixed from "@/pages/form-builder-fixed";
import MFactFormBuilder from "@/pages/mfact-form-builder";
import AdvancedGridPage from "@/pages/advanced-grid-page";
import UltraGridPage from "@/pages/ultra-grid-page";
import ComponentsOverview from "@/pages/components-overview";
import DFMToJSONBotStable from "@/components/ai-bot/dfm-to-json-bot-stable";
import AdminPage from "@/pages/admin";
import AdminPanel from "@/pages/admin-panel-en";
import Analytics from "@/pages/analytics";
import Setup2FA from "@/pages/setup-2fa";
import VerifyEmail from "@/pages/verify-email";
import ApiIntegration from "@/pages/api-integration";
import AdminManagement from "@/pages/admin-management";
import UserTaskBoard from "@/pages/user-task-board";
import AIAssistant from "@/pages/ai-assistant-simple";
import AdvancedAIAssistant from "@/pages/ai-assistant-advanced";
import AIChat from "@/pages/ai-chat";
import UserAIAssistant from "@/pages/user-ai-assistant";
import Profile from "@/pages/profile";

import JSONValidator from "@/pages/json-validator";
import Navigation from "@/components/navigation";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('Auth state:', { isAuthenticated, isLoading });

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
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navigation />}
      <div className={isAuthenticated ? "pt-16" : ""}>
        <Switch>
          {/* Public routes */}
          <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/signin" component={SignIn} />
      <Route path="/modern-login" component={ModernLogin} />
      <Route path="/modern-signup" component={ModernSignup} />
      <Route path="/verify-email" component={VerifyEmail} />
      
      {/* Authenticated routes */}
      <Route path="/form-builder" component={FormBuilderFixed} />
      <Route path="/form-builder/:formId" component={FormBuilderFixed} />
      <Route path="/mfact-builder" component={MFactFormBuilder} />
      <Route path="/mfact-builder/:formId" component={MFactFormBuilder} />
      <Route path="/advanced-grid" component={AdvancedGridPage} />
      <Route path="/ultra-grid" component={UltraGridPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/components" component={ComponentsOverview} />
      <Route path="/ai-bot" component={DFMToJSONBotStable} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin-panel" component={AdminPanel} />
      <Route path="/admin-management" component={AdminManagement} />
      <Route path="/task-board" component={UserTaskBoard} />
      <Route path="/ai-assistant" component={AIChat} />
      <Route path="/user-ai" component={UserAIAssistant} />

      <Route path="/json-validator" component={JSONValidator} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/profile" component={Profile} />
      <Route path="/api-integration" component={ApiIntegration} />
      <Route path="/setup-2fa" component={Setup2FA} />
      
      {/* Root route */}
      <Route path="/" component={isAuthenticated ? Dashboard : SignIn} />
      
      {/* 404 fallback */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
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
