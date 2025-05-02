"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { ImGui, ImGuiImplWeb, ImVec2, ImVec4 } from "@mori2003/jsimgui";
import { AuthDebug } from "./AuthDebug";
import { VidmastersDebug } from "./VidmastersDebug";
import { ImguiThemeContext, useDebugMenuSettings } from "./useDebugMenuSettings";
import { DebugWindow, useDebugWindows, WindowRenderer } from "./useDebugWindows";
import { ConfigDebug } from "./ConfigMenu";

let cursorOverMenu: boolean | undefined;

export type DebugMenuProps = {
    registerRenderer: (name: DebugWindow, renderer: WindowRenderer) => void;
    unregisterRenderer: (name: DebugWindow) => void;
}

export const DebugMenu = () => {
    const {imguiVisible, setImguiVisible, theme, applyTheme, setTheme} = useDebugMenuSettings();
    const { renderOpenWindows, openMenu, isMenuOpen, registerWindow, unregisterWindow } = useDebugWindows();
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
    const xRef = useRef<number>(0);
    const yRef = useRef<number>(0);
    const glRef = useRef<WebGL2RenderingContext | null>(null);

    const toggleImguiVisible = useCallback(
        (event: KeyboardEvent) => {
          if (event.key === "F6")
            setImguiVisible(!imguiVisible);
        },
        [imguiVisible, setImguiVisible]
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
    }, [toggleImguiVisible, canvas])


    const setCanvasRef = useCallback((newCanvas: HTMLCanvasElement | null) => {
        if (newCanvas) {
            setCanvas(newCanvas);
        }
    }, [setCanvas]);

    const mouseMoveEventHandler = useCallback((e: MouseEvent) => {
        xRef.current = e.clientX;
        yRef.current = e.clientY;
    }, [xRef, yRef])
    const keypressEventHandler = useCallback((e: KeyboardEvent) => {
        if (e.key === 'F6') setImguiVisible(!imguiVisible);
    }, [setImguiVisible, imguiVisible])
    const wheelEventHandler = (e: WheelEvent) => e.preventDefault();
    useEffect(() => {
        if (!canvas) return;
        
        const htmlElement = document.getElementsByTagName('html').item(0);
        if (!htmlElement) {
            throw new Error("UNREACHABLE: HTML element not found.")
        }

        // We disable imgui's events when the mouse isn't over it
        // but we need to keep tracking the mouse to know when it returns.
        htmlElement.addEventListener('mousemove', mouseMoveEventHandler, {capture: true});
        // Track F6 down for toggling the menu.
        htmlElement.addEventListener('keypress', keypressEventHandler)
        // Without this, scrolling on a widget scrolls both the widget and the underlying page.
        canvas.addEventListener('wheel', wheelEventHandler, {capture: true});

        return () => {
            htmlElement.removeEventListener('mousemove', mouseMoveEventHandler);
            htmlElement.removeEventListener('keypress', keypressEventHandler);
            canvas.removeEventListener('wheel', wheelEventHandler);
        }
    }, [canvas])

    const renderLoop = useCallback(() => {
        if (!glRef.current) {
            throw new Error("renderLoop: gl is null");
        }
        const gl = glRef.current;
        if (gl.canvas instanceof OffscreenCanvas) {
            throw new Error("Can't render debug menu to an offscreen canvas.");
        }
        const canvasHeight = gl.canvas.height;
        const canvasWidth = gl.canvas.width;
        const scale = window.devicePixelRatio || 1;
    
        ImGuiImplWeb.BeginRenderWebGL();

        applyTheme();
    
        ImGui.SetNextWindowPos(new ImVec2(0, 0))
        ImGui.Begin('Watermark', undefined, 
            ImGui.WindowFlags.NoBackground |
            ImGui.WindowFlags.NoTitleBar |
            ImGui.WindowFlags.NoBringToFrontOnFocus |
            ImGui.WindowFlags.NoDecoration |
            ImGui.WindowFlags.NoDocking |
            ImGui.WindowFlags.NoFocusOnAppearing |
            ImGui.WindowFlags.NoNav |
            ImGui.WindowFlags.NoNavFocus |
            ImGui.WindowFlags.NoCollapse |
            ImGui.WindowFlags.NoResize |
            ImGui.WindowFlags.NoInputs |
            ImGui.WindowFlags.NoMouseInputs 
        )
        ImGui.Text('Blam Network | Untracked Version | Local Environemnt');
        ImGui.End();
    
        renderOpenWindows(gl);
    
        if (!isMenuOpen()) {
            ImGui.SetNextWindowPos(
                new ImVec2(canvasWidth * (1 / scale) - 10, canvasHeight * (1 / scale) - 10),
                undefined,
                new ImVec2(1, 1)
            )
            ImGui.Begin('Menu##buttoncontainer', undefined,         
                ImGui.WindowFlags.NoBackground |
                ImGui.WindowFlags.NoTitleBar |
                ImGui.WindowFlags.NoResize 
            )
            
    
            if (ImGui.Button("Menus##button")) {
                openMenu();
            }
            ImGui.End();
        }
    
        ImGuiImplWeb.EndRenderWebGL();
    
        const pixel = new Uint8Array(4);

        const scaledX = xRef.current * scale;
        const scaledY = yRef.current * scale;
        gl.readPixels(
            scaledX,
            canvasHeight - scaledY,
            1,
            1,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            pixel
        );
    
        cursorOverMenu = pixel[3] != 0;
        if (cursorOverMenu) {
            gl.canvas.style.pointerEvents = 'auto';
        } else {
            gl.canvas.style.pointerEvents = 'none';
        }
        
    
        requestAnimationFrame(renderLoop);
    }, [xRef, yRef, renderOpenWindows, openMenu, isMenuOpen, theme, applyTheme])
    
    useEffect(() => {
        if (canvas && imguiVisible) {
            (async () => {
                {
                    if (!glRef.current) {
                        glRef.current = canvas.getContext('webgl2');
                        await ImGuiImplWeb.InitWebGL(canvas);
                    }
                    requestAnimationFrame(renderLoop);
                }
            })();
        }
    }, [canvas, imguiVisible, theme])

    return <>
        <canvas 
            ref={setCanvasRef}
            style={{
                pointerEvents: 'none',
                display: imguiVisible ? 'block' : 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 9999,
            }}
        />
        <ImguiThemeContext.Provider value={{
            theme,
            setTheme,
        }}>
            <AuthDebug 
                registerRenderer={registerWindow}
                unregisterRenderer={unregisterWindow}
            />
            <VidmastersDebug 
                registerRenderer={registerWindow}
                unregisterRenderer={unregisterWindow}
            />
            <ConfigDebug
                registerRenderer={registerWindow}
                unregisterRenderer={unregisterWindow}
            />
        </ImguiThemeContext.Provider>
    </>
}