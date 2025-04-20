'use client'

import { useGLTF, Html } from "@react-three/drei";
import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export function Model(props) {
  const { scene } = useGLTF("/cake_3d.glb");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (scene) {
      setIsLoading(false); // Model selesai dimuat
    }
  }, [scene]);

  return (
    <>
      {isLoading && (
        <Html center>
          <div style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>
            Loading 3D Model...
          </div>
        </Html>
      )}
      <primitive object={scene} {...props} />
    </>
  );
}

export default function Cake() {
  return (
    <div style={{ position: "relative", width: "100%", height: "700px" }}>
      <Canvas 
        camera={{ position: [48, 48, 72], fov: 50 }} 
        gl={{ alpha: true }} 
        style={{ background: 'none' }}
      >
        {/* Add Lights */}
        <ambientLight intensity={0.5} /> {/* Soft general light */}
        <directionalLight position={[10, 10, 5]} intensity={1} /> {/* Strong light from the top */}

        <Suspense fallback={
          <Html center>
            <div className="text-xl sm:text-2xl font-semibold">
              Loading...
            </div>
          </Html>
        }>
          <Model scale={6} position={[0, 20, 0]} rotation={[0, 0, 0]} />
          <OrbitControls enableZoom={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}