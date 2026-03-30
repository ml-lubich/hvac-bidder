import Link from "next/link";
import { Wrench, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-8 h-8 text-orange-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Page Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Looks like this page took a wrong turn. Let&apos;s get you back on
          track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
