export const getGametypeName = (gametype: number) => {
    switch(gametype) {
        case 1:
            return "Capture the Flag";
        case 2:
            return "Slayer";
        case 3:
            return "Oddball";
        case 4:
            return "King of the Hill";
        case 5:
            return "Juggernaut";
        case 6:
            return "Territories";
        case 7:
            return "Assault";
        case 8:
            return "VIP";
        case 9:
            return "Infection";
        case 10:
            return "Forge";
        default:
            return "Gametype";
    }
}

export const formatSeconds = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toFixed().toString().padStart(2, '0');
  
    if (hours > 0) {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }