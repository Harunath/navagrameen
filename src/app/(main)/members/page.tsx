import prisma from "@/lib/prisma";
import React from "react";

export default async function Page() {
	const members = await prisma.user.findMany({
		include: {
			personalDetail: true,
		},
	});

	return (
		<div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-br from-sky-100 via-white to-sky-100">
			<h2 className="text-3xl sm:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-orange-600 via-gray-300 to-green-600 bg-clip-text text-transparent">
				Nava Grameen Members
			</h2>

			{members.length > 0 ? (
				<div className="w-full max-w-6xl mx-auto overflow-x-auto rounded-xl shadow">
					<table className="min-w-full table-auto border border-gray-200 bg-white">
						<thead className="bg-gradient-to-r from-orange-200 via-white to-green-200 text-gray-700">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-semibold border-b">
									S. No
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold border-b">
									Name
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold border-b">
									Phone
								</th>
								<th className="px-4 py-3 text-left text-sm font-semibold border-b">
									Referral Code
								</th>
							</tr>
						</thead>
						<tbody>
							{members.map((member, index) => (
								<tr
									key={member.id}
									className="hover:bg-gray-50 transition-colors duration-200">
									<td className="px-4 py-3 text-sm text-gray-700 border-b">
										{index + 1}
									</td>

									<td
										className="px-4 py-3 text-sm text-gray-800 border-b whitespace-nowrap max-w-[180px] truncate"
										title={`${member.personalDetail.firstName} ${member.personalDetail.lastName}`}>
										{member.personalDetail.firstName}{" "}
										{member.personalDetail.lastName}
									</td>

									<td
										className="px-4 py-3 text-sm text-blue-600 border-b whitespace-nowrap max-w-[150px] truncate"
										title={member.phone}>
										{member.phone}
									</td>

									<td
										className="px-4 py-3 text-sm text-gray-800 border-b max-w-[160px] truncate"
										title={member.referralId}>
										{member.referralId}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="text-gray-600 text-lg">No members currently</div>
			)}
		</div>
	);
}
