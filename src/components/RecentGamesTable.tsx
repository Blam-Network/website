import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { PreviousGame } from "@/src/api/sunrise/previousGames";
import { RecentGame } from "@/src/api/sunrise/recentGames";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";

const getMissionName = (mapId: number): string => {
    switch (mapId) {
        case 3005:
            return 'Arrival';
        case 3010:
            return 'Sierra 117';
        case 3020:
            return 'Crow\'s Nest';
        case 3030:
            return 'Tsavo Highway';
        case 3040:
            return 'The Storm';
        case 3050:
            return 'Floodgate';
        case 3070:
            return 'The Ark';
        case 3100:
            return 'The Covenant';
        case 3110:
            return 'Cortana';
        case 3120:
            return 'Halo';
        case 3130:
            return 'Epilogue';
        default:
            return 'Unknown Mission';
    }
};

const getDifficultyName = (difficulty: number | undefined): string => {
    if (difficulty === undefined) return "Unknown";
    switch (difficulty) {
        case 0: return "Easy";
        case 1: return "Normal";
        case 2: return "Heroic";
        case 3: return "Legendary";
        default: return "Unknown";
    }
};

// Flexible game type that accepts dates as either Date objects or strings
type FlexibleGame = Omit<PreviousGame | RecentGame, 'start_time' | 'finish_time'> & {
    start_time: Date | string;
    finish_time: Date | string;
};

interface RecentGamesTableProps {
    games: FlexibleGame[];
    stickyHeader?: boolean;
}

export function RecentGamesTable({ games, stickyHeader = false }: RecentGamesTableProps) {
    return (
        <TableContainer component={Paper} sx={{ background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)', border: '1px solid #333', overflow: 'hidden', flex: stickyHeader ? 1 : undefined }}>
            <Table size="small" stickyHeader={stickyHeader} sx={{ '& .MuiTableCell-root': { py: 0.75, px: 1.5 } }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', backgroundColor: stickyHeader ? '#1A1A1A' : undefined, py: 1, fontSize: '0.875rem' }}>Game</TableCell>
                        <TableCell sx={{ color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', backgroundColor: stickyHeader ? '#1A1A1A' : undefined, py: 1, fontSize: '0.875rem' }}>Type</TableCell>
                        <TableCell sx={{ color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', backgroundColor: stickyHeader ? '#1A1A1A' : undefined, py: 1, fontSize: '0.875rem' }}>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {games.map((game) => {
                        const isCampaign = 'type' in game && game.type === 'campaign';
                        const gameId = game.id;
                        const reportUrl = isCampaign ? `/halo3/campaign-carnage-report/${gameId}` : `/halo3/carnage-report/${gameId}`;
                        const gameVariantName = 'game_variant_name' in game ? game.game_variant_name : null;
                        const mapVariantName = 'map_variant_name' in game ? game.map_variant_name : null;
                        const hopperName = 'hopper_name' in game ? game.hopper_name : null;
                        const campaignDifficulty = 'campaign_difficulty' in game ? game.campaign_difficulty : undefined;
                        
                        // Determine game type
                        let gameType: string;
                        if (isCampaign) {
                            gameType = 'Campaign';
                        } else if (hopperName) {
                            gameType = 'Matchmaking';
                        } else {
                            // Check if it's a Forge map (Forge canvas maps have specific IDs)
                            // Forge canvas maps: 700 (Foundry), 701 (Sandbox)
                            const isForgeMap = game.map_id === 700 || game.map_id === 701;
                            gameType = isForgeMap ? 'Forge' : 'Custom Games';
                        }


                        return (
                            <TableRow
                                key={game.id}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(124, 179, 66, 0.1)',
                                    },
                                }}
                            >
                                <TableCell sx={{ color: '#E0E0E0' }}>
                                    <Link href={reportUrl} style={{ textDecoration: 'underline', color: '#4A90E2' }}>
                                        {isCampaign ? (
                                            <Typography variant='body2' sx={{ display: 'inline', fontWeight: 600, color: 'inherit', fontSize: '0.8125rem', lineHeight: 1.4 }}>
                                                {getMissionName(game.map_id)} on {getDifficultyName(campaignDifficulty)}
                                            </Typography>
                                        ) : (
                                            <Typography variant='body2' sx={{ display: 'inline', fontWeight: 600, color: 'inherit', fontSize: '0.8125rem', lineHeight: 1.4 }}>
                                                {gameVariantName ?? 'Gametype'} on {mapVariantName ?? 'Unknown Map'}
                                            </Typography>
                                        )}
                                    </Link>
                                </TableCell>
                                <TableCell sx={{ color: '#B0B0B0' }}>
                                    <Typography variant='body2' sx={{ color: 'inherit', fontSize: '0.8125rem', lineHeight: 1.4 }}>
                                        {gameType}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ color: '#B0B0B0', fontSize: '0.8125rem' }}>
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

