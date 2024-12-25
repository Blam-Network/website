import Image from "next/image";
import { getServerSession } from "next-auth";
import { api } from "@/src/trpc/server";
import { RankBadge, ServiceRecordPlaceholder } from "@/src/components/ServiceRecordPlaceholder";
import { Stack, Box, Typography, Divider, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid } from "@mui/material";
import { Screenshots } from "@/src/api/sunrise/screenshots";
import { authOptions } from "@/src/api/auth";
import { FileShare } from "@/src/api/sunrise/fileShare";
import Link from "next/link";

export default async function CarnageReport({params}: {params: { id: string }}) {
  const session = await getServerSession(authOptions);
  const loggedIn = !!session?.user;

  const carnageReport = (await api.sunrise2.getCarnageReport.query({ id: params.id }));
  const players = carnageReport.players.sort((a, b) => a.place - b.place);
  const columns = ["Player Name", "Place", "Score", "Highest Skill", "Rank"];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
            <strong>Map ID:</strong> {carnageReport.map_id || 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Hopper Name:</strong> {carnageReport.hopper_name || 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Game Engine:</strong> {carnageReport.game_engine}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>File Type:</strong> {carnageReport.file_type}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            <strong>Duration:</strong> {carnageReport.duration}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
      <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.player_name}</TableCell>
              <TableCell>{row.place}</TableCell>
              <TableCell>{row.score}</TableCell>
              <TableCell>{row.highest_skill}</TableCell>
              <TableCell><RankBadge rank={row.rank} grade={row.grade} size={20}></RankBadge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </main>
  );
}
