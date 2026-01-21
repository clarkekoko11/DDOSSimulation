import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Approximate coordinates for regions
const REGIONS = {
    "US-East": [-75, 40],
    "US-West": [-120, 37],
    "EU-West": [2, 48],
    "Asia-Pac": [139, 35],
    "SA-East": [-46, -23],
};

const MapVisualizer = ({ selectedServer, attacks = [] }) => {
    const targetCoords = REGIONS[selectedServer] || [0, 0];

    return (
        <div className="w-full h-full bg-[#050510] relative overflow-hidden rounded-xl border border-cyber-dim shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            {/* Decorative Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 150, // Reduced from 210 to 150 to show more world
                    center: [0, 20]
                }}
                width={800}
                height={400}
                style={{ width: "100%", height: "100%" }}
            >
                <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#12121a"
                                stroke="#2a2a35"
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "#1a1a25", outline: "none" },
                                    pressed: { outline: "none" },
                                }}
                            />
                        ))
                    }
                </Geographies>

                {/* Attack Lines */}
                <AnimatePresence>
                    {attacks.map((attack) => (
                        <AttackLine key={attack.id} attack={attack} target={targetCoords} />
                    ))}
                </AnimatePresence>

                {/* Target Marker */}
                {selectedServer && (
                    <Marker coordinates={targetCoords}>
                        <motion.circle
                            r={3}
                            fill="#00f0ff"
                            animate={{ r: [3, 8, 3], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.circle
                            r={6}
                            fill="none"
                            stroke="#00f0ff"
                            strokeWidth={1}
                            animate={{ r: [6, 12], opacity: [1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </Marker>
                )}

            </ComposableMap>

            {/* Map Overlay Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,#050510_100%)]" />
        </div>
    );
};

// Sub-component for individual attack lines
const AttackLine = ({ attack, target }) => {
    return (
        <Line
            from={attack.source}
            to={target}
            stroke={attack.color || "#ff003c"}
            strokeWidth={1}
            strokeLinecap="round"
            style={{
                filter: `drop-shadow(0 0 2px ${attack.color || "#ff003c"})`
            }}
        />
    );
};

export default MapVisualizer;
