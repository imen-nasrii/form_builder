import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Layers, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Logo */}
      <header className="px-6 py-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">FormCraft</h1>
        </div>
        <p className="text-gray-600">Professional Form Builder Platform</p>
      </header>

      {/* Authentication Section */}
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h2>
            <p className="text-gray-600">Choose an option to continue</p>
          </div>
          
          <div className="space-y-4">
            <Link href="/modern-login">
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                Sign In to Your Account
              </Button>
            </Link>
            
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            
            <Link href="/signup">
              <Button variant="outline" className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium rounded-xl transition-all duration-200">
                Create New Account
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Start building professional forms in minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
