import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import FormBuilder from "@/pages/form-builder";
import FormBuilderDragDrop from "@/pages/form-builder-drag-drop";
import SimpleFormBuilder from "@/pages/form-builder-simple";
import ComponentsOverview from "@/pages/components-overview";
import DFMToJSONBotStable from "@/components/ai-bot/dfm-to-json-bot-stable";
import AdminPage from "@/pages/admin";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

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
      {!isAuthenticated ? (
        <>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/" component={Landing} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/form-builder" component={SimpleFormBuilder} />
          <Route path="/form-builder/:formId" component={FormBuilderDragDrop} />
          <Route path="/form-builder-advanced" component={FormBuilderDragDrop} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/components" component={ComponentsOverview} />
          <Route path="/ai-bot" component={DFMToJSONBotStable} />
          <Route path="/admin" component={AdminPage} />
        </>
      )}
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
