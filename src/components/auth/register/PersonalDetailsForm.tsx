"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const personalDetailSchema = z.object({
	firstName: z.string().min(1, "Required"),
	lastName: z.string().min(1, "Required"),
	phone: z.string().length(10, "Enter valid phone"),
	aadhar: z.string().optional(),
	email: z.string().email("Invalid email").optional().or(z.literal("")),
});

const PhoneSchema = z.string().length(10, "Enter valid phone");

type FormData = z.infer<typeof personalDetailSchema>;

export default function PersonalDetailForm() {
	const [form, setForm] = useState<FormData>({
		firstName: "",
		lastName: "",
		phone: "",
		aadhar: "",
		email: "",
	});
	const router = useRouter();
	const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
		{}
	);
	const [enterNumber, setEnterNumber] = useState(false);
	const [phone, setPhone] = useState("");
	const [phoneError, setPhoneError] = useState("");

	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = personalDetailSchema.safeParse(form);
		if (!result.success) {
			console.log(result.error);
			const fieldErrors: Partial<Record<keyof FormData, string>> = {};
			result.error.errors.forEach((err) => {
				fieldErrors[err.path[0] as keyof FormData] = err.message;
			});
			setErrors(fieldErrors);
			return;
		}

		setErrors({}); // clear previous errors if validation passed

		setLoading(true);

		try {
			const res = await fetch("/api/auth/personal-details", {
				method: "POST",
				body: JSON.stringify(form),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) throw new Error("Something went wrong");
			const data = await res.json();
			toast.success("Personal details saved!");
			router.push(`/auth/${data.data.phone}/register`);
		} catch {
			toast.error("Submission failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-screen bg-gradient-to-br from-sky-100 via-white to-sky-100 flex flex-col">
			{/* Top Nav / Header */}

			{/* Main Content Area - Centered */}
			<div className="flex-1 flex items-center justify-center">
				<motion.form
					onSubmit={handleSubmit}
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl space-y-6">
					<h2 className="text-2xl md:text-3xl font-bold text-sky-700 text-center">
						Enter Personal Details
					</h2>

					{!enterNumber && (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										First Name
									</label>
									<input
										type="text"
										name="firstName"
										value={form.firstName}
										onChange={handleChange}
										className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
										required
									/>
									{errors.firstName && (
										<p className="mt-1 text-sm text-red-600">
											{errors.firstName}
										</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										Last Name
									</label>
									<input
										type="text"
										name="lastName"
										value={form.lastName}
										onChange={handleChange}
										className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
										required
									/>
									{errors.lastName && (
										<p className="mt-1 text-sm text-red-600">
											{errors.lastName}
										</p>
									)}
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Phone
									</label>
									<input
										type="tel"
										name="phone"
										value={form.phone}
										onChange={handleChange}
										className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
										required
									/>
									{errors.phone && (
										<p className="mt-1 text-sm text-red-600">{errors.phone}</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">
										Aadhar (optional)
									</label>
									<input
										type="text"
										name="aadhar"
										value={form.aadhar}
										onChange={handleChange}
										className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Email (optional)
								</label>
								<input
									type="email"
									name="email"
									value={form.email}
									onChange={handleChange}
									className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
								/>
							</div>
							<button
								type="submit"
								disabled={loading}
								className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition cursor-pointer">
								{loading ? "Submitting..." : "Continue"}
							</button>
							<p className="text-sm text-blue-400 mt-1">
								{" "}
								Already given the Details?{" "}
								<button
									className="text-red-400 cursor-pointer"
									onClick={() => setEnterNumber(true)}>
									Click here
								</button>
							</p>
						</>
					)}
					<div>
						{enterNumber && (
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Phone
								</label>
								<input
									type="tel"
									name="phone"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 mb-5"
									required
								/>
								{phoneError && (
									<p className="mt-1 text-sm text-red-600">{phoneError}</p>
								)}

								<button
									disabled={loading}
									onClick={() => {
										const result = PhoneSchema.safeParse(phone);
										if (!result.success) {
											setPhoneError(result.error.message);
											return;
										}
										setPhoneError("");
										router.push(`/auth/${phone}/register`);
									}}
									className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition cursor-pointer">
									{loading ? "Submitting..." : "Continue"}
								</button>
								<p className="text-sm text-blue-400 mt-1">
									{" "}
									Need to give the details?{" "}
									<button
										className="text-red-400 cursor-pointer"
										onClick={() => setEnterNumber(false)}>
										Click here
									</button>
								</p>
							</div>
						)}
					</div>
				</motion.form>
			</div>
		</div>
	);
}
