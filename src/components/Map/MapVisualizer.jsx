import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

// Corrected Coordinates
const REGIONS = {
    "US-West": { lat: 37.77, lng: -122.41, flag: "https://flagcdn.com/w40/us.png", id: "US-West" },
    "US-East": { lat: 40.71, lng: -74.00, flag: "https://flagcdn.com/w40/us.png", id: "US-East" },
    "EU-West": { lat: 51.50, lng: -0.12, flag: "https://flagcdn.com/w40/eu.png", id: "EU-West" },
    "Asia-Pac": { lat: 35.67, lng: 139.65, flag: "https://flagcdn.com/w40/jp.png", id: "Asia-Pac" },
    "SA-East": { lat: -23.55, lng: -46.63, flag: "https://flagcdn.com/w40/br.png", id: "SA-East" },
};

// --- STATIC RESOURCES (OPTIMIZATION) ---
// Reuse Geometry and Materials instead of recreating them 60 times a second
const RACK_GEOMETRY = new THREE.BoxGeometry(2, 6, 2);
const EDGE_GEOMETRY = new THREE.EdgesGeometry(RACK_GEOMETRY);
const EDGE_MATERIAL = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.4, linewidth: 2 });

const MapVisualizer = ({ selectedServer, attacks = [] }) => {
    const globeEl = useRef();
    const [serverObjects, setServerObjects] = useState([]);

    useEffect(() => {
        const servers = Object.values(REGIONS).map(r => ({
            ...r,
            isSelected: selectedServer === r.id
        }));
        setServerObjects(servers);
    }, [selectedServer]);

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

    // Initial Auto-rotate
    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.pointOfView({ altitude: 2.5, lat: 20, lng: 0 });
        }
    }, []);

    // Focus on selection
    useEffect(() => {
        if (selectedServer && globeEl.current && REGIONS[selectedServer]) {
            const target = REGIONS[selectedServer];
            globeEl.current.pointOfView({ lat: target.lat, lng: target.lng, altitude: 2 }, 1000);
        }
    }, [selectedServer]);

    // Extracted Object Creator (Stable function)
    const createServerObject = useCallback((d) => {
        // Material: Clone to allow individual color changes or use common one if not changing
        // Since we update color in update(), we can start with a base material instance but it needs to be unique if we want different colors per instance?
        // Actually, individual meshes need their own material if we change properties per instance, OR we use vertex colors.
        // For simplicity, new material is safer, but Geometry is reused.

        const material = new THREE.MeshLambertMaterial({
            color: d.isSelected ? 0x00f0ff : 0x444455,
            emissive: d.isSelected ? 0x00f0ff : 0x000000,
            emissiveIntensity: d.isSelected ? 0.8 : 0,
            transparent: true,
            opacity: 0.9
        });

        const mesh = new THREE.Mesh(RACK_GEOMETRY, material);

        // Add shared edges
        const line = new THREE.LineSegments(EDGE_GEOMETRY, EDGE_MATERIAL);
        mesh.add(line);

        return mesh;
    }, []);

    // Extracted Object Updater (Stable function)
    const updateServerObject = useCallback((obj, d) => {
        Object.assign(obj.position, globeEl.current.getCoords(d.lat, d.lng, 0.08));
        obj.lookAt(0, 0, 0);
        obj.rotateX(Math.PI / 2);

        const color = d.isSelected ? 0x00f0ff : 0x444455;
        const emissive = d.isSelected ? 0x00f0ff : 0x000000;
        obj.material.color.setHex(color);
        obj.material.emissive.setHex(emissive);
        obj.material.emissiveIntensity = d.isSelected ? 0.8 + Math.sin(Date.now() / 200) * 0.2 : 0; // Subtle pulse
    }, []);


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
                arcDashLength={0.9}
                arcDashGap={0.1}
                arcDashAnimateTime={1500}
                arcStroke={0.7}
                arcAltitude={0.4}
                arcCircularResolution={64}

                // Custom 3D Objects
                customLayerData={serverObjects}
                customThreeObject={createServerObject}
                customThreeObjectUpdate={updateServerObject}

                // HTML Markers
                htmlElementsData={serverObjects}
                htmlLat="lat"
                htmlLng="lng"
                htmlAltitude={0.15}
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

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,#050510_100%)] z-20" />
        </div>
    );
};

export default MapVisualizer;
