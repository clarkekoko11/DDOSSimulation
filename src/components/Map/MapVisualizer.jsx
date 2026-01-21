import React, { useMemo, useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

// Approximate coordinates for regions
const REGIONS = {
    "US-East": { lat: 40, lng: -75, flag: "https://flagcdn.com/w40/us.png", id: "US-East" },
    "US-West": { lat: 37, lng: -120, flag: "https://flagcdn.com/w40/us.png", id: "US-West" },
    "EU-West": { lat: 48, lng: 2, flag: "https://flagcdn.com/w40/eu.png", id: "EU-West" },
    "Asia-Pac": { lat: 35, lng: 139, flag: "https://flagcdn.com/w40/jp.png", id: "Asia-Pac" },
    "SA-East": { lat: -23, lng: -46, flag: "https://flagcdn.com/w40/br.png", id: "SA-East" },
};

const MapVisualizer = ({ selectedServer, attacks = [] }) => {
    const globeEl = useRef();
    const [pointsData, setPointsData] = useState([]);

    useEffect(() => {
        // Convert REGIONS object to array for globe points
        const points = Object.values(REGIONS).map(r => ({
            ...r,
            size: selectedServer === r.id ? 1.5 : 0.5,
            color: selectedServer === r.id ? '#00f0ff' : '#ffffff'
        }));
        setPointsData(points);
    }, [selectedServer]);

    // Prepare arcs data from attacks
    const arcsData = useMemo(() => {
        if (!selectedServer || !REGIONS[selectedServer]) return [];
        const target = REGIONS[selectedServer];

        return attacks.map(attack => ({
            startLat: attack.source[1],
            startLng: attack.source[0],
            endLat: target.lat,
            endLng: target.lng,
            color: attack.color || '#ff003c',
            name: attack.type
        }));
    }, [attacks, selectedServer]);

    useEffect(() => {
        // Auto-rotate globe
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            // Center view initially
            globeEl.current.pointOfView({ altitude: 2.5, lat: 20, lng: 0 });
        }
    }, []);

    // Focus on selected server
    useEffect(() => {
        if (selectedServer && globeEl.current && REGIONS[selectedServer]) {
            const target = REGIONS[selectedServer];
            globeEl.current.pointOfView({ lat: target.lat, lng: target.lng, altitude: 2 }, 1000);
        }
    }, [selectedServer]);

    return (
        <div className="w-full h-full bg-[#050510] relative overflow-hidden rounded-xl border border-cyber-dim shadow-[0_0_20px_rgba(0,240,255,0.1)] flex items-center justify-center">
            {/* Decorative Grid Overlay (optional, creates screen effect over globe) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10" />

            <Globe
                ref={globeEl}
                backgroundColor="rgba(0,0,0,0)" // Transparent to show parent bg
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

                // Attack Arcs
                arcsData={arcsData}
                arcColor="color"
                arcDashLength={() => Math.random() * 0.5 + 0.1}
                arcDashGap={0.2}
                arcDashAnimateTime={2000} // Speed
                arcStroke={0.5}
                arcAltitude={() => 0.1 + Math.random() * 0.4} // Varied heights

                // Server Points
                pointsData={pointsData}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.05}
                pointRadius="size"
                pointsMerge={true}
                pointPulseBtn={true} // Pulse animation

                // Atmosphere
                atmosphereColor="#00f0ff"
                atmosphereAltitude={0.25}

                // HTML Markers for flags
                htmlElementsData={pointsData}
                htmlLat="lat"
                htmlLng="lng"
                htmlAltitude={0.1}
                htmlElement={d => {
                    const el = document.createElement('div');
                    el.innerHTML = `<img src="${d.flag}" style="width: 20px; border-radius: 2px; opacity: 0.8; border: 1px solid #00f0ff;">`;
                    el.style.width = '20px';
                    el.style.pointerEvents = 'none'; // distinct from click interaction
                    return el;
                }}
            />

            {/* Map Overlay Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,#050510_100%)] z-20" />
        </div>
    );
};

export default MapVisualizer;
