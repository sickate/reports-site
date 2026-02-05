import { useEffect, useRef, useState, useCallback } from 'react';
import { useGestureStore } from '../../hooks/useGestureStore';

// MediaPipe hand landmark indices
const THUMB_TIP = 4;
const INDEX_TIP = 8;

export function GestureController({ enabled = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    setCameraEnabled,
    setCameraError,
    updatePinchZoom,
    startPinch,
    endPinch,
    setHands,
  } = useGestureStore();

  // Calculate distance between thumb and index finger
  const getPinchDistance = useCallback((landmarks) => {
    const thumb = landmarks[THUMB_TIP];
    const index = landmarks[INDEX_TIP];
    const dx = thumb.x - index.x;
    const dy = thumb.y - index.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Check if hand is in pinch gesture
  const isPinching = useCallback((landmarks) => {
    const distance = getPinchDistance(landmarks);
    return distance < 0.08; // Threshold for pinch detection
  }, [getPinchDistance]);

  // Initialize MediaPipe
  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;

    const initMediaPipe = async () => {
      try {
        // Dynamic import to avoid loading on mobile
        const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          numHands: 2,
          runningMode: 'VIDEO',
        });

        if (isMounted) {
          handLandmarkerRef.current = handLandmarker;
          await startCamera();
        }
      } catch (err) {
        console.error('Failed to initialize MediaPipe:', err);
        if (isMounted) {
          setError('Failed to initialize hand tracking');
          setCameraError(err.message);
        }
      }
    };

    initMediaPipe();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
    };
  }, [enabled]);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraEnabled(true);
        setIsLoading(false);
        detectHands();
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setError('Camera access denied. Using mouse/touch controls.');
      setCameraError(err.message);
      setIsLoading(false);
    }
  };

  // Hand detection loop
  const detectHands = useCallback(() => {
    if (!handLandmarkerRef.current || !videoRef.current) return;

    const video = videoRef.current;
    if (video.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(detectHands);
      return;
    }

    const results = handLandmarkerRef.current.detectForVideo(video, performance.now());

    if (results.landmarks && results.landmarks.length > 0) {
      const leftHand = results.handednesses.findIndex((h) => h[0].categoryName === 'Left');
      const rightHand = results.handednesses.findIndex((h) => h[0].categoryName === 'Right');

      setHands(
        leftHand >= 0 ? results.landmarks[leftHand] : null,
        rightHand >= 0 ? results.landmarks[rightHand] : null
      );

      // Two-hand pinch zoom
      if (results.landmarks.length >= 2) {
        const hand1Pinching = isPinching(results.landmarks[0]);
        const hand2Pinching = isPinching(results.landmarks[1]);

        if (hand1Pinching && hand2Pinching) {
          // Calculate distance between the two pinch points
          const pinch1 = results.landmarks[0][INDEX_TIP];
          const pinch2 = results.landmarks[1][INDEX_TIP];
          const dx = pinch1.x - pinch2.x;
          const dy = pinch1.y - pinch2.y;
          const distance = Math.sqrt(dx * dx + dy * dy) * 1000; // Scale for usability

          updatePinchZoom(distance);
        } else {
          endPinch();
        }
      } else {
        endPinch();
      }
    } else {
      setHands(null, null);
      endPinch();
    }

    animationFrameRef.current = requestAnimationFrame(detectHands);
  }, [isPinching, updatePinchZoom, startPinch, endPinch, setHands]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Video preview */}
      <div className="relative w-40 h-30 rounded-lg overflow-hidden shadow-lg border border-white/20">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }} // Mirror
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

        {/* Status overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs">
            Loading...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 text-white text-xs p-2 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
