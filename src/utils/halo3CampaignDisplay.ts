export function getHalo3MissionName(mapId: number): string {
  switch (mapId) {
    case 3005:
      return "Arrival";
    case 3010:
      return "Sierra 117";
    case 3020:
      return "Crow's Nest";
    case 3030:
      return "Tsavo Highway";
    case 3040:
      return "The Storm";
    case 3050:
      return "Floodgate";
    case 3070:
      return "The Ark";
    case 3100:
      return "The Covenant";
    case 3110:
      return "Cortana";
    case 3120:
      return "Halo";
    case 3130:
      return "Epilogue";
    default:
      return "Unknown Mission";
  }
}

export function getHalo3DifficultyName(difficulty: number | undefined): string {
  if (difficulty === undefined) {
    return "Unknown";
  }

  switch (difficulty) {
    case 0:
      return "Easy";
    case 1:
      return "Normal";
    case 2:
      return "Heroic";
    case 3:
      return "Legendary";
    default:
      return "Unknown";
  }
}
