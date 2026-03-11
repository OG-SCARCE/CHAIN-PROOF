import React, { useEffect, useRef } from 'react';
import './ReflectiveCard.css';

interface ReflectiveCardProps {
  children?: React.ReactNode;
  blurStrength?: number;
  color?: string;
  metalness?: number;
  overlayColor?: string;
  grayscale?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ReflectiveCard: React.FC<ReflectiveCardProps> = ({
  children,
  blurStrength = 12,
  color = 'white',
  metalness = 1,
  overlayColor = 'rgba(255, 255, 255, 0.1)',
  grayscale = 1,
  className = '',
  style = {}
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Webcam access denied or unavailable. Reflective effects will not show webcam feed.', err);
      }
    };

    startWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation,
  } as React.CSSProperties;

  return (
    <div className={`reflective-card-container ${className}`} style={{ ...style, ...cssVariables }}>
      {/* Remove heavy SVG filters causing jagged edge bug. */}
      {/* We apply a clean translucent blur using CSS instead. */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="reflective-video" 
        style={{ 
          filter: `blur(8px) grayscale(${grayscale}) opacity(0.5)`, 
          transform: 'scale(1.1)', // scaling slightly avoids blurred edges showing the background
          opacity: metalness 
        }} 
      />
      
      <div className="reflective-content">
        {children}
      </div>
    </div>
  );
};

export default ReflectiveCard;
