import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Layers, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            FormCraft
          </h1>
        </div>
        <Link href="/modern-login">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            Sign In
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Build forms faster than ever</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Visual Form
              <br />
              <span className="text-gray-700">
                Designer
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed">
              Create professional forms with intuitive drag-and-drop interface. 
              No coding required.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/modern-signup">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Start Building
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/modern-login">
              <Button variant="outline" className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-xl">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-4xl mx-auto px-6 py-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag & Drop</h3>
            <p className="text-gray-600">Intuitive visual interface for rapid form creation</p>
          </div>
          
          <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Logic</h3>
            <p className="text-gray-600">Advanced validation and conditional workflows</p>
          </div>
          
          <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Export Ready</h3>
            <p className="text-gray-600">Clean JSON schemas for seamless integration</p>
          </div>
        </div>
      </div>
    </div>
  );
}
