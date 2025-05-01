"use client"
import { useCallback, useEffect, useState } from "react"
import { ImGui, ImGuiImplWeb, ImVec2, ImVec4 } from "@mori2003/jsimgui";
import { AuthDebug } from "./AuthDebug";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { VidmastersDebug } from "./VidmastersDebug";
import { useDebugMenuSettings } from "./useDebugMenuSettings";

let initialized = false;
let gl: WebGL2RenderingContext | null;
let x = 0;
let y = 0;
let cursorOverMenu: boolean | undefined;

export type DebugMenuProps = {
    registerRenderer: (name: string, renderer: () => void) => void;
    unregisterRenderer: (name: string) => void;
}

let DEBUG_RENDERERS: {[name: string]: () => void} = {}
let VISIBLE_MENUS: {[name: string]: boolean} = {}
const REGISTER_RENDERER = (name: string, renderer: () => void) => {
    console.log('registering renderer for ' + name)
    DEBUG_RENDERERS[name] = renderer;
    console.log({DEBUG_RENDERERS})
}
const UNREGISTER_RENDERER = (name: string) => {
    delete DEBUG_RENDERERS[name];
}

// REGISTER_RENDERER('Demo', () => {
//     ImGui.ShowDemoWindow();
// })

REGISTER_RENDERER('Menus', () => {
    const canvasHeight = gl.canvas.height;
    const canvasWidth = gl.canvas.width;
    const scale = window.devicePixelRatio || 1;
    ImGui.SetNextWindowPos(
        new ImVec2(canvasWidth * (1 / scale) - 10, canvasHeight * (1 / scale) - 10),
        undefined,
        new ImVec2(1, 1)
    )

    ImGui.Begin('Menus', undefined, 
        ImGui.WindowFlags.NoResize 
        | ImGui.WindowFlags.AlwaysAutoResize 
        // | ImGui.WindowFlags.NoFocusOnAppearing
        | ImGui.WindowFlags.NoCollapse
        | ImGui.WindowFlags.NoTitleBar
    );
        let menuNames = Object.keys(DEBUG_RENDERERS);
        if (ImGui.BeginMultiSelect(ImGui.MultiSelectFlags.None, undefined, menuNames.length - 1)) {
            for (let i = 0; i < menuNames.length; i++) {
                let name = menuNames[i];
                if (name == 'Menus') continue;
                if (ImGui.Selectable(name, !!VISIBLE_MENUS[name])) {
                    VISIBLE_MENUS[name] = !VISIBLE_MENUS[name];
                }
            }
            if (ImGui.Selectable('Close', false)) {
                VISIBLE_MENUS['Menus'] = false;
            }
        }
        ImGui.EndMultiSelect();
    ImGui.End();
})

function imguiRender() {
    if (!gl) {
        throw new Error("imguiRender: gl is null");
    }
    const canvasHeight = gl.canvas.height;
    const canvasWidth = gl.canvas.width;
    const scale = window.devicePixelRatio || 1;

    ImGuiImplWeb.BeginRenderWebGL();

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

    Object.entries(VISIBLE_MENUS).forEach(([name, visible]) => {
        if (visible) {
            DEBUG_RENDERERS[name]();
        }
    })

    if (!VISIBLE_MENUS['Menus']) {
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
            VISIBLE_MENUS['Menus'] = !VISIBLE_MENUS['Menus'];
        }
        ImGui.End();
    }

    ImGuiImplWeb.EndRenderWebGL();




    const pixel = new Uint8Array(4);
    // Flip Y because WebGL's origin is bottom-left
    // gl.finish();
    const scaledX = x * scale;
    const scaledY = y * scale;
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
    

    requestAnimationFrame(imguiRender);
}

const eventHandler = async (event: MouseEvent) => {
    x = event.clientX;
    y = event.clientY;
    return;
}

const addEventHandlers = (canvas: HTMLCanvasElement) => {
    const htmlElement = document.getElementsByTagName('html').item(0);
    if (!htmlElement) {
        throw new Error("UNREACHABLE: HTML element not found.")
    }
    // We disable imgui's events when the mouse isn't over it
    // but we need to keep tracking the mouse to know when it returns.
    htmlElement.addEventListener('mousemove', eventHandler, {capture: true})
    // Without this, scrolling on a widget scrolls both the widget and the underlying page.
    canvas?.addEventListener('wheel', (e) => e.preventDefault(), {capture: true})
}

export const DebugMenu = () => {
    // 2. save open menus
    // 3. refactor

    const {imguiVisible, setImguiVisible, isWindowOpen, toggleWindow} = useDebugMenuSettings();
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();

    const toggleImguiVisible = useCallback(
        (event: KeyboardEvent) => {
            console.log("GOT KEYDOWN " + event.key)
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

        console.log('ADDING EVENT LISTENER FOR F6')
        htmlElement.addEventListener('keydown', toggleImguiVisible);
        return () => { 
            htmlElement.removeEventListener('keydown', toggleImguiVisible)
        }
    }, [toggleImguiVisible, canvas])


    const setCanvasRef = useCallback((_canvas: HTMLCanvasElement | null) => {
        if (_canvas) {
            setCanvas(_canvas);
            if (initialized) {
                console.warn("The debug menu attempted to initialize a second time. Skipping.")
                return;
            }
            initialized = true;
            const htmlElement = document.getElementsByTagName('html').item(0);
            if (!htmlElement) {
                throw new Error("UNREACHABLE: HTML element not found.")
            }

            // We disable imgui's events when the mouse isn't over it
            // but we need to keep tracking the mouse to know when it returns.
            htmlElement.addEventListener('mousemove', eventHandler, {capture: true});
            // Track F6 down for toggling the menu.
            htmlElement.addEventListener('keypress', (e) => {
                if (e.key === 'F6') setImguiVisible(!imguiVisible);
            })
            // Without this, scrolling on a widget scrolls both the widget and the underlying page.
            _canvas.addEventListener('wheel', (e) => e.preventDefault(), {capture: true});

            // (async () => {
            //     gl = _canvas.getContext('webgl2');
            //     await ImGuiImplWeb.InitWebGL(_canvas);
            //     requestAnimationFrame(imguiRender);
            // })();
        }


    }, []);
    
    useEffect(() => {
        console.log({gl, canvas})
        if (canvas && imguiVisible) {
            (async () => {
                {
                    gl = canvas.getContext('webgl2');
                    await ImGuiImplWeb.InitWebGL(canvas);
                    requestAnimationFrame(imguiRender);
                }
            })();
        }
    }, [canvas, imguiVisible])

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
        <AuthDebug 
            registerRenderer={REGISTER_RENDERER}
            unregisterRenderer={UNREGISTER_RENDERER}
        />
        <VidmastersDebug 
            registerRenderer={REGISTER_RENDERER}
            unregisterRenderer={UNREGISTER_RENDERER}
        />
    </>
}