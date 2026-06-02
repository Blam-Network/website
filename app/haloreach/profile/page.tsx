import { getServerSession } from "next-auth";
import { authOptions } from "@/src/api/auth";
import { redirect } from "next/navigation";

export default async function ProfileRedirect() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.gamertag) {
		redirect("/");
	}
	redirect("/haloreach/player/" + session.user.gamertag);
}
