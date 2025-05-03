"use client"
import { CanvasHTMLAttributes, DetailedHTMLProps, RefCallback, useCallback, useEffect, useRef, useState } from "react"

type TransparentOverlayCanvasProps = (
    Omit<DetailedHTMLProps<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>, 'ref'>
    & { canvasRef: RefCallback<HTMLCanvasElement> }
    & { context: 'webgl2', render: (gl: WebGL2RenderingContext) => void }
)

export const TransparentOverlayCanvas = (
    {children, canvasRef, render, style, ...props}: TransparentOverlayCanvasProps
) => {
    const cursorIsDown = useRef<boolean>(false)
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
    const xRef = useRef<number>(0);
    const yRef = useRef<number>(0);
    const glRef = useRef<WebGL2RenderingContext | null>(null);
    const renderRef = useRef<TransparentOverlayCanvasProps['render']>();

    useEffect(() => {
        renderRef.current = render;
    }, [render])

    const setCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
        if (canvasRef) {
            canvasRef(canvas)
        }
        if (canvas) {
            setCanvas(canvas);
            
            if (!glRef.current) {
                glRef.current = canvas.getContext('webgl2');
            }
            requestAnimationFrame(renderLoop);
        }
    }, [setCanvas]);

    const mouseMoveEventHandler = useCallback((e: MouseEvent) => {
        xRef.current = e.clientX;
        yRef.current = e.clientY;
    }, [xRef, yRef])

    const mouseUpDownEventHandler = useCallback((e: MouseEvent) => {
        if (e.type === 'mousedown') {
            cursorIsDown.current = true;
        }
        if (e.type === 'mouseup') {
            cursorIsDown.current = false;
        }
    }, [cursorIsDown]);

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
        // Without this, scrolling on a widget scrolls both the widget and the underlying page.
        canvas.addEventListener('wheel', wheelEventHandler, {capture: true});
        // If the user has clicked on an imgui menu and still has mousedown, we keep listening for mouseup, even if off-window.
        canvas.addEventListener('mouseup', mouseUpDownEventHandler, {capture: true});
        canvas.addEventListener('mousedown', mouseUpDownEventHandler, {capture: true});

        return () => {
            htmlElement.removeEventListener('mousemove', mouseMoveEventHandler);
            canvas.removeEventListener('wheel', wheelEventHandler);
            canvas.removeEventListener('mouseup', mouseUpDownEventHandler);
            canvas.removeEventListener('mousedown', mouseUpDownEventHandler);
        }
    }, [canvas])

    const renderLoop = useCallback(() => {
        if (!glRef.current) {
            throw new Error("renderLoop: gl is null");
        }
        const gl = glRef.current;
        if (gl.canvas instanceof OffscreenCanvas) {
            throw new Error("UNREACHABLE: GL canvas is an offscreen canvas!");
        }
        const scale = window.devicePixelRatio || 1;

        renderRef.current && renderRef.current(glRef.current);

        const pixel = new Uint8Array(4);

        const scaledX = xRef.current * scale;
        const scaledY = yRef.current * scale;
        gl.readPixels(
            scaledX,
            gl.canvas.height - scaledY,
            1,
            1,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            pixel
        );
    
        const cursorOverMenu = pixel[3] != 0;
        if (cursorOverMenu || cursorIsDown.current) {
            gl.canvas.style.pointerEvents = 'auto';
        } else {
            gl.canvas.style.pointerEvents = 'none';
        }
        
    
        requestAnimationFrame(renderLoop);
    }, [xRef, yRef, glRef])
    
    useEffect(() => {
        if (canvas) {
            {
                if (!glRef.current) {
                    glRef.current = canvas.getContext('webgl2');
                }
                requestAnimationFrame(renderLoop);
            }
        };
        
    }, [canvas])

    return <canvas 
        {...props}
        ref={setCanvasRef}
        style={{
            pointerEvents: 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            ...style
        }}
    >
        {children}
    </canvas>
}