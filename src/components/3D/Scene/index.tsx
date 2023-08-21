import { Canvas } from '@react-three/fiber'
import { MeshReflectorMaterial, PresentationControls, Stage } from '@react-three/drei'
import React, { Suspense } from 'react'

const Scene = ({ children }: { children: React.ReactNode }) => {
  return (
    <Canvas>
      <color attach='background' args={['#101010']} />
      <fog attach='fog' args={['#101010', 1, 20]} />

      <PresentationControls speed={1.2} global zoom={0.5} polar={[-0.2, Math.PI / 4]}>
        <Stage environment={'city'} intensity={0.6} contactShadow={false}>
          <Suspense fallback={null}>{children}</Suspense>
        </Stage>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
          <planeGeometry args={[170, 170]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={45}
            roughness={1}
            depthScale={1.3}
            minDepthThreshold={0.3}
            maxDepthThreshold={1.5}
            color='#101010'
            metalness={0.6}
          />
        </mesh>
      </PresentationControls>
    </Canvas>
  )
}

export default Scene
