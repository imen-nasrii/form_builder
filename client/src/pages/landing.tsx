import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">FormBuilder Pro</h1>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
            Sign In
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-8 py-32 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 max-w-4xl">
          Enterprise Form Designer
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
          Build sophisticated forms with drag-and-drop simplicity. Advanced validation, 
          conditional logic, and JSON schema generation for enterprise applications.
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-md">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg rounded-md">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Simple Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">
            Everything you need to build enterprise forms
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Drag & Drop Builder</h3>
              <p className="text-gray-600">Intuitive visual form designer with real-time preview</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Validation</h3>
              <p className="text-gray-600">Advanced validation with conditional logic</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">JSON Export</h3>
              <p className="text-gray-600">Clean schema generation for modern frameworks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="bg-white py-16 text-center border-t border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Start building professional forms today
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Join developers who trust FormBuilder Pro for enterprise applications
        </p>
        <Link href="/register">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-md">
            Get Started Free
          </Button>
        </Link>
      </div>
    </div>
  );
}
