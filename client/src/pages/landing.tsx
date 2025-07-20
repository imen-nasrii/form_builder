import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Layers, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Navigation */}
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">FormCraft</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/modern-login">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}
