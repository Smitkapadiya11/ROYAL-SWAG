'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ─── SMOKE PARTICLE TYPE ───
interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

// ─── GENERATE SMOKE PARTICLES ───
function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 60 + Math.random() * 40,
    size: 20 + Math.random() * 40,
    opacity: 0.08 + Math.random() * 0.15,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 5,
  }))
}

const BEFORE_IMAGE = '/images/lungs.png'
const AFTER_IMAGE  = '/images/lung-healthy.png'

export default function LungSlider() {
  const [sliderPos, setSliderPos] = useState(72)
  const [isDragging, setIsDragging] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [particles] = useState(() => generateParticles(12))
  const [glowParticles] = useState(() => generateParticles(8))
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // ─── MOUNT + HINT ANIMATION ───
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || hasAnimated) return
    const t1 = setTimeout(() => setSliderPos(25), 1000)
    const t2 = setTimeout(() => setSliderPos(72), 2400)
    const t3 = setTimeout(() => setHasAnimated(true), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [mounted, hasAnimated])

  // ─── DRAG LOGIC ───
  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pct = Math.min(Math.max(
      ((clientX - rect.left) / rect.width) * 100, 3
    ), 97)
    setSliderPos(pct)
  }, [])

  const onMouseDown = () => setIsDragging(true)
  const onMouseUp   = () => setIsDragging(false)
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) updatePos(e.clientX)
  }, [isDragging, updatePos])
  const onTouchStart = () => setIsDragging(true)
  const onTouchEnd   = () => setIsDragging(false)
  const onTouchMove  = useCallback((e: React.TouchEvent) => {
    updatePos(e.touches[0].clientX)
  }, [updatePos])

  if (!mounted) return (
    <section style={{
      background: 'linear-gradient(180deg,#020c05,#061408)',
      minHeight: '580px',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: '100%', maxWidth: '700px', height: '400px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #0a1a0a, #152515)',
        animation: 'pulse 2s infinite'
      }} />
    </section>
  )

  const transitionStyle = isDragging
    ? 'none'
    : 'clip-path 0.5s cubic-bezier(0.25,0.46,0.45,0.94)'

  return (
    <>
      {/* ─── KEYFRAME ANIMATIONS ─── */}
      <style>{`
        @keyframes smokeRise {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: var(--op); }
          50%  { transform: translateY(-60px) translateX(10px) scale(1.4); opacity: calc(var(--op) * 0.6); }
          100% { transform: translateY(-120px) translateX(-5px) scale(1.8); opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { transform: translateY(0) scale(1); opacity: var(--op); }
          50%       { transform: translateY(-20px) scale(1.3); opacity: calc(var(--op) * 0.4); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); filter: brightness(1.15) saturate(1.8) contrast(1.1); }
          50%       { transform: scale(1.025); filter: brightness(1.3) saturate(2.0) contrast(1.15); }
        }
        @keyframes handlePulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.7), 0 0 0 0 rgba(255,255,255,0.4); }
          50%       { box-shadow: 0 4px 20px rgba(0,0,0,0.7), 0 0 0 8px rgba(255,255,255,0); }
        }
        @keyframes shimmer {
          0%   { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes greenGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(22,163,74,0.2), inset 0 0 30px rgba(22,163,74,0.05); }
          50%       { box-shadow: 0 0 60px rgba(22,163,74,0.4), inset 0 0 60px rgba(22,163,74,0.1); }
        }
        @keyframes redGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(180,20,20,0.2), inset 0 0 30px rgba(180,20,20,0.05); }
          50%       { box-shadow: 0 0 60px rgba(180,20,20,0.35), inset 0 0 60px rgba(180,20,20,0.1); }
        }
        @keyframes badgeFadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes rightBadgeFadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* ─── OUTER SECTION ─── */}
      <section style={{
        background: 'linear-gradient(180deg, #020c05 0%, #061408 50%, #020c05 100%)',
        padding: '56px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Ambient background glows */}
        <div style={{
          position:'absolute', top:'10%', left:'10%',
          width:'400px', height:'400px', borderRadius:'50%',
          background:'radial-gradient(circle,rgba(200,20,20,0.06) 0%,transparent 70%)',
          filter:'blur(60px)', pointerEvents:'none',
        }}/>
        <div style={{
          position:'absolute', top:'10%', right:'10%',
          width:'400px', height:'400px', borderRadius:'50%',
          background:'radial-gradient(circle,rgba(22,163,74,0.08) 0%,transparent 70%)',
          filter:'blur(60px)', pointerEvents:'none',
        }}/>

        {/* ─── HEADING ─── */}
        <div style={{ textAlign:'center', marginBottom:'12px',
                      animation:'fadeInUp 0.8s ease both' }}>
          <p style={{
            color:'#4ade80', fontSize:'11px', fontWeight:700,
            letterSpacing:'0.3em', textTransform:'uppercase', marginBottom:'12px'
          }}>
            The Science Behind Royal Swag
          </p>
          <h2 style={{
            color:'white', fontSize:'clamp(28px,5vw,48px)',
            fontWeight:800, fontFamily:'serif', marginBottom:'10px',
            letterSpacing:'-0.02em', lineHeight:1.1,
          }}>
            See The Difference
          </h2>
          <p style={{ color:'#6b9e7a', fontSize:'14px', maxWidth:'400px', margin:'0 auto' }}>
            Drag the slider ← → to reveal your lung transformation in 30 days
          </p>
        </div>

        {/* BEFORE / AFTER labels */}
        <div style={{
          display:'flex', justifyContent:'space-between',
          maxWidth:'700px', margin:'0 auto 10px', padding:'0 4px',
        }}>
          <span style={{ color:'#ef4444', fontSize:'11px', fontWeight:700, letterSpacing:'0.15em' }}>
            ← BEFORE
          </span>
          <span style={{ color:'#4ade80', fontSize:'11px', fontWeight:700, letterSpacing:'0.15em' }}>
            AFTER 30 DAYS →
          </span>
        </div>

        {/* ════════════════════════════════════════
            SLIDER CONTAINER
        ════════════════════════════════════════ */}
        <div
          ref={containerRef}
          style={{
            position:'relative', width:'100%', maxWidth:'700px',
            height:'clamp(280px,50vw,430px)',
            margin:'0 auto', borderRadius:'20px', overflow:'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect:'none', WebkitUserSelect:'none',
            animation:'fadeInUp 0.8s 0.2s ease both',
          }}
          onMouseDown={onMouseDown} onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp} onMouseMove={onMouseMove}
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          onTouchMove={onTouchMove}
        >

          {/* ── AFTER LAYER (healthy — bottom layer, full width) ── */}
          <div style={{
            position:'absolute', inset:0,
            background:'linear-gradient(135deg,#041a08,#0a3015,#123820)',
            animation:'greenGlow 4s ease-in-out infinite',
          }}>
            {/* Healthy green radial overlay */}
            <div style={{
              position:'absolute', inset:0, zIndex:1,
              background:'radial-gradient(ellipse at 50% 40%, rgba(22,163,74,0.12) 0%, transparent 70%)',
            }}/>
            {/* Lung image — healthy (breathing animation) */}
            <div style={{
              position:'absolute', inset:0, zIndex:2,
              animation: isDragging ? 'none' : 'breathe 4s ease-in-out infinite',
            }}>
              <Image
                src={AFTER_IMAGE}
                alt="Healthy lungs after Royal Swag"
                fill
                style={{
                  objectFit:'cover', objectPosition:'center',
                  filter:'brightness(1.25) saturate(1.9) contrast(1.1) hue-rotate(15deg)',
                }}
                draggable={false}
                priority
              />
            </div>
            {/* Green shimmer sweep effect */}
            <div style={{
              position:'absolute', top:0, bottom:0,
              width:'40%', zIndex:3,
              background:'linear-gradient(90deg,transparent,rgba(74,222,128,0.06),transparent)',
              animation:'shimmer 6s ease-in-out infinite',
            }}/>
            {/* Floating green glow particles */}
            {glowParticles.map(p => (
              <div key={`g${p.id}`} style={{
                position:'absolute',
                left:`${p.x}%`, top:`${p.y}%`,
                width:`${p.size}px`, height:`${p.size}px`,
                borderRadius:'50%',
                background:'radial-gradient(circle, rgba(74,222,128,0.4), transparent)',
                ['--op' as string]: p.opacity,
                animation:`glowPulse ${p.duration}s ${p.delay}s ease-in-out infinite`,
                zIndex:4, pointerEvents:'none',
              }}/>
            ))}
            {/* AFTER side badges */}
            <div style={{
              position:'absolute', top:16, right:16, zIndex:10,
              display:'flex', flexDirection:'column', gap:'8px', alignItems:'flex-end',
            }}>
              {[
                { icon:'💚', text:'Detoxified', delay:'0.5s' },
                { icon:'🌿', text:'Clear Airways', delay:'0.7s' },
              ].map(({ icon, text, delay }) => (
                <div key={text} style={{
                  display:'flex', alignItems:'center', gap:'6px',
                  background:'rgba(22,101,52,0.92)',
                  backdropFilter:'blur(8px)',
                  padding:'6px 12px', borderRadius:'999px',
                  border:'1px solid rgba(74,222,128,0.3)',
                  color:'white', fontSize:'12px', fontWeight:700,
                  animation:`rightBadgeFadeIn 0.5s ${delay} ease both`,
                  boxShadow:'0 4px 12px rgba(0,0,0,0.3)',
                }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
            <div style={{
              position:'absolute', bottom:60, right:16, zIndex:10,
              display:'flex', flexDirection:'column', gap:'8px', alignItems:'flex-end',
            }}>
              {[
                { icon:'⚡', text:'Full Energy', delay:'0.9s' },
                { icon:'🫁', text:'Strong Lungs', delay:'1.1s' },
              ].map(({ icon, text, delay }) => (
                <div key={text} style={{
                  display:'flex', alignItems:'center', gap:'6px',
                  background:'rgba(22,101,52,0.92)',
                  backdropFilter:'blur(8px)',
                  padding:'6px 12px', borderRadius:'999px',
                  border:'1px solid rgba(74,222,128,0.3)',
                  color:'white', fontSize:'12px', fontWeight:700,
                  animation:`rightBadgeFadeIn 0.5s ${delay} ease both`,
                  boxShadow:'0 4px 12px rgba(0,0,0,0.3)',
                }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── BEFORE LAYER (polluted — clipped to left) ── */}
          <div style={{
            position:'absolute', inset:0,
            clipPath:`inset(0 ${100 - sliderPos}% 0 0)`,
            transition: transitionStyle,
            zIndex:5,
            animation:'redGlow 3s ease-in-out infinite',
          }}>
            {/* Dark background */}
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(135deg,#1a0404,#2d0808,#1a0a0a)',
            }}/>
            {/* Lung image — damaged */}
            <Image
              src={BEFORE_IMAGE}
              alt="Polluted damaged lungs before Royal Swag"
              fill
              style={{
                objectFit:'cover', objectPosition:'center',
                filter:'grayscale(1) brightness(0.28) contrast(1.7) sepia(0.4)',
              }}
              draggable={false}
              priority
            />
            {/* Heavy dark overlay */}
            <div style={{
              position:'absolute', inset:0,
              background:'rgba(100,6,6,0.55)',
              mixBlendMode:'multiply',
            }}/>
            {/* Radial dark vignette */}
            <div style={{
              position:'absolute', inset:0,
              background:'radial-gradient(ellipse at 50% 40%, rgba(60,5,5,0.3) 0%, rgba(10,0,0,0.7) 100%)',
            }}/>
            {/* ── SMOKE PARTICLE ANIMATIONS ── */}
            {particles.map(p => (
              <div key={`s${p.id}`} style={{
                position:'absolute',
                left:`${p.x}%`, top:`${p.y}%`,
                width:`${p.size}px`, height:`${p.size}px`,
                borderRadius:'50%',
                background:'radial-gradient(circle, rgba(180,120,80,0.3), transparent)',
                ['--op' as string]: p.opacity,
                animation:`smokeRise ${p.duration}s ${p.delay}s ease-out infinite`,
                zIndex:8, pointerEvents:'none',
              }}/>
            ))}
            {/* BEFORE side badges */}
            <div style={{
              position:'absolute', top:16, left:16, zIndex:10,
              display:'flex', flexDirection:'column', gap:'8px',
            }}>
              {[
                { icon:'🚬', text:'Smoking', delay:'0s' },
                { icon:'🏭', text:'Air Pollution', delay:'0.15s' },
              ].map(({ icon, text, delay }) => (
                <div key={text} style={{
                  display:'flex', alignItems:'center', gap:'6px',
                  background:'rgba(0,0,0,0.82)',
                  backdropFilter:'blur(8px)',
                  padding:'6px 12px', borderRadius:'999px',
                  border:'1px solid rgba(255,80,80,0.2)',
                  color:'white', fontSize:'12px', fontWeight:700,
                  animation:`badgeFadeIn 0.5s ${delay} ease both`,
                  boxShadow:'0 4px 12px rgba(0,0,0,0.4)',
                }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
            <div style={{
              position:'absolute', bottom:60, left:16, zIndex:10,
              display:'flex', flexDirection:'column', gap:'8px',
            }}>
              {[
                { icon:'😮‍💨', text:'Poor Breathing', delay:'0.3s' },
                { icon:'😴', text:'Low Energy', delay:'0.45s' },
              ].map(({ icon, text, delay }) => (
                <div key={text} style={{
                  display:'flex', alignItems:'center', gap:'6px',
                  background:'rgba(0,0,0,0.82)',
                  backdropFilter:'blur(8px)',
                  padding:'6px 12px', borderRadius:'999px',
                  border:'1px solid rgba(255,80,80,0.2)',
                  color:'white', fontSize:'12px', fontWeight:700,
                  animation:`badgeFadeIn 0.5s ${delay} ease both`,
                  boxShadow:'0 4px 12px rgba(0,0,0,0.4)',
                }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── DIVIDER LINE ── */}
          <div style={{
            position:'absolute', top:0, bottom:0, zIndex:11,
            left:`${sliderPos}%`,
            transform:'translateX(-50%)',
            width:'2px',
            background:'linear-gradient(180deg, transparent, rgba(255,255,255,0.9), transparent)',
            transition: transitionStyle,
            pointerEvents:'none',
          }}/>

          {/* ── LIGHT RAY effect at divider ── */}
          <div style={{
            position:'absolute', top:0, bottom:0, zIndex:10,
            left:`${sliderPos}%`,
            transform:'translateX(-50%)',
            width:'30px',
            background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
            transition: transitionStyle,
            pointerEvents:'none',
          }}/>

          {/* ── SLIDER HANDLE ── */}
          <div style={{
            position:'absolute', top:'50%', zIndex:20,
            left:`${sliderPos}%`,
            transform:'translate(-50%, -50%)',
            transition: transitionStyle,
            display:'flex', alignItems:'center', justifyContent:'center',
            width:'52px', height:'52px',
          }}>
            {/* Outer pulse ring */}
            <div style={{
              position:'absolute',
              width:'52px', height:'52px', borderRadius:'50%',
              background:'rgba(255,255,255,0.15)',
              animation: isDragging ? 'none' : 'handlePulse 2s ease-in-out infinite',
            }}/>
            {/* Main circle */}
            <div style={{
              width:'44px', height:'44px', borderRadius:'50%',
              background:'white',
              boxShadow:'0 4px 24px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.5)',
              display:'flex', alignItems:'center', justifyContent:'center',
              zIndex:1,
              transform: isDragging ? 'scale(1.1)' : 'scale(1)',
              transition:'transform 0.15s ease',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 5L2 12L9 19" stroke="#15803d" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 5L22 12L15 19" stroke="#15803d" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* ── BOTTOM DRAG HINT ── */}
          <div style={{
            position:'absolute', bottom:14, left:0, right:0,
            display:'flex', justifyContent:'center', zIndex:12,
            pointerEvents:'none',
          }}>
            <div style={{
              display:'flex', alignItems:'center', gap:'8px',
              background:'rgba(0,0,0,0.7)',
              backdropFilter:'blur(10px)',
              padding:'6px 16px', borderRadius:'999px',
              border:'1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ color:'#ef4444', fontSize:'11px', fontWeight:700 }}>● BEFORE</span>
              <span style={{ color:'#9ca3af', fontSize:'10px' }}>← drag →</span>
              <span style={{ color:'#4ade80', fontSize:'11px', fontWeight:700 }}>AFTER ●</span>
            </div>
          </div>

        </div>
        {/* ════════ END SLIDER CONTAINER ════════ */}

        {/* ─── HERB PILLS ─── */}
        <div style={{
          display:'flex', flexWrap:'wrap', justifyContent:'center',
          gap:'12px', marginTop:'32px',
          animation:'fadeInUp 0.8s 0.4s ease both',
        }}>
          {[
            { emoji:'🌿', name:'Tulsi',   benefit:'Antibacterial' },
            { emoji:'🍃', name:'Vasaka',  benefit:'Clears Toxins' },
            { emoji:'🌱', name:'Mulethi', benefit:'Repairs Lining' },
            { emoji:'🫚', name:'Pippali', benefit:'Lung Strength' },
          ].map(({ emoji, name, benefit }) => (
            <div key={name} style={{
              display:'flex', alignItems:'center', gap:'10px',
              background:'rgba(22,101,52,0.25)',
              border:'1px solid rgba(74,222,128,0.15)',
              backdropFilter:'blur(4px)',
              padding:'10px 16px', borderRadius:'999px',
            }}>
              <span style={{ fontSize:'18px' }}>{emoji}</span>
              <div>
                <p style={{ color:'white', fontWeight:700, fontSize:'13px', lineHeight:1.2 }}>
                  {name}
                </p>
                <p style={{ color:'#4ade80', fontSize:'10px' }}>{benefit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── CTA ─── */}
        <div style={{
          textAlign:'center', marginTop:'28px',
          animation:'fadeInUp 0.8s 0.6s ease both',
        }}>
          <p style={{ color:'#4b7a59', fontSize:'13px', marginBottom:'14px' }}>
            Trusted by 5000+ customers across India
          </p>
          <Link
            href="/product"
            style={{
              display:'inline-block',
              background:'linear-gradient(135deg, #16a34a, #15803d)',
              color:'white', fontWeight:800,
              padding:'18px 48px', borderRadius:'14px',
              fontSize:'18px', textDecoration:'none',
              boxShadow:'0 8px 32px rgba(22,163,74,0.45)',
              letterSpacing:'0.01em',
              transition:'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 14px 40px rgba(22,163,74,0.55)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(22,163,74,0.45)'
            }}
          >
            Start Your 30-Day Lung Detox — Rs 359 →
          </Link>
          <p style={{ color:'#2d5a3d', fontSize:'12px', marginTop:'12px' }}>
            🔒 Secure Payment &nbsp;|&nbsp; 🚚 Free Delivery &nbsp;|&nbsp; ↩️ 30-Day Guarantee
          </p>
        </div>
      </section>
    </>
  )
}
