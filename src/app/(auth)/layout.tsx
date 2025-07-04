import Footer from "@/components/common/Footer";
import Image from "next/image";
import Link from "next/link";
import logo from "@/../public/logo.png";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className=" min-h-screen  bg-gradient-to-br from-sky-100 via-white to-sky-100">
			<div className="w-full px-4 h-24 flex items-center justify-between shadow-2xs border-b border-sky-100">
				<Link
					href="/"
					className="text-lg md:text-2xl font-bold text-orange-500 hover:text-orange-600 transition">
					<Image
						src={logo}
						className="h-30 w-auto saturate-200"
						height={100}
						width={100}
						alt="NAVA GRAMEEN"
					/>
				</Link>
			</div>
			{children}
			<Footer />
		</div>
	);
}
