import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
            Sign In
          </Button>
        </Link>
      </nav>

      {/* Simple Hero Section */}
      <div className="flex flex-col items-center justify-center px-8 py-32 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Form Builder
        </h1>
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
    </div>
  );
}
