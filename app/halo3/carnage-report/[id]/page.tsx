import Image from "next/image";
import { getServerSession } from "next-auth";
import { api } from "@/src/trpc/server";
import { RankBadge, ServiceRecordPlaceholder } from "@/src/components/ServiceRecordPlaceholder";
import { Stack, Box, Typography, Divider, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid } from "@mui/material";
import { Screenshots } from "@/src/api/sunrise/screenshots";
import { authOptions } from "@/src/api/auth";
import { FileShare } from "@/src/api/sunrise/fileShare";
import Link from "next/link";
import { Emblem } from "@/src/components/Emblem";

export const MapImage = ({mapId, size}: {mapId: number, size: number}) => {
  // return svg from public folder
  return (
      <Box sx={{height: size, display: 'flex', justifyContent: 'center', border: '1px solid white'}}>
          <img src={`/img/maps/${mapId}.jpg`} style={{
              maxWidth: '100%',
              maxHeight: '100%',
          }} />
      </Box>
  );
}

export default async function CarnageReport({params}: {params: { id: string }}) {
  const session = await getServerSession(authOptions);
  const loggedIn = !!session?.user;

  const carnageReport = (await api.sunrise2.getCarnageReport.query({ id: params.id }));
  const players = carnageReport.players.sort((a, b) => a.place - b.place);
  const columns = ["", "Player Name", "", "Place", "Score", "Highest Skill"];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
<Grid container  alignItems="flex-start">
      {/* Map Image Section */}
      <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <MapImage mapId={carnageReport.map_id} size={210} />
      </Grid>

      {/* Details Section */}
      <Grid item xs={12} sm={8}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {carnageReport.game_variant_name} on {carnageReport.map_variant_name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Start Time:</strong> {new Date(carnageReport.start_time).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Finish Time:</strong> {new Date(carnageReport.finish_time).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Hopper Name:</strong> {carnageReport.hopper_name || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Duration:</strong> {carnageReport.duration}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
      <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell sx={{fontWeight: 'bold'}} key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((row, index) => (
            <TableRow key={index}>
              <TableCell><Emblem emblem={{
                primary: row.foreground_emblem,
                secondary: true,
                background: row.background_emblem,
                primaryColor: row.emblem_primary_color,
                secondaryColor: row.emblem_secondary_color,
                backgroundColor: row.emblem_background_color,
                armourPrimaryColor: row.primary_color,
              }} size={25} /></TableCell>
              <TableCell>{row.player_name}</TableCell>
              <TableCell><RankBadge rank={row.rank} grade={row.grade} size={25}></RankBadge></TableCell>
              <TableCell>{row.place}</TableCell>
              <TableCell>{row.score}</TableCell>
              <TableCell>{row.highest_skill}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </main>
  );
}
