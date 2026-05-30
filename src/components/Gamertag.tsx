const BUNGIE_PLACEHOLDER_GAMERTAG = "\u00a6";

function normalizeGamertag(gamertag: string): string {
    return gamertag.replace(/\0/g, "").trim();
}

export function formatGamertag(gamertag: string): string {
    const normalized = normalizeGamertag(gamertag);
    if (!normalized || normalized === BUNGIE_PLACEHOLDER_GAMERTAG) {
        return "Bungie";
    }
    return normalized;
}

type GamertagProps = {
    children: string;
};

export function Gamertag({ children }: GamertagProps) {
    return <>{formatGamertag(children)}</>;
}
