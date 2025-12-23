import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Flex Living Reviews Dashboard</h1>
        <p className="text-lg mb-8 text-gray-600">
          Manage and display guest reviews for your properties
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
