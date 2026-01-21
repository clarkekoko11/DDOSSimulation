import React, { useMemo, useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

// Corrected Coordinates
const REGIONS = {
    // Silicon Valley / Oregon Area
    "US-West": { lat: 37.77, lng: -122.41, flag: "https://flagcdn.com/w40/us.png", id: "US-West" },
    // NYC / Virginia
    "US-East": { lat: 40.71, lng: -74.00, flag: "https://flagcdn.com/w40/us.png", id: "US-East" },
    // London / Frankfurt
    "EU-West": { lat: 51.50, lng: -0.12, flag: "https://flagcdn.com/w40/eu.png", id: "EU-West" },
    // Tokyo
    "Asia-Pac": { lat: 35.67, lng: 139.65, flag: "https://flagcdn.com/w40/jp.png", id: "Asia-Pac" },
    // Sao Paulo
    "SA-East": { lat: -23.55, lng: -46.63, flag: "https://flagcdn.com/w40/br.png", id: "SA-East" },
};

const MapVisualizer = ({ selectedServer, attacks = [] }) => {
    const globeEl = useRef();
    const [serverObjects, setServerObjects] = useState([]);

    useEffect(() => {
        // Convert REGIONS to array for custom layer
        const servers = Object.values(REGIONS).map(r => ({
            ...r,
            isSelected: selectedServer === r.id
        }));
        setServerObjects(servers);
    }, [selectedServer]);

    // Prepare arcs data
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
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.pointOfView({ altitude: 2.5, lat: 20, lng: 0 });
        }
    }, []);

    useEffect(() => {
        if (selectedServer && globeEl.current && REGIONS[selectedServer]) {
            const target = REGIONS[selectedServer];
            globeEl.current.pointOfView({ lat: target.lat, lng: target.lng, altitude: 2 }, 1000);
        }
    }, [selectedServer]);

    return (
        <div className="w-full h-full bg-[#050510] relative overflow-hidden rounded-xl border border-cyber-dim shadow-[0_0_20px_rgba(0,240,255,0.1)] flex items-center justify-center">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10" />

            <Globe
                ref={globeEl}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

                // Attack Arcs
                arcsData={arcsData}
                arcColor="color"
                arcDashLength={0.9} // Longer traces
                arcDashGap={0.1} // Shorter gaps
                arcDashAnimateTime={1500} // Faster flow
                arcStroke={0.7} // Thinner, sleeker lines
                arcAltitude={0.4} // Consistent high arc
                arcCircularResolution={64} // Smoother curves
                // Custom 3D Objects (Server Racks)
                customLayerData={serverObjects}
                customThreeObject={(d) => {
                    // Create a "Server Rack" looking object (Tall Box) - Made Bigger
                    const geometry = new THREE.BoxGeometry(2, 6, 2); // Bigger dimensions

                    // Material: Black with emissive edges/properties
                    const material = new THREE.MeshLambertMaterial({
                        color: d.isSelected ? 0x00f0ff : 0x444455,
                        emissive: d.isSelected ? 0x00f0ff : 0x000000,
                        emissiveIntensity: d.isSelected ? 0.8 : 0,
                        transparent: true,
                        opacity: 0.9
                    });

                    const mesh = new THREE.Mesh(geometry, material);

                    // Add a wireframe helper or edges to make it look "techy"
                    const edges = new THREE.EdgesGeometry(geometry);
                    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.4, linewidth: 2 }));
                    mesh.add(line);

                    return mesh;
                }}
                customThreeObjectUpdate={(obj, d) => {
                    // Position
                    Object.assign(obj.position, globeEl.current.getCoords(d.lat, d.lng, 0.08)); // Altitude slightly higher

                    // Orientation: Make it stand perpendicular to the surface
                    obj.lookAt(0, 0, 0); // Point Z at center
                    obj.rotateX(Math.PI / 2); // Rotate to make Y pointing out (since Box is Y-up)

                    // Pulse/Color Update
                    const color = d.isSelected ? 0x00f0ff : 0x444455;
                    const emissive = d.isSelected ? 0x00f0ff : 0x000000;
                    obj.material.color.setHex(color);
                    obj.material.emissive.setHex(emissive);
                }}

                // HTML Markers for flags (Restored)
                htmlElementsData={serverObjects}
                htmlLat="lat"
                htmlLng="lng"
                htmlAltitude={0.15} // Slightly higher than rack
                htmlElement={d => {
                    const el = document.createElement('div');
                    el.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; pointer-events: none;">
                            <img src="${d.flag}" style="width: 24px; border-radius: 2px; box-shadow: 0 0 10px rgba(0,240,255,0.5); border: 1px solid rgba(0,240,255,0.5);">
                            <span style="color: #00f0ff; font-family: monospace; font-size: 10px; text-shadow: 0 0 4px #00f0ff; background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 4px;">${d.id}</span>
                        </div>
                    `;
                    el.style.pointerEvents = 'none';
                    return el;
                }}

                // Atmosphere
                atmosphereColor="#00f0ff"
                atmosphereAltitude={0.15}
            />

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,#050510_100%)] z-20" />
        </div>
    );
};

export default MapVisualizer;
