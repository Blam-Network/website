import { getColor } from "../colors";

export const getTeamName = (index: number) => {
    switch (index) {
        case 0:
            return "Red";
        case 1:
            return "Blue";
        case 2:
            return "Green";
        case 3:
            return "Orange";
        case 4:
            return "Purple";
        case 5:
            return "Gold";
        case 6:
            return "Brown";
        case 7:
            return "Pink";
        default:
            return "Unknown";
    }
}

export const getTeamTextColor = (index: number) => {
    switch (index) {
        case 0:
            return {
                "r": 255,
                "g": 235,
                "b": 235,
                "a": 255
            }
        case 1:
            return {
                "r": 229,
                "g": 243,
                "b": 255,
                "a": 255
            }
        case 2:
            return {
                "r": 240,
                "g": 254,
                "b": 235,
                "a": 255
            }
        case 3:
            return {
                "r": 252,
                "g": 247,
                "b": 224,
                "a": 255
            }
        case 4:
            return {
                "r": 244,
                "g": 220,
                "b": 251,
                "a": 255
            }
        case 5:
            return {
                "r": 250,
                "g": 251,
                "b": 230,
                "a": 255
            }
        case 6:
            return {
                "r": 250,
                "g": 245,
                "b": 224,
                "a": 255
            }
        case 7:
            return {
                "r": 250,
                "g": 235,
                "b": 250,
                "a": 255
            }
        default:
            return getColor("White");
    }
}

export const getTeamColor = (index: number) => {
    switch (index) {
        case 0:
            return {
                "r": 167,
                "g": 59,
                "b": 59,
                "a": 255
            }
        case 1:
            return {
                "r": 61,
                "g": 105,
                "b": 167,
                "a": 255
            }
        case 2:
            return {
                "r": 99,
                "g": 128,
                "b": 28,
                "a": 255
            };
        case 3:
            return {
                "r": 233,
                "g": 150,
                "b": 0,
                "a": 255
            }
        case 4:
            return {
                "r": 96,
                "g": 71,
                "b": 155,
                "a": 255    
            }        
        case 5:
            return {
                "r": 212,
                "g": 182,
                "b": 50,
                "a": 255    
            }            
        case 6:
            return {
                "r": 93,
                "g": 64,
                "b": 22,
                "a": 255    
            }
        case 7:
            return {
                "r": 255,
                "g": 150,
                "b": 195,
                "a": 255    
            }
        default:
            return getColor("Black");
    }
}