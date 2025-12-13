// this sketch draws a fixed fullscreen canvas
// there are a bunch on nodes the spawn in the center and move outwards
// we draw lines the nodes if two nodes are close enough to each other
// when no loading we dont show anything
// when loading we start the nodes and lines


import { useEffect, useRef } from "react";


export default function Loading({ isLoading }) {
    const canvasRef = useRef(null);
    const nodesRef = useRef([]);
    const ctxRef = useRef(null);

    useEffect(() => {
        if (!isLoading) return;
        ctxRef.current = canvasRef.current.getContext('2d');
        canvasRef.current.width = window.innerWidth * 2;
        canvasRef.current.height = window.innerHeight * 2;
        const newNodes = Array.from({ length: 200 }, () => ({
            x: Math.random() * canvasRef.current.width,
            y: Math.random() * canvasRef.current.height,
            velX: Math.random() * 1 - .5,
            velY: Math.random() * 1 - .5,
        }));
        nodesRef.current = newNodes;
        animate();
        return () => {
            cancelAnimationFrame(animate);
        }
    }, [isLoading]);

    const line = (x1, y1, x2, y2) => {
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x1, y1);
        ctxRef.current.lineTo(x2, y2);
        ctxRef.current.stroke();
    }
    const checkTwoNodes = (node1, node2) => {
        const distance = Math.hypot(node1.x - node2.x, node1.y - node2.y);
        if (distance < 100) {
            line(node1.x, node1.y, node2.x, node2.y);
        }
    }

    const animate = () => {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        nodesRef.current.forEach(node => {
            node.x += node.velX;
            if (node.x < 0 || node.x > canvasRef.current.width) {
                node.velX = -node.velX;
            }
            node.y += node.velY;
            if (node.y < 0 || node.y > canvasRef.current.height) {
                node.velY = -node.velY;
            }
        });
        nodesRef.current.forEach((n1, i1) => {
            nodesRef.current.forEach((n2, i2) => {
                if (i1 === i2) return;
                checkTwoNodes(n1, n2);
            });
        });
        requestAnimationFrame(animate);
    }


    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-xs z-60 animateIn" >
            <canvas ref={canvasRef} className="w-full h-full" />
            <style jsx>{`
                .animateIn {
                    animation: animateIn 1s ease-in-out;
                }
            `}</style>
            <style jsx>{`
                @keyframes animateIn {
                    from {
                        opacity: 0;
                    }
                }
                to {
                    opacity: 1;
                }
            `}</style>
        </div>
    )
}