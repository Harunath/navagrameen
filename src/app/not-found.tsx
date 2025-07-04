import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 via-white to-green-100 text-gray-800 px-4">
			<h1 className="text-6xl font-bold mb-4">404</h1>
			<h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
			<p className="text-center max-w-md text-gray-600 mb-6">
				The page you are looking for doesn’t exist or might still be under
				development. Please check the URL or go back to the home page.
			</p>
			<Link
				href="/"
				className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition">
				Back to Home
			</Link>
		</div>
	);
}
