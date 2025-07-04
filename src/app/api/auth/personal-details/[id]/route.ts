import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	_req: NextRequest,
	params: { params: Promise<{ id: string }> }
) => {
	try {
		const { id } = await params.params;
		console.log(id, "api");
		const user = await prisma.personalDetail.findUnique({
			where: { phone: id },
		});
		if (!user) {
			// handle user not found
			return NextResponse.json({ error: "Details not found" }, { status: 404 });
		}
		console.log(user);
		return NextResponse.json({ data: user });
	} catch {
		return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
	}
};
