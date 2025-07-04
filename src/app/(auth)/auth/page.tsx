import { redirect } from "next/navigation";

export default function AuthPage() {
	redirect("/auth/register");
	// This component will not be rendered because of the redirect
}
