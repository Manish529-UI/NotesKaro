import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true
    }
})

const cleanMermaidChart = (diagram) => {
    if (!diagram) return "";

    let clean = typeof diagram === 'object' 
        ? (diagram.data || diagram.chart || diagram.code || diagram.content || String(diagram)) 
        : String(diagram);

    clean = clean
        .replace(/```(?:mermaid)?/gi, "")
        .replace(/```/g, "")
        .replace(/\\n/g, "\n")
        .replace(/\r\n/g, "\n")
        .trim();

    if (!clean.toLowerCase().startsWith("graph") && !clean.toLowerCase().startsWith("flowchart")) {
        clean = `graph TD\n${clean}`;
    }

    return clean;
};

const autoFixNodes = (diagram) => {
    if (!diagram) return "";

    let index = 0;
    const used = new Map();

    return diagram.replace(/\[(.*?)\]/g, (match, label) => {
        let key = label.trim();
        // Remove leading and trailing double quotes if already present
        if (key.startsWith('"') && key.endsWith('"')) {
            key = key.slice(1, -1).trim();
        }
        // Replace inner double quotes with single quotes to prevent syntax errors
        key = key.replace(/"/g, "'");

        if (used.has(key)) {
            return used.get(key);
        }

        index++;
        const id = `N${index}`;
        const node = `${id}["${key}"]`;

        used.set(key, node);
        return node;
    });
};

function MermaidSetup({ diagram }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!diagram || !containerRef.current) return;

        const renderDiagram = async () => {
            try {
                if (containerRef.current) {
                    containerRef.current.innerHTML = "";
                }

                const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
                const cleaned = cleanMermaidChart(diagram);
                const safeChart = autoFixNodes(cleaned);

                const { svg } = await mermaid.render(uniqueId, safeChart);

                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;

                    const svgElement = containerRef.current.querySelector('svg');
                    if (svgElement) {
                        svgElement.style.maxWidth = '100%';
                        svgElement.style.height = 'auto';
                        svgElement.style.maxHeight = '350px';
                        svgElement.style.display = 'block';
                        svgElement.style.margin = '0 auto';
                    }
                }
            } catch (error) {
                console.error("Mermaid render failed:", error);
                // Fallback attempt: if autoFixNodes had an edge case, render clean chart directly into SVG
                try {
                    const fallbackId = `mermaid-fb-${Math.random().toString(36).substring(2, 9)}`;
                    const cleaned = cleanMermaidChart(diagram);
                    const { svg } = await mermaid.render(fallbackId, cleaned);
                    if (containerRef.current) {
                        containerRef.current.innerHTML = svg;
                        const svgElement = containerRef.current.querySelector('svg');
                        if (svgElement) {
                            svgElement.style.maxWidth = '100%';
                            svgElement.style.height = 'auto';
                            svgElement.style.maxHeight = '350px';
                        }
                    }
                } catch (fallbackError) {
                    console.error("Mermaid fallback render failed:", fallbackError);
                }
            }
        };

        renderDiagram();
    }, [diagram]);

    return (
        <div className='bg-white border border-gray-200 rounded-lg p-4 max-w-full overflow-x-auto max-h-[400px] flex justify-center items-center shadow-sm my-4'>
            <div ref={containerRef} className="w-full flex justify-center items-center" />
        </div>
    )
}

export default MermaidSetup