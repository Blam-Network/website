import { NextResponse, type NextRequest } from "next/server";
import { halo3Axios } from "@/src/api/halo3/halo3Axios";

const handler = async (req: NextRequest, {params}: {params: { id: string }}) => {
	const screenshot = await halo3Axios.get(`/halo3/screenshots/` + params.id + `/view`, {
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