import React, { useMemo, useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

// Approximate coordinates for regions
const REGIONS = {
    "US-East": { lat: 40, lng: -75, flag: "🇺🇸", id: "US-East" },
    "US-West": { lat: 37, lng: -120, flag: "🇺🇸", id: "US-West" },
    "EU-West": { lat: 48, lng: 2, flag: "🇪🇺", id: "EU-West" },
    "Asia-Pac": { lat: 35, lng: 139, flag: "🇯🇵", id: "Asia-Pac" },
    "SA-East": { lat: -23, lng: -46, flag: "🇧🇷", id: "SA-East" },
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
            globeEl.current.pointOfView({ altitude: 2.5 });
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
        <div className="w-full h-full bg-[#050510] relative overflow-hidden rounded-xl border border-cyber-dim shadow-[0_0_20px_rgba(0,240,255,0.1)]">
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

                // Labels (Flags)
                labelsData={pointsData}
                labelLat="lat"
                labelLng="lng"
                labelText="flag"
                labelSize={2}
                labelDotRadius={0.5}
                labelColor={() => "#ffffff"}
                labelResolution={2}
                labelAltitude={0.06}

                // Atmosphere
                atmosphereColor="#00f0ff"
                atmosphereAltitude={0.25}
            />

            {/* Map Overlay Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,#050510_100%)] z-20" />
        </div>
    );
};

export default MapVisualizer;
