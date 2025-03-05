import { ServiceRecord } from "../api/sunrise/serviceRecord";
import { Stack, Box, Typography } from "@mui/material";
import { getColor, getColorName, getCssColor } from "../colors";
import { Emblem } from "./Emblem";

export const rankStrings = [
    'No Rank',
    'Recruit',
    'Apprentice',
    'Private',
    'Corporal',
    'Sergeant',
    'Gunnery Sergeant',
    'Lieutenant',
    'Captain',
    'Major',
    'Commander',
    'Colonel',
    'Brigadier',
    'General',
]

export const campaignBadges = [
    'easy_off',
    'easy',
    'normal_off',
    'normal',
    'heroic_off',
    'heroic',
    'legendary_off',
    'legendary',
]

const getNextRank = (rank: number, grade: number, highestSkill: number) => {
    if (rank == 13 && grade == 4) return undefined;

    const nextSkill = getNextRankSkill(rank, grade, highestSkill);
    const nextEXP = getNextRankEXP(rank, grade);

    if (nextSkill > highestSkill) {
        return `Skill: ${nextSkill} or ${nextEXP} EXP`;
    } else {
        return `${nextEXP} EXP`;
    }
}

const getNextRankSkill = (rank: number, grade: number, highestSkill: number) => {
    if (rank == 6) {
        return 10;
    }
    if (rank == 7) {
        return 20;
    }
    if (rank == 8) {
        return 30;
    }
    if (rank == 9) {
        return 35;
    }
    if (rank == 10) {
        return 40;
    }
    if (rank == 11) {
        return 45;
    }
    if (rank == 12) {
        return 50;
    }

    
    return 0;
}

export const getNextRankEXP = (rank: number, grade: number) => {
    if (rank == 0) {
        if (grade == 1) 
            return 2;
    }
    if (rank == 1) {
        if (grade == 1) 
            return 3;
        if (grade == 2) 
            return 5;
    }
    if (rank == 2) {
        if (grade == 1) 
            return 7;
        if (grade == 2)
            return 10;
    }
    if (rank == 3) {
        if (grade == 1)
            return 15;
        if (grade == 2)
            return 20;
    }
    if (rank == 4) {
        if (grade == 1)
            return 30;
        if (grade == 2)
            return 40;
        if (grade == 3)
            return 50;
    }
    if (rank == 5) {
        if (grade == 1)
            return 60;
        if (grade == 2)
            return 150;
        if (grade == 3)
            return 300;
        if (grade == 4)
            return 400;
    }
    if (rank == 6) {
        if (grade == 1)
            return 85;
        if (grade == 2)
            return 200;
        if (grade == 3)
            return 400;
        if (grade == 4)
            return 600;
    }
    if (rank == 7) {
        if (grade == 1)
            return 150;
        if (grade == 2)
            return 300;
        if (grade == 3)
            return 600;
        if (grade == 4)
            return 1200;
    }
    if (rank == 8) {
        if (grade == 1)
            return 300;
        if (grade == 2)
            return 600;
        if (grade == 3)
            return 1200;
        if (grade == 4)
            return 1800;
    }
    if (rank == 9) {
        if (grade == 1)
            return 450;
        if (grade == 2)
            return 900;
        if (grade == 3)
            return 1800;
        if (grade == 4)
            return 2400;
    }
    if (rank == 10) {
        if (grade == 1)
            return 600;
        if (grade == 2)
            return 1200;
        if (grade == 3)
            return 2400;
        if (grade == 4)
            return 4000;
    }
    if (rank == 11) {
        if (grade == 1)
            return 1000;
        if (grade == 2)
            return 2000;
        if (grade == 3)
            return 4000;
        if (grade == 4)
            return 5000;
    }
    if (rank == 12) {
        if (grade == 1)
            return 1200;
        if (grade == 2)
            return 2500;
        if (grade == 3)
            return 5000;
        if (grade == 4)
            return 0;
    }

}

const CampaignBadge = ({campaignBadge}: {campaignBadge: number}) => {
    return (
        <img src={`/img/${campaignBadges[campaignBadge]}.gif`} height={100} style={{filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))'}} />
    );
}

export const RankBadge = ({rank, grade, size}: {rank: number, grade: number, size: number}) => {
    // return svg from public folder
    if (rank == 0) {
        return (
            <Box sx={{width: size, height: size}}/>
        );
    }
    return (
        <Box sx={{width: size, height: size, display: 'flex', justifyContent: 'center'}}>
            <img src={`/img/rank/${rank.toString() + (grade > 0 ? `_${grade}` : '')}.svg`} style={{
                maxWidth: '100%',
                maxHeight: '100%',
            }} />
        </Box>
    );
}

export const ServiceRecordPlaceholder = ({serviceRecord}: {serviceRecord: ServiceRecord}) => {
    return (
        <Stack sx={{ 
            width: '100%', 
            flexDirection: 'row', 
            border: '1px solid white', 
            marginTop: 2, 
            background: `linear-gradient(180deg, rgba(0,0,0,1) 0%, ${getCssColor(serviceRecord.primaryColor)} 100%)`,
            gap: 2,
            justifyContent: 'space-between',
        }}>
            <Stack sx={{
                flexDirection: 'row', 
                gap: 2,
            }}>
                <Emblem size={100} emblem={{
                    primary: serviceRecord.foregroundEmblem,
                    secondary: serviceRecord.emblemFlags === 0,
                    background: serviceRecord.backgroundEmblem,
                    primaryColor: serviceRecord.emblemPrimaryColor,
                    secondaryColor: serviceRecord.emblemSecondaryColor,
                    backgroundColor: serviceRecord.emblemBackgroundColor,
                    armourPrimaryColor: serviceRecord.primaryColor,
                }}/>
                <Box display='flex' alignItems='flex-start' flexDirection='column' justifyContent='center' height='100%'>
                    <Typography variant='h4'>{serviceRecord.playerName} - {serviceRecord.serviceTag}</Typography>
                    <Typography variant='body1'>Global Rank: {rankStrings[serviceRecord.rank]}, {'Grade ' + serviceRecord.grade}</Typography>
                    <Typography variant='body2'>Highest Skill: {serviceRecord.highestSkill} | EXP {serviceRecord.totalEXP} | Next Rating: {getNextRank(serviceRecord.rank, serviceRecord.grade, serviceRecord.highestSkill)}</Typography>
                </Box>
            </Stack>
            <Stack sx={{
                flexDirection: 'row', 
                gap: 2,
            }}>
                <RankBadge rank={serviceRecord.rank} grade={serviceRecord.grade} size={100}/>
                {/* <CampaignBadge campaignBadge={serviceRecord.campaignProgress}/> */}
            </Stack>
            {/* <Rank */}
        </Stack>
    );
}
