"use client"
import { useCallback, useEffect } from "react"
import { ImguiWindowsOverlay } from "./ImguiWindowsOverlay/ImguiWindowsOverlay";
import { useDebugMenuPreferences } from "./useDebugMenuPreferences";
import { AuthWindow } from "./windows/AuthWindow";
import { VidmastersWindow } from "./windows/VidmastersWindow";


export const DebugMenu = () => {
    const { showDebugMenu, setShowDebugMenu } = useDebugMenuPreferences();

    const toggleImguiVisible = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Backspace" && event.ctrlKey)
                setShowDebugMenu(!showDebugMenu);
        },
        [showDebugMenu, setShowDebugMenu]
    );

    useEffect(() => {
        const htmlElement = document.getElementsByTagName('html').item(0);
        if (!htmlElement) {
            throw new Error("UNREACHABLE: HTML element not found.")
        }

        htmlElement.addEventListener('keydown', toggleImguiVisible);
        return () => {
            htmlElement.removeEventListener('keydown', toggleImguiVisible)
        }
    }, [toggleImguiVisible])

    return <ImguiWindowsOverlay 
        visible={showDebugMenu}
        watermark={`Blam Network | ${process.env.NODE_ENV} environment`}
    >
        <AuthWindow />
        <VidmastersWindow />
    </ImguiWindowsOverlay>
}