import { useEffect, useState } from 'react';

const DEFAULT_SHOW_DEBUG_MENU = false;

export const useDebugMenuPreferences = () => {
    const [showDebugMenu, setShowDebugMenu] = useState(() => {
        try {
            const json = localStorage.getItem('debug_menu_preferences');
            return json ? JSON.parse(json).showDebugMenu ?? DEFAULT_SHOW_DEBUG_MENU : DEFAULT_SHOW_DEBUG_MENU;
        } catch {
            return DEFAULT_SHOW_DEBUG_MENU;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(
                'debug_menu_preferences',
                JSON.stringify({ showDebugMenu })
            );
        } catch (e) {
            console.warn(e)
        }
    }, [showDebugMenu]);

    return {
        showDebugMenu,
        setShowDebugMenu,
    };
};
