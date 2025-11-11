import { NextResponse, type NextRequest } from "next/server";
import { sunrise2Axios } from "@/src/api/sunrise/sunrise2Router";

const handler = async (req: NextRequest, {params}: {params: { id: string }}) => {
	const screenshot = await sunrise2Axios.get(`/halo3/screenshots/` + params.id + `/view`, {
		responseType: 'arraybuffer',
	});

	const response = new NextResponse(Buffer.from(screenshot.data), {
		headers: {
			'content-type': 'image/jpeg',
			'cache-control': 'public, max-age=31536000, immutable',
		},
	});

	return response;
}
  


export { handler as GET, handler as POST };