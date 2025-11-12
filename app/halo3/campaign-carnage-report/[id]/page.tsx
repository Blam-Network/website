import { getServerSession } from "next-auth";
import { api } from "@/src/trpc/server";
import { Box, Typography, Container, Paper } from "@mui/material";
import { authOptions } from "@/src/api/auth";
import { format } from "date-fns";
import { CampaignSkulls } from "@/src/components/CampaignSkulls";
import { CampaignPlayerBreakdown } from "@/src/components/CampaignPlayerBreakdown";

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

    // Calculate aggregate stats
    const totalKills = carnageReport.players.reduce((sum: number, player: typeof carnageReport.players[0]) => sum + player.kills_total, 0);
    const totalDeaths = carnageReport.players.reduce((sum: number, player: typeof carnageReport.players[0]) => sum + player.deaths, 0);
    const totalHeadshots = carnageReport.players.reduce((sum: number, player: typeof carnageReport.players[0]) => sum + player.headshot_kills, 0);
    const totalAssassinations = carnageReport.players.reduce((sum: number, player: typeof carnageReport.players[0]) => sum + player.assassination_kills, 0);
    const hasSkulls = carnageReport.campaign_active_primary_skulls > 0 || carnageReport.campaign_active_secondary_skulls > 0;
    
    // Get insertion point name
    const getInsertionPointName = (insertionPoint: number): string => {
        switch (insertionPoint) {
            case 0:
                return 'Mission Start';
            case 1:
                return 'Rally Point Alpha';
            case 2:
                return 'Rally Point Bravo';
            case 3:
                return 'Rally Point Charlie';
            default:
                return `Rally Point ${insertionPoint}`;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h2" sx={{ color: '#7CB342', fontWeight: 700, mb: 1, fontFamily: 'sans-serif' }}>
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
                {hasSkulls && (
                    <Box>
                        <CampaignSkulls 
                            primarySkulls={carnageReport.campaign_active_primary_skulls}
                            secondarySkulls={carnageReport.campaign_active_secondary_skulls}
                        />
                    </Box>
                )}
            </Box>

            {/* General Stats */}
            <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)', border: '1px solid #333' }}>
                <Typography variant="h5" sx={{ mb: 3, color: '#7CB342', fontWeight: 600, fontFamily: 'sans-serif' }}>
                    Game Statistics
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                    <Box>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 0.5 }}>
                            Total Score
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#7CB342', fontWeight: 700 }}>
                            {carnageReport.final_total_score.toLocaleString()}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 0.5 }}>
                            Insertion Point
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#E0E0E0', fontWeight: 700 }}>
                            {getInsertionPointName(carnageReport.campaign_insertion_point)}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 0.5 }}>
                            Total Kills
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#E0E0E0', fontWeight: 700 }}>
                            {totalKills.toLocaleString()}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 0.5 }}>
                            Total Deaths
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#E0E0E0', fontWeight: 700 }}>
                            {totalDeaths.toLocaleString()}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 0.5 }}>
                            Headshots
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#E0E0E0', fontWeight: 700 }}>
                            {totalHeadshots.toLocaleString()}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 0.5 }}>
                            Assassinations
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#E0E0E0', fontWeight: 700 }}>
                            {totalAssassinations.toLocaleString()}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Player Breakdown */}
            <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)', border: '1px solid #333' }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#7CB342', fontWeight: 600, fontFamily: 'sans-serif' }}>
                    Player Breakdown
                </Typography>
                <CampaignPlayerBreakdown 
                    players={carnageReport.players} 
                    metagameEnabled={carnageReport.campaign_metagame_enabled}
                />
            </Paper>
        </Container>
    );
}

