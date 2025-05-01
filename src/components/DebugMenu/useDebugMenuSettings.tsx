import { useCallback, useState } from "react";
import { z } from "zod";
import { DebugWindow, DebugWindowEnum } from "./useDebugWindows";

export const useDebugMenuSettings = () => {
    const [imguiVisible, setImguiVisible] = useState<boolean | undefined>(
      undefined
    );
  
    if (imguiVisible === undefined) {
        if (localStorage.getItem("debugMenu.visible") == "true") {
            setImguiVisible(true);
        } 
        else { 
            setImguiVisible(false); 
        }
    }
  
    const setImguiVisibleAndStore = useCallback(
      (visible: boolean) => {
        localStorage.setItem("debugMenu.visible", visible.toString());
        setImguiVisible(visible);
      },
      [setImguiVisible]
    );
  
    return { imguiVisible:  imguiVisible || false, setImguiVisible: setImguiVisibleAndStore } as const;
  };