import { useCallback, useState } from "react";
import { z } from "zod";

const DebugWindowEnum = z.enum([
    'Authentication',
    'Vidmasters',
    'Menus'
])

type DebugWindow = z.infer<typeof DebugWindowEnum>;

export const useDebugMenuSettings = () => {
    const [imguiVisible, setImguiVisible] = useState<boolean | undefined>(
      undefined
    );

    const [openWindows, setOpenWindows] = useState<DebugWindow[]>();
    const isWindowOpen = useCallback((name: DebugWindow) => {
        return openWindows?.find(window => window == name);
    }, [openWindows])
    const setOpenWindowsAndStore = useCallback((openWindows: DebugWindow[]) => {
        localStorage.setItem("debugMenu.windows", openWindows.toString());
        setOpenWindows(openWindows);
    }, [setOpenWindows])
    const toggleWindow = useCallback((name: DebugWindow) => {
        if (isWindowOpen(name)) {
            setOpenWindowsAndStore([...(openWindows || []).filter(window => window !== name)]);
        }
        else {
            setOpenWindowsAndStore([...(openWindows || []), name]);
        }
    }, [setOpenWindows, isWindowOpen])
  
    if (imguiVisible === undefined) {
        if (localStorage.getItem("debugMenu.visible") == "true") {
            setImguiVisible(true);
        } 
        else { 
            setImguiVisible(false); 
        }
    }

    if (openWindows == undefined) {
        if (localStorage.getItem("debugMenu.windows")) {
            const parsedWindows = DebugWindowEnum.array().safeParse(localStorage.getItem("debugMenu.windows"));
            if (parsedWindows.success) {
                setOpenWindows(parsedWindows.data);
            } 
            else {
                setOpenWindows([])
            }
        } else {
            setOpenWindows([])
        }
    }
  
    const setImguiVisibleAndStore = useCallback(
      (visible: boolean) => {
        localStorage.setItem("debugMenu.visible", visible.toString());
        setImguiVisible(visible);
      },
      [setImguiVisible]
    );
  
    return { imguiVisible:  imguiVisible || false, setImguiVisible: setImguiVisibleAndStore, isWindowOpen, toggleWindow } as const;
  };