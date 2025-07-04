"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/common/LoadingAnimation";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface PersonalDetail {
	id: string;
	firstName: string;
	lastName: string;
	aadhar?: string;
	phone: string;
	email?: string;
}

export default function PersonalDetailCard() {
	const pathname = usePathname(); // e.g. /auth/abc123/register

	// extract the id between /auth/ and /register
	const userId = useMemo(() => {
		const parts = pathname.split("/");
		const idIndex = parts.indexOf("auth") + 1;
		return parts[idIndex] || "";
	}, [pathname]);
	console.log("userId ", userId);
	const [detail, setDetail] = useState<PersonalDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchDetail = async () => {
			try {
				const res = await fetch(`/api/auth/personal-details/${userId}`);
				if (!res.ok) throw new Error("Failed to fetch");
				const data = await res.json();
				console.log(data);
				setDetail(data.data);
			} catch {
				toast.error("Could not load details");
			} finally {
				setLoading(false);
			}
		};

		fetchDetail();
	}, [userId]);

	const handleBecomeMember = async () => {
		try {
			setSubmitting(true);
			const res = await fetch("/api/auth/register", {
				method: "POST",
				body: JSON.stringify({ personalDetailId: detail?.id }),
				headers: { "Content-Type": "application/json" },
			});
			if (!res.ok) throw new Error("Failed");
			toast.success("You became Member of NAVA GRAMEEN successfully!");
			router.push("/");
		} catch {
			toast.error("Failed to create member");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) return <LoadingAnimation />;
	if (!detail)
		return <p className="text-center text-red-500">No data found.</p>;

	return (
		<div className="max-w-xl mx-auto mt-10 mb-16">
			<div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-orange-200 via-white to-green-200 bg-opacity-50 backdrop-blur-md border border-orange-300">
				<h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
					Personal Details
				</h2>

				<div className="grid gap-4 text-gray-700  text-xl font-medium">
					<div className="flex justify-between items-center">
						<div className="font-medium w-1/2 flex justify-between items-center">
							<span>Name</span>
							<span>: {"  "}</span>
						</div>
						<span className="flex-1">
							{detail.firstName} {detail.lastName}
						</span>
					</div>

					<div className="flex justify-between items-center">
						<div className="font-medium w-1/2 flex justify-between items-center">
							<span>Phone</span>
							<span>:{"  "} </span>
						</div>
						<span className="flex-1">{detail.phone}</span>
					</div>

					{detail.email && (
						<div className="flex justify-between items-center">
							<div className="font-medium w-1/2 flex justify-between items-center">
								<span>Email</span>
								<span>: {"  "}</span>
							</div>
							<span className="flex-1">{detail.email}</span>
						</div>
					)}

					{detail.aadhar && (
						<div className="flex justify-between items-center">
							<div className="font-medium w-1/2 flex justify-between items-center">
								<span>Aadhar</span>
								<span>: {"  "}</span>
							</div>
							<span className="flex-1">{detail.aadhar}</span>
						</div>
					)}
				</div>

				<button
					onClick={handleBecomeMember}
					disabled={submitting}
					className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition">
					{submitting ? "Processing..." : "Become a Member"}
				</button>
			</div>
		</div>
	);
}
