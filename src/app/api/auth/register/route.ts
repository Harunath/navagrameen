import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { customAlphabet } from "nanoid";

const generateReferralId = customAlphabet(
	"1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	8
);

export async function POST(req: Request) {
	const { personalDetailId } = await req.json();

	if (!personalDetailId) {
		return NextResponse.json(
			{ error: "Missing personalDetailId" },
			{ status: 400 }
		);
	}

	const detail = await prisma.personalDetail.findUnique({
		where: { id: personalDetailId },
	});
	if (!detail) {
		return NextResponse.json(
			{ error: "Personal detail not found" },
			{ status: 404 }
		);
	}

	const existingUser = await prisma.user.findUnique({
		where: { personalDetailId: detail.id },
	});

	if (existingUser) {
		return NextResponse.json({ error: "Already a member" }, { status: 409 });
	}

	const referralId = generateReferralId();
	const user = await prisma.user.create({
		data: {
			phone: detail.phone,
			password: "dummy-password", // or generate later
			referralId,
			personalDetail: {
				connect: { id: detail.id },
			},
		},
	});

	return NextResponse.json({ message: "User created", user });
}
