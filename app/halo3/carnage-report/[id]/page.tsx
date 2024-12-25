import Image from "next/image";
import { getServerSession } from "next-auth";
import { api } from "@/src/trpc/server";
import { RankBadge, ServiceRecordPlaceholder } from "@/src/components/ServiceRecordPlaceholder";
import { Stack, Box, Typography, Divider, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Screenshots } from "@/src/api/sunrise/screenshots";
import { authOptions } from "@/src/api/auth";
import { FileShare } from "@/src/api/sunrise/fileShare";
import Link from "next/link";
import { Emblem } from "@/src/components/Emblem";
import React from "react";

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

const get_kill_type_name = (kill_type: number) => {
  switch (kill_type) {
    case 0:
      return "Unknown";
    case 1:
      return "Headshot";
    case 11:
      return "Battle Rifle";
    default:
      return "Unknown";
  }
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
        <colgroup>
          <col style={{ width: '1px', paddingLeft: 0 }} /> {/* First column thinner */}
          <col /> {/* Other columns take the remaining space */}
          <col />
          <col />
          <col />
          <col />
        </colgroup>
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
              <TableCell sx={{paddingLeft: 1, paddingRight: 1}}>
                <Emblem 
                  emblem={{
                    primary: row.foreground_emblem,
                    secondary: true,
                    background: row.background_emblem,
                    primaryColor: row.emblem_primary_color,
                    secondaryColor: row.emblem_secondary_color,
                    backgroundColor: row.emblem_background_color,
                    armourPrimaryColor: row.primary_color,
                  }} 
                  size={25} 
                />
              </TableCell>
              <TableCell sx={{paddingLeft: 0}}>{row.player_name}</TableCell>
              <TableCell><RankBadge rank={row.rank} grade={row.grade} size={25}></RankBadge></TableCell>
              <TableCell>{row.place}</TableCell>
              <TableCell>{row.score}</TableCell>
              <TableCell>{row.highest_skill}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>Kill Feed</Typography>
      <List>
        {carnageReport.kills.map((kill, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <Box display="flex" width="100%" gap={2}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="textPrimary">
                    {kill.time}
                  </Typography>
                </Box>
                <Box>
                <Typography variant="body1"  color="textPrimary">
                    {kill.killer} killed {kill.killed} using a {get_kill_type_name(kill.kill_type)}
                  </Typography>
                  {/* <Typography variant="body2" color="textSecondary">
                    Type: {kill.kill_type}
                  </Typography> */}
                </Box>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
    </main>
  );
}
