import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Hero3DCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const width = container.clientWidth || 500
    const height = container.clientHeight || 500

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 24

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Master Group for 3D rotation & mouse tilt
    const masterGroup = new THREE.Group()
    scene.add(masterGroup)

    // ── 1. Inner Core: Glowing Wireframe Icosahedron ─────────────
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 1)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    masterGroup.add(coreMesh)

    // Second inner geo for depth
    const innerGeo = new THREE.OctahedronGeometry(2.6, 0)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    masterGroup.add(innerMesh)

    // ── 2. Particle Constellation Cloud ──────────────────────────
    const particleCount = 280
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const color1 = new THREE.Color('#10b981') // Emerald
    const color2 = new THREE.Color('#06b6d4') // Cyan
    const color3 = new THREE.Color('#f59e0b') // Amber

    for (let i = 0; i < particleCount; i++) {
      // Distribute in a spherical shell with slight dispersion
      const radius = 5.5 + Math.random() * 3.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Random color assignment
      const rColor = Math.random() < 0.5 ? color1 : Math.random() < 0.8 ? color2 : color3
      colors[i * 3] = rColor.r
      colors[i * 3 + 1] = rColor.g
      colors[i * 3 + 2] = rColor.b
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    masterGroup.add(particles)

    // ── 3. Orbital Rings with Angle Offsets ────────────────────────
    const createRing = (radius, tiltX, tiltY, colorHex, opacity) => {
      const ringGeo = new THREE.BufferGeometry()
      const segments = 120
      const ringPos = new Float32Array((segments + 1) * 3)
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2
        ringPos[i * 3] = Math.cos(theta) * radius
        ringPos[i * 3 + 1] = Math.sin(theta) * radius
        ringPos[i * 3 + 2] = 0
      }
      ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3))
      const ringMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity,
      })
      const ringMesh = new THREE.Line(ringGeo, ringMat)
      ringMesh.rotation.x = tiltX
      ringMesh.rotation.y = tiltY
      return ringMesh
    }

    const ring1 = createRing(8.2, Math.PI / 3, Math.PI / 6, 0x10b981, 0.45)
    const ring2 = createRing(9.5, -Math.PI / 4, Math.PI / 3, 0x06b6d4, 0.35)
    const ring3 = createRing(7.2, Math.PI / 2.2, -Math.PI / 4, 0xf59e0b, 0.4)
    masterGroup.add(ring1)
    masterGroup.add(ring2)
    masterGroup.add(ring3)

    // ── 4. Floating Stream Anchor Spheres ─────────────────────────
    const streams = [
      { name: 'Ayurveda', angle: 0, r: 8.2, color: 0x10b981, ring: ring1 },
      { name: 'Yoga', angle: Math.PI * 0.66, r: 8.2, color: 0x06b6d4, ring: ring1 },
      { name: 'Unani', angle: Math.PI * 1.33, r: 8.2, color: 0xf59e0b, ring: ring1 },
      { name: 'Siddha', angle: Math.PI * 0.33, r: 9.5, color: 0x10b981, ring: ring2 },
      { name: 'Homeopathy', angle: Math.PI, r: 9.5, color: 0x8b5cf6, ring: ring2 },
      { name: 'Clinical R&D', angle: Math.PI * 1.66, r: 9.5, color: 0x06b6d4, ring: ring2 },
    ]

    const streamMeshes = streams.map((s) => {
      const sGeo = new THREE.SphereGeometry(0.35, 16, 16)
      const sMat = new THREE.MeshBasicMaterial({ color: s.color })
      const mesh = new THREE.Mesh(sGeo, sMat)
      s.ring.add(mesh)
      mesh.position.set(Math.cos(s.angle) * s.r, Math.sin(s.angle) * s.r, 0)
      return mesh
    })

    // ── 5. Mouse Interaction & Parallax ───────────────────────────
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      targetX = x * 1.2
      targetY = y * 1.2
    }

    container.addEventListener('mousemove', handleMouseMove)

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animId
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const elapsedTime = clock.getElapsedTime()

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05
      mouseY += (targetY - mouseY) * 0.05

      // Continuous rotation
      masterGroup.rotation.y = elapsedTime * 0.18 + mouseX * 0.8
      masterGroup.rotation.x = Math.sin(elapsedTime * 0.12) * 0.15 - mouseY * 0.8

      // Internal counters
      coreMesh.rotation.y = -elapsedTime * 0.25
      coreMesh.rotation.x = elapsedTime * 0.15
      innerMesh.rotation.y = elapsedTime * 0.4
      innerMesh.rotation.z = -elapsedTime * 0.2

      ring1.rotation.z = elapsedTime * 0.25
      ring2.rotation.z = -elapsedTime * 0.2
      ring3.rotation.z = elapsedTime * 0.15

      // Subtle pulse on particles
      const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.03
      particles.scale.set(scale, scale, scale)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)

      // Clean disposal
      coreGeo.dispose()
      coreMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[520px] flex items-center justify-center">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Holographic 3D Glass Cards (CSS 3D perspective layers) */}
      <div className="absolute top-8 left-0 sm:left-4 z-10 pointer-events-none animate-float-slow">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-3.5 shadow-2xl shadow-emerald-950/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
            94%
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Precision Skill Match
            </div>
            <div className="text-xs font-bold text-white">Ayurvedic Clinical Consultant</div>
            <div className="text-[10px] text-slate-400">Himalaya Wellness · Shortlisted</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-0 sm:right-4 z-10 pointer-events-none animate-float-slow" style={{ animationDelay: '-2.5s' }}>
        <div className="bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-3.5 shadow-2xl shadow-cyan-950/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs">
            R&D
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
              Faculty Collaboration
            </div>
            <div className="text-xs font-bold text-white">₹25,00,000 Industry Grant</div>
            <div className="text-[10px] text-slate-400">Phyto-Extraction · Dabur Research</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-6 sm:left-12 z-10 pointer-events-none hidden sm:block animate-float-slow" style={{ animationDelay: '-4s' }}>
        <div className="bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-xl px-3 py-2 shadow-xl shadow-black/60 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-amber-200">
            CTRI & NAMSTP Protocol Standardized
          </span>
        </div>
      </div>
    </div>
  )
}
