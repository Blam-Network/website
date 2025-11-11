import { getServerSession } from "next-auth";
import { api } from "@/src/trpc/server";
import { Stack, Box, Typography, Container, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { authOptions } from "@/src/api/auth";
import Link from "next/link";
import { Emblem } from "@/src/components/Emblem";
import { format } from "date-fns";
import { getColor, getColorName } from "@/src/colors";
import { CampaignSkulls } from "@/src/components/CampaignSkulls";

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

const getDifficultyName = (difficulty: number): string => {
    switch (difficulty) {
        case 0: return "Easy";
        case 1: return "Normal";
        case 2: return "Heroic";
        case 3: return "Legendary";
        default: return "Unknown";
    }
};

export default async function CampaignCarnageReportPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const loggedIn = !!session?.user;

    const carnageReport = await api.sunrise2.getCampaignCarnageReport.query({ id: params.id });

    const winner = carnageReport.players[0]; // Players are sorted by score

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h2" sx={{ color: '#7CB342', fontWeight: 700, mb: 1, fontFamily: '"Conduit ITC", sans-serif' }}>
                    {getMissionName(carnageReport.map_id)} on {getDifficultyName(carnageReport.campaign_difficulty)}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
                        {format(new Date(carnageReport.finish_time), "MMM d, yyyy 'at' h:mm a")}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9CCC65', mt: 1 }}>
                        Duration: {(() => {
                            const durationMs = new Date(carnageReport.finish_time).getTime() - new Date(carnageReport.start_time).getTime();
                            const minutes = Math.floor(durationMs / 60000);
                            const seconds = Math.floor((durationMs % 60000) / 1000);
                            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                        })()}
                    </Typography>
                </Box>
                {(carnageReport.campaign_active_primary_skulls > 0 || carnageReport.campaign_active_secondary_skulls > 0) && (
                    <Box>
                        <CampaignSkulls 
                            primarySkulls={carnageReport.campaign_active_primary_skulls}
                            secondarySkulls={carnageReport.campaign_active_secondary_skulls}
                        />
                    </Box>
                )}
            </Box>

            {/* Player Breakdown */}
            <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)', border: '1px solid #333' }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#7CB342', fontWeight: 600, fontFamily: '"Conduit ITC", sans-serif' }}>
                    Player Breakdown
                </Typography>
                {!carnageReport.campaign_metagame_enabled && (
                    <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 2, fontStyle: 'italic' }}>
                        Statistics are not available for campaign when scoring is not enabled.
                    </Typography>
                )}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342' }}>Player</TableCell>
                                {carnageReport.campaign_metagame_enabled && (
                                    <>
                                        <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342' }}>Score</TableCell>
                                        <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342' }}>Kills</TableCell>
                                        <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342' }}>Deaths</TableCell>
                                        <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342' }}>Assists</TableCell>
                                        <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342' }}>Headshots</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {carnageReport.players.map((player: typeof carnageReport.players[0]) => {
                                const primaryColor = getColor(getColorName(player.primary_color));
                                return (
                                    <TableRow
                                        key={player.player_xuid}
                                        sx={{
                                            backgroundColor: `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.4)`,
                                            '&:hover': {
                                                backgroundColor: `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.6)`,
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Emblem
                                                    size={40}
                                                    emblem={{
                                                        primary: player.foreground_emblem,
                                                        secondary: player.emblem_flags === 0,
                                                        background: player.background_emblem,
                                                        primaryColor: player.emblem_primary_color,
                                                        secondaryColor: player.emblem_secondary_color,
                                                        backgroundColor: player.emblem_background_color,
                                                        armourPrimaryColor: player.primary_color,
                                                    }}
                                                />
                                                <Box>
                                                    <Link href={`/player/${encodeURIComponent(player.player_name)}`} style={{ textDecoration: 'none' }}>
                                                        <Typography sx={{ color: '#E0E0E0', fontWeight: 600, textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                                                            {player.player_name}
                                                        </Typography>
                                                    </Link>
                                                    {player.service_tag && (
                                                        <Typography variant="caption" sx={{ color: '#B0B0B0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                                                            {player.service_tag}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        {carnageReport.campaign_metagame_enabled && (
                                            <>
                                                <TableCell align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                                                    {player.player_final_score.toLocaleString()}
                                                </TableCell>
                                                <TableCell align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                                                    {player.kills_total}
                                                </TableCell>
                                                <TableCell align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                                                    {player.deaths}
                                                </TableCell>
                                                <TableCell align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                                                    {player.assists}
                                                </TableCell>
                                                <TableCell align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                                                    {player.headshot_kills}
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
}

