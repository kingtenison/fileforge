import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f6f3] grid-mesh-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-heading font-extrabold text-gradient-super mb-6">404</div>
        <h1 className="text-2xl font-heading font-semibold text-gray-800 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white btn-vibrant"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
