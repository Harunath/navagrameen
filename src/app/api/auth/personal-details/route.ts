import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { firstName, lastName, aadhar, phone, email } = body;
		console.log("firstName, lastName", firstName, lastName);

		if (!firstName || !lastName || !phone) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Check if phone already exists
		const existing = await prisma.personalDetail.findUnique({
			where: { phone },
		});

		if (existing) {
			return NextResponse.json(
				{ error: "Phone number already exists" },
				{ status: 409 }
			);
		}

		const detail = await prisma.personalDetail.create({
			data: {
				firstName,
				lastName,
				phone,
				aadhar,
				email,
			},
		});

		return NextResponse.json(
			{ message: "Created successfully", data: detail },
			{ status: 201 }
		);
	} catch (err) {
		console.error("Error creating personal detail:", err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
