import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import {
  getHalo3DifficultyName,
  getHalo3MissionName,
} from "@/src/utils/halo3CampaignDisplay";

/** Row shape for recent/previous games (Halo 3 or Ares); avoids coupling this UI to a specific API package. */
export type RecentGamesTableRow = {
  id: string;
  map_id: number;
  start_time: Date | string;
  finish_time: Date | string;
  type?: "multiplayer" | "campaign";
  game_variant_name?: string | null;
  map_variant_name?: string | null;
  hopper_name?: string | null;
  campaign_difficulty?: number;
};

interface RecentGamesTableProps {
    games: RecentGamesTableRow[];
    stickyHeader?: boolean;
    routeBase?: "/halo3" | "/ares";
}

export function RecentGamesTable({ games, stickyHeader = false, routeBase = "/halo3" }: RecentGamesTableProps) {
    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                flex: stickyHeader ? 1 : undefined,
                minHeight: stickyHeader ? 0 : undefined,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
        >
            <Table size="small" stickyHeader={stickyHeader} sx={{ '& .MuiTableCell-root': { py: 0.75, px: 1.5 } }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ backgroundColor: stickyHeader ? 'background.paper' : undefined, color: 'primary.main', fontWeight: 700, borderColor: 'divider' }}>Game</TableCell>
                        <TableCell sx={{ backgroundColor: stickyHeader ? 'background.paper' : undefined, color: 'primary.main', fontWeight: 700, borderColor: 'divider' }}>Type</TableCell>
                        <TableCell sx={{ backgroundColor: stickyHeader ? 'background.paper' : undefined, color: 'primary.main', fontWeight: 700, borderColor: 'divider' }}>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {games.map((game) => {
                        const isCampaign = 'type' in game && game.type === 'campaign';
                        const gameId = game.id;
                        const reportUrl = isCampaign ? `${routeBase}/campaign-carnage-report/${gameId}` : `${routeBase}/carnage-report/${gameId}`;
                        const gameVariantName = 'game_variant_name' in game ? game.game_variant_name : null;
                        const mapVariantName = 'map_variant_name' in game ? game.map_variant_name : null;
                        const hopperName = 'hopper_name' in game ? game.hopper_name : null;
                        const campaignDifficulty = 'campaign_difficulty' in game ? game.campaign_difficulty : undefined;
                        
                        let gameType: string;
                        if (isCampaign) {
                            gameType = 'Campaign';
                        } else if (hopperName) {
                            gameType = 'Matchmaking';
                        } else {
                            const isForgeMap = game.map_id === 700 || game.map_id === 701;
                            gameType = isForgeMap ? 'Forge' : 'Custom Games';
                        }

                        return (
                            <TableRow key={game.id}>
                                <TableCell>
                                    <MuiLink
                                        component={Link}
                                        href={reportUrl}
                                        underline="hover"
                                        sx={{ fontWeight: 600, fontSize: '0.8125rem' }}
                                    >
                                        {isCampaign ? (
                                            `${getHalo3MissionName(game.map_id)} on ${getHalo3DifficultyName(campaignDifficulty)}`
                                        ) : (
                                            `${gameVariantName ?? 'Gametype'} on ${mapVariantName ?? 'Unknown Map'}`
                                        )}
                                    </MuiLink>
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary' }}>
                                    <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                                        {gameType}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                                    <DateTimeDisplay date={game.finish_time} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
