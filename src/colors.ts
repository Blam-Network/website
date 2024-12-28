export function getColorName(index: number) {
    switch(index) {
        case 0:
            return "Steel"
        case 1:
            return "Silver"
        case 2:
            return "White"
        case 3:
            return "Red"
        case 4:
            return "Mauve"
        case 5:
            return "Salmon"
        case 6:
            return "Orange"
        case 7:
            return "Coral"
        case 8:
            return "Peach"
        case 9:
            return "Gold"
        case 10:
            return "Yellow"
        case 11:
            return "Pale"
        case 12:
            return "Sage"
        case 13:
            return "Green"
        case 14:
            return "Olive"
        case 15:
            return "Teal"
        case 16:
            return "Aqua"
        case 17:
            return "Cyan"
        case 18:
            return "Blue"
        case 19:
            return "Cobalt"
        case 20:
            return "Sapphire"
        case 21:
            return "Violet"
        case 22:
            return "Orchid"
        case 23:
            return "Lavender"
        case 24:
            return "Crimson"
        case 25:
            return "Ruby Wine"
        case 26:
            return "Pink"
        case 27:
            return "Brown"
        case 28:
            return "Tan"
        case 29:
            return "Khaki"
        default:
        case 30:
            return "Transparent"
    }
}

export function getColor(name: string) {
    switch(name) {
        case "Steel":
            return { "r": 110, "g": 110, "b": 110, "a": 255 }
        case "Silver":
            return { "r": 178, "g": 178, "b": 178, "a": 255 }
        case "White":
            return { "r": 200, "g": 200, "b": 200, "a": 255 }
        case "Red":
            return { "r": 167, "g": 59, "b": 59, "a": 255 }
        case "Mauve":
            return { "r": 224, "g": 115, "b": 115, "a": 255 }
        case "Salmon":
            return { "r": 242, "g": 141, "b": 141, "a": 255 }
        case "Orange":
            return { "r": 223, "g": 150, "b": 0, "a": 255 }
        case "Coral":
            return { "r": 251, "g": 184, "b": 98, "a": 255 }
        case "Peach":
            return { "r": 255, "g": 210, "b": 167, "a": 255 }
        case "Gold":
            return { "r": 212, "g": 182, "b": 50, "a": 255 }        
        case "Yellow":
            return { "r": 240, "g": 205, "b": 53, "a": 255 }
        case "Pale":
            return { "r": 255, "g": 223, "b": 132, "a": 255 }
        case "Sage":
            return { "r": 99, "g": 128, "b": 28, "a": 255 }
        case "Green":
            return { "r": 155, "g": 176, "b": 108, "a": 255 }
        case "Olive":
            return { "r": 218, "g": 241, "b": 169, "a": 255 }
        case "Teal":
            return { "r": 56, "g": 132, "b": 137, "a": 255 }
        case "Aqua":
            return { "r": 85, "g": 196, "b": 201, "a": 255 }
        case "Cyan":
            return { "r": 156, "g": 239, "b": 239, "a": 255 }        
        case "Blue":
            return { "r": 59, "g": 101, "b": 158, "a": 255 }
        case "Cobalt":
            return { "r": 96, "g": 148, "b": 223, "a": 255 }
        case "Sapphire":
            return { "r": 163, "g": 191, "b": 246, "a": 255 }
        case "Violet":
            return { "r": 96, "g": 71, "b": 155, "a": 255 }
        case "Orchid":
            return { "r": 156, "g": 129, "b": 233, "a": 255 }
        case "Lavender":
            return { "r": 208, "g": 196, "b": 255, "a": 255 }
        case "Crimson":
            return { "r": 144, "g": 0, "b": 81, "a": 255 }
        case "Ruby Wine":
            return { "r": 216, "g": 69, "b": 143, "a": 255 }
        case "Pink":
            return { "r": 255, "g": 150, "b": 195, "a": 255 }
        case "Brown":
            return { "r": 93, "g": 64, "b": 22, "a": 255 }
        case "Tan":
            return { "r": 182, "g": 150, "b": 121, "a": 255 }
        case "Khaki":
            return { "r": 228, "g": 198, "b": 172, "a": 255 }
        default:
        case "Transparent":
            return { "r": 0.0, "g": 0.0, "b": 0.0, "a": 0.0 }
    }
}

export function getTextColor(name: string) {
    switch(name) {
        case "Steel":
            return { "r": 255, "g": 255, "b": 255, "a": 255 }
        case "Silver":
            return { "r": 255, "g": 255, "b": 255, "a": 255 }
        case "White":
            return { "r": 255, "g": 255, "b": 255, "a": 255 }
        case "Red":
            return { "r": 255, "g": 244, "b": 244, "a": 255 }
        case "Mauve":
            return { "r": 255, "g": 244, "b": 244, "a": 255 }
        case "Salmon":
            return { "r": 255, "g": 255, "b": 255, "a": 255 }
        case "Orange":
            return { "r": 241, "g": 240, "b": 232, "a": 255 }
        case "Coral":
            return { "r": 241, "g": 240, "b": 232, "a": 255 }
        case "Peach":
            return { "r": 255, "g": 255, "b": 255, "a": 255 }
        case "Gold":
            return { "r": 255, "g": 248, "b": 235, "a": 255 }
        case "Yellow":
            return { "r": 255, "g": 248, "b": 235, "a": 255 }
        case "Pale":
            return { "r": 255, "g": 255, "b": 254, "a": 255 }
        case "Sage":
            return { "r": 233, "g": 241, "b": 216, "a": 255 }
        case "Green":
            return { "r": 233, "g": 241, "b": 216, "a": 255 }
        case "Olive":
            return { "r": 255, "g": 255, "b": 255, "a": 255 }
        case "Teal":
            return { "r": 241, "g": 255, "b": 255, "a": 255 }
        case "Aqua":
            return { "r": 241, "g": 255, "b": 255, "a": 255 }
        case "Cyan":
            return { "r": 255, "g": 255, "b": 255, "a": 255 }
        case "Blue":
            return { "r": 233, "g": 240, "b": 255, "a": 255 }
        case "Cobalt":
            return { "r": 233, "g": 240, "b": 255, "a": 255 }
        case "Sapphire":
            return { "r": 255, "g": 255, "b": 255, "a": 255 }
        case "Violet":
            return { "r": 243, "g": 239, "b": 255, "a": 255 }
        case "Orchid":
            return { "r": 243, "g": 239, "b": 255, "a": 255 }
        case "Lavender":
            return { "r": 255, "g": 239, "b": 255, "a": 255 }
        case "Crimson":
            return { "r": 255, "g": 239, "b": 245, "a": 255 }
        case "Ruby Wine":
            return { "r": 255, "g": 239, "b": 245, "a": 255 }
        case "Pink":
            return { "r": 255, "g": 239, "b": 245, "a": 255 }
        case "Brown":
            return { "r": 255, "g": 246, "b": 239, "a": 255 }
        case "Tan":
            return { "r": 255, "g": 246, "b": 239, "a": 255 }
        case "Khaki":
            return { "r": 255, "g": 246, "b": 239, "a": 255 }
        default:
        case "Transparent":
            return { "r": 0.0, "g": 0.0, "b": 0.0, "a": 0.0 }
    }
}

export function getCssColor (colorIndex: number) {
    console.log({colorIndex})
    const color = getColor(getColorName(colorIndex))
    console.log({color})
    return `rgb(${color.r},${color.g},${color.b})`
}