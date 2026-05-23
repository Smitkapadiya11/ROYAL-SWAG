"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import { trackEvent } from '../lib/events';

const SectionWrapper = styled.section`
  background: #F4EDD6;
  padding: 80px 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #495738;
`;

const Headline = styled.h2`
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 40px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  width: 100%;
  
  @media (max-width: 992px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 16px;
    padding-bottom: 20px;
    margin: 0 -20px;
    padding-left: 20px;
    padding-right: 20px;
    width: calc(100% + 40px);
    
    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`;

const CardContainer = styled.div`
  background: #495738;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  aspect-ratio: 9/16;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 992px) {
    min-width: 260px;
    scroll-snap-align: center;
  }
`;

const PlayIconOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F4EDD6;
  font-size: 24px;
  z-index: 2;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: translate(-50%, -50%) scale(1.1);
    background: rgba(255, 255, 255, 0.3);
  }
`;

const InfoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 40px 20px 20px;
  background: linear-gradient(transparent, rgba(73, 87, 56, 0.85));
  color: #F4EDD6;
  z-index: 3;
  pointer-events: none;
`;

const DocName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 4px 0;
`;

const DocSpec = styled.p`
  font-size: 12px;
  color: #9A6F1A;
  margin: 0 0 8px 0;
`;

const DocCaption = styled.p`
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ComingSoonOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #1A2A1A;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9A6F1A;
  font-weight: bold;
  font-size: 18px;
  z-index: 2;
`;

const doctors = [
  {
    id: 1,
    name: 'Dr. R. Sharma',
    age: 42,
    specialty: 'Pulmonologist',
    video: '/videos/doctor1.mp4',
    thumbnail: '/images/doctors/doctor1-thumb.jpg',
    quote: 'I see 30 patients a day with pollution-related asthma. This is the only natural remedy I recommend alongside medication.'
  },
  {
    id: 2,
    name: 'Dr. N. Patel',
    age: 55,
    specialty: 'Ayurvedic Practitioner',
    video: '/videos/doctor2.mp4',
    thumbnail: '/images/doctors/doctor2-thumb.jpg',
    quote: 'The combination of Pushkarmool and Vasaka is legendary. Exactly what modern city lungs need.'
  },
  {
    id: 3,
    name: 'Dr. A. Gupta',
    age: 38,
    specialty: 'General Physician',
    video: '/videos/doctor3.mp4',
    thumbnail: '/images/doctors/doctor3-thumb.jpg',
    quote: 'Smokers constantly ask for a magic pill. This detox tea is the closest thing to lung repair that actually works.'
  }
];

export default function VideoSection() {
  const [activeVideo, setActiveVideo] = useState(null);

  const handleVideoClick = (doctor) => {
    trackEvent('video_play', { doctor: doctor.name });
    setActiveVideo(doctor.video);
  };

  return (
    <SectionWrapper id="video-testimonials">
      <Headline>Hear them in their own words.</Headline>
      
      <Grid>
        {doctors.map((doctor) => {
          // Since the videos actually exist now, we don't necessarily need the coming soon
          // But I'll leave the logic just in case it doesn't load.
          const hasVideo = !!doctor.video;

          return (
            <CardContainer key={doctor.id} onClick={() => hasVideo && handleVideoClick(doctor)}>
              {/* Thumbnail image (fallback to solid color via CSS if not found, but we will use styled div for now) */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundImage: `url(${doctor.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#1A2A1A'
              }} />

              {hasVideo ? (
                <PlayIconOverlay>▶</PlayIconOverlay>
              ) : (
                <ComingSoonOverlay>Video Coming Soon</ComingSoonOverlay>
              )}
              
              <InfoOverlay>
                <DocName>{doctor.name}, {doctor.age}</DocName>
                <DocSpec>{doctor.specialty}</DocSpec>
                <DocCaption>"{doctor.quote}"</DocCaption>
              </InfoOverlay>
            </CardContainer>
          );
        })}
      </Grid>
      
      {activeVideo && (
        <div 
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', 
            zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setActiveVideo(null)}
        >
          <div style={{width:'min(400px,90vw)',aspectRatio:'9/16',position:'relative'}} onClick={e=>e.stopPropagation()}>
            <video 
              src={activeVideo} 
              controls 
              autoPlay 
              playsInline 
              style={{width:'100%',height:'100%',borderRadius:16,objectFit:'cover'}} 
            />
            <button 
              onClick={() => setActiveVideo(null)} 
              style={{
                position: 'absolute', top: -40, right: 0, 
                background: 'transparent', border: 'none', color: 'white', 
                fontSize: 28, cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
