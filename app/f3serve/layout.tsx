import Link from "next/link";
import { getCurrentF3HIM } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function F3ServeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const f3him = await getCurrentF3HIM();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/f3serve" className="font-semibold text-gray-900">
            f3serve
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/f3serve" className="text-sm text-gray-600 hover:text-gray-900">
              Opportunities
            </Link>
            {f3him ? (
              <>
                <Link href="/f3serve/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/f3serve/profile" className="text-sm text-gray-600 hover:text-gray-900">
                  Profile
                </Link>
                <span className="text-sm text-gray-500">{f3him.email ?? ""}</span>
              </>
            ) : (
              <Link href={`/login?next=/f3serve`} className="text-sm text-blue-600 hover:underline">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
