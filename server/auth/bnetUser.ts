import { halo3Axios } from "@/src/api/halo3/halo3Axios";
import { xuidToHex } from "@/src/utils/xuid";

export type BnetUserFlags = {
    datamine_access: boolean;
    is_admin: boolean;
};

export async function fetchBnetUserFlags(
    xuid: string,
    userHash: string,
    xstsToken: string,
): Promise<BnetUserFlags> {
    const response = await halo3Axios.get("/user", {
        headers: {
            "x-xuid": xuidToHex(xuid),
            "x-uhs": userHash,
            Authorization: xstsToken,
        },
    });

    if (response.status !== 200) {
        console.warn(`[auth] GET /user failed: ${response.status}`, response.data);
        return { datamine_access: false, is_admin: false };
    }

    let data: { datamine_access?: boolean; is_admin?: boolean } = response.data;
    if (typeof data === "string") {
        data = JSON.parse(data);
    }

    return {
        datamine_access: data.datamine_access === true,
        is_admin: data.is_admin === true,
    };
}
