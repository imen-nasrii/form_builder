import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]"></div>
        <div className="relative">
          {/* Navigation */}
          <nav className="flex items-center justify-between p-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-cube text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">FormBuilder Pro</h1>
            </div>
            <Link href="/login">
              <Button className="enterprise-gradient">
                Se connecter
              </Button>
            </Link>
          </nav>

          {/* Hero Content */}
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                Enterprise Form Designer
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Build sophisticated forms with drag-and-drop simplicity. Advanced validation, 
                conditional logic, and JSON schema generation for enterprise applications.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/register">
                  <Button className="enterprise-gradient text-lg px-8 py-3">
                    Commencer
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="text-lg px-8 py-3">
                    Se connecter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to build enterprise forms
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Professional-grade form builder with advanced features for modern applications.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <i className="fas fa-mouse-pointer text-blue-600 text-xl"></i>
                    </div>
                    <CardTitle>Drag & Drop Builder</CardTitle>
                    <CardDescription>
                      Intuitive visual form designer with component palette and real-time preview.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="flex flex-col">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <i className="fas fa-shield-alt text-green-600 text-xl"></i>
                    </div>
                    <CardTitle>Advanced Security</CardTitle>
                    <CardDescription>
                      Role-based access control with two-factor authentication for admin accounts.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="flex flex-col">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <i className="fas fa-code text-purple-600 text-xl"></i>
                    </div>
                    <CardTitle>JSON Schema Export</CardTitle>
                    <CardDescription>
                      Generate clean, structured JSON compatible with modern frameworks like Blazor.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="flex flex-col">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                      <i className="fas fa-check-circle text-amber-600 text-xl"></i>
                    </div>
                    <CardTitle>Smart Validation</CardTitle>
                    <CardDescription>
                      Comprehensive validation engine with 15+ operators and conditional logic.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="flex flex-col">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                      <i className="fas fa-puzzle-piece text-indigo-600 text-xl"></i>
                    </div>
                    <CardTitle>Rich Components</CardTitle>
                    <CardDescription>
                      Grid lookups, date pickers, radio groups, and complex field types.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="flex flex-col">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                      <i className="fas fa-rocket text-red-600 text-xl"></i>
                    </div>
                    <CardTitle>Enterprise Ready</CardTitle>
                    <CardDescription>
                      Built for scalability with database persistence and audit logging.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start building professional forms today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Join thousands of developers who trust FormBuilder Pro for their enterprise applications.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-3">
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
