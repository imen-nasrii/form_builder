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
          
          <div className="flex justify-center">
            <Link href="/modern-signup">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Start Building
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
