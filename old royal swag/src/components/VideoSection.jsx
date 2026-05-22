"use client";
import React, { useState, useEffect, useRef } from 'react';
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
  background: #2A3020;
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

const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background: #000;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  color: white;
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
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: #F4EDD6;
  z-index: 3;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.9);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.$isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  z-index: 100001;
`;

const ModalVideoWrapper = styled.div`
  width: 100%;
  max-width: 450px;
  aspect-ratio: 9/16;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const videosData = [
  {
    id: 1,
    name: 'Dr. R. Sharma',
    spec: 'Pulmonologist',
    age: 42,
    caption: 'I see 30 patients a day with pollution-related asthma. This is the only natural remedy I recommend alongside inhalers.',
    videoSrc: '/videos/asset13.mp4',
    poster: '/images/poster1.jpg'
  },
  {
    id: 2,
    name: 'Dr. N. Patel',
    spec: 'Ayurvedic Practitioner',
    age: 55,
    caption: 'The combination of Pushkarmool and Vasaka is legendary. It\'s exactly what modern city lungs need to clear out toxins.',
    videoSrc: '/videos/asset14.mp4',
    poster: '/images/poster2.jpg'
  },
  {
    id: 3,
    name: 'Dr. A. Gupta',
    spec: 'General Physician',
    age: 38,
    caption: 'Smokers constantly ask me for a magic pill. There isn\'t one, but this detox tea is the closest thing to lung repair I\'ve seen.',
    videoSrc: '/videos/asset15.mp4',
    poster: '/images/poster3.jpg'
  }
];

const VideoCard = ({ data, onOpenModal }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (videoRef.current && window.innerWidth > 992) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current && window.innerWidth > 992) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <CardContainer 
      ref={ref} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenModal(data)}
    >
      <VideoWrapper>
        {isInView && (
          <video 
            ref={videoRef}
            src={data.videoSrc}
            poster={data.poster}
            muted 
            loop 
            playsInline
          />
        )}
      </VideoWrapper>
      <PlayIconOverlay>▶</PlayIconOverlay>
      <InfoOverlay>
        <DocName>{data.name}, {data.age}</DocName>
        <DocSpec>{data.spec}</DocSpec>
        <DocCaption>"{data.caption}"</DocCaption>
      </InfoOverlay>
    </CardContainer>
  );
};

export default function VideoSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const modalVideoRef = useRef(null);

  const openModal = (videoData) => {
    trackEvent('video_play', { doctor: videoData.name });
    setActiveVideo(videoData);
    setModalOpen(true);
  };

  const closeModal = (e) => {
    if (e.target === e.currentTarget || e.target.tagName === 'BUTTON') {
      setModalOpen(false);
      setTimeout(() => setActiveVideo(null), 300);
    }
  };

  useEffect(() => {
    if (modalOpen && modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {});
    }
  }, [modalOpen, activeVideo]);

  return (
    <SectionWrapper id="video-testimonials">
      <Headline>Hear them in their own words.</Headline>
      
      <Grid>
        {videosData.map((data) => (
          <VideoCard key={data.id} data={data} onOpenModal={openModal} />
        ))}
      </Grid>
      
      <ModalOverlay $isOpen={modalOpen} onClick={closeModal}>
        <CloseButton onClick={closeModal}>×</CloseButton>
        <ModalVideoWrapper>
          {activeVideo && (
            <video 
              ref={modalVideoRef}
              src={activeVideo.videoSrc} 
              controls 
              playsInline 
            />
          )}
        </ModalVideoWrapper>
      </ModalOverlay>
    </SectionWrapper>
  );
}
