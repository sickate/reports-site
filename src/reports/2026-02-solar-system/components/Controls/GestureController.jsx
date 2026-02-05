import { useEffect, useRef, useState } from 'react';
import { useGestureStore } from '../../hooks/useGestureStore';

// MediaPipe hand landmark indices
const WRIST = 0;
const THUMB_TIP = 4;
const INDEX_TIP = 8;
const MIDDLE_MCP = 9;
const MIDDLE_TIP = 12;
const RING_TIP = 16;
const PINKY_TIP = 20;

// Hand landmark connections for drawing
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17],             // Palm
];

export function GestureController({ enabled = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isRunningRef = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gestureStatus, setGestureStatus] = useState('none'); // none, rotate, pan, zoom

  // Get store actions
  const updatePinchZoom = useGestureStore((state) => state.updatePinchZoom);
  const endPinch = useGestureStore((state) => state.endPinch);
  const updateRotation = useGestureStore((state) => state.updateRotation);
  const endRotation = useGestureStore((state) => state.endRotation);
  const updatePan = useGestureStore((state) => state.updatePan);
  const endPan = useGestureStore((state) => state.endPan);
  const setHands = useGestureStore((state) => state.setHands);
  const setCameraEnabled = useGestureStore((state) => state.setCameraEnabled);
  const setCameraError = useGestureStore((state) => state.setCameraError);

  // Calculate distance between two landmarks
  const getDistance = (p1, p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Check if hand is in pinch gesture (thumb + index close)
  const isPinchingGesture = (landmarks) => {
    const distance = getDistance(landmarks[THUMB_TIP], landmarks[INDEX_TIP]);
    return distance < 0.08;
  };

  // Check if hand is open (all fingers extended)
  const isOpenHand = (landmarks) => {
    // Check if fingertips are above their MCP joints (extended)
    const wrist = landmarks[WRIST];
    const middleTip = landmarks[MIDDLE_TIP];
    const indexTip = landmarks[INDEX_TIP];
    const ringTip = landmarks[RING_TIP];
    const pinkyTip = landmarks[PINKY_TIP];

    // For an open hand, fingertips should be far from wrist
    const middleDist = getDistance(wrist, middleTip);
    const indexDist = getDistance(wrist, indexTip);
    const ringDist = getDistance(wrist, ringTip);
    const pinkyDist = getDistance(wrist, pinkyTip);

    // All fingers should be extended (distance > threshold)
    return middleDist > 0.25 && indexDist > 0.2 && ringDist > 0.2 && pinkyDist > 0.15;
  };

  // Calculate hand rotation angle (wrist to middle finger direction)
  const getHandAngle = (landmarks) => {
    const wrist = landmarks[WRIST];
    const middleMcp = landmarks[MIDDLE_MCP];
    return Math.atan2(middleMcp.y - wrist.y, middleMcp.x - wrist.x);
  };

  // Get pinch center position (for pan gesture)
  const getPinchCenter = (landmarks) => {
    const thumb = landmarks[THUMB_TIP];
    const index = landmarks[INDEX_TIP];
    return {
      x: (thumb.x + index.x) / 2,
      y: (thumb.y + index.y) / 2,
    };
  };

  // Draw hand landmarks on canvas
  const drawHandLandmarks = (ctx, landmarks, gestureType) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    // Color based on gesture type
    let color = '#ffcc00'; // Default yellow
    if (gestureType === 'pinch') color = '#00ff00';      // Green for pinch
    else if (gestureType === 'rotate') color = '#00ccff'; // Cyan for rotate
    else if (gestureType === 'zoom') color = '#ff00ff';   // Magenta for two-hand zoom

    // Draw connections
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (const [start, end] of HAND_CONNECTIONS) {
      const p1 = landmarks[start];
      const p2 = landmarks[end];
      ctx.beginPath();
      ctx.moveTo(p1.x * w, p1.y * h);
      ctx.lineTo(p2.x * w, p2.y * h);
      ctx.stroke();
    }

    // Draw landmarks
    for (let i = 0; i < landmarks.length; i++) {
      const landmark = landmarks[i];
      const isFingerTip = [4, 8, 12, 16, 20].includes(i);

      ctx.beginPath();
      ctx.arc(landmark.x * w, landmark.y * h, isFingerTip ? 6 : 3, 0, 2 * Math.PI);
      ctx.fillStyle = isFingerTip ? color : '#ffffff';
      ctx.fill();
    }

    // Draw gesture indicator
    if (gestureType === 'pinch' || gestureType === 'zoom') {
      const thumb = landmarks[THUMB_TIP];
      const index = landmarks[INDEX_TIP];
      const midX = ((thumb.x + index.x) / 2) * w;
      const midY = ((thumb.y + index.y) / 2) * h;

      ctx.beginPath();
      ctx.arc(midX, midY, 12, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (gestureType === 'rotate') {
      // Draw rotation arc indicator
      const wrist = landmarks[WRIST];
      const angle = getHandAngle(landmarks);

      ctx.beginPath();
      ctx.arc(wrist.x * w, wrist.y * h, 20, angle - 0.5, angle + 0.5);
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Arrow head
      const arrowX = wrist.x * w + Math.cos(angle) * 25;
      const arrowY = wrist.y * h + Math.sin(angle) * 25;
      ctx.beginPath();
      ctx.arc(arrowX, arrowY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  };

  // Initialize MediaPipe and start detection
  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;

    const initAndStart = async () => {
      try {
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

        if (!isMounted) {
          handLandmarker.close();
          return;
        }

        handLandmarkerRef.current = handLandmarker;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraEnabled(true);
          setIsLoading(false);

          if (canvasRef.current) {
            canvasRef.current.width = 320;
            canvasRef.current.height = 240;
          }

          isRunningRef.current = true;
          runDetectionLoop();
        }
      } catch (err) {
        console.error('Failed to initialize gesture tracking:', err);
        if (isMounted) {
          setError(err.name === 'NotAllowedError'
            ? 'Camera access denied'
            : 'Failed to initialize');
          setCameraError(err.message);
          setIsLoading(false);
        }
      }
    };

    const runDetectionLoop = () => {
      if (!isRunningRef.current) return;

      const handLandmarker = handLandmarkerRef.current;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!handLandmarker || !video || video.readyState < 2) {
        animationFrameRef.current = requestAnimationFrame(runDetectionLoop);
        return;
      }

      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      const results = handLandmarker.detectForVideo(video, performance.now());
      const numHands = results.landmarks?.length || 0;

      if (numHands === 0) {
        // No hands detected
        setGestureStatus('none');
        setHands(null, null);
        endPinch();
        endRotation();
        endPan();
      } else if (numHands === 1) {
        // Single hand - check for rotation or pan gesture
        const landmarks = results.landmarks[0];
        const pinching = isPinchingGesture(landmarks);
        const open = isOpenHand(landmarks);

        // Determine hand side
        const handedness = results.handednesses[0][0].categoryName;
        if (handedness === 'Left') {
          setHands(landmarks, null);
        } else {
          setHands(null, landmarks);
        }

        // End two-hand zoom
        endPinch();

        if (pinching) {
          // Single hand pinch = pan gesture
          const center = getPinchCenter(landmarks);
          updatePan(center.x, center.y);
          endRotation();
          setGestureStatus('pan');

          if (ctx) drawHandLandmarks(ctx, landmarks, 'pinch');
        } else if (open) {
          // Open hand = rotation gesture
          const angle = getHandAngle(landmarks);
          updateRotation(angle);
          endPan();
          setGestureStatus('rotate');

          if (ctx) drawHandLandmarks(ctx, landmarks, 'rotate');
        } else {
          // No recognized gesture
          endRotation();
          endPan();
          setGestureStatus('none');

          if (ctx) drawHandLandmarks(ctx, landmarks, 'none');
        }
      } else {
        // Two hands - check for pinch zoom
        const hand1 = results.landmarks[0];
        const hand2 = results.landmarks[1];
        const hand1Pinching = isPinchingGesture(hand1);
        const hand2Pinching = isPinchingGesture(hand2);

        const leftIdx = results.handednesses.findIndex((h) => h[0].categoryName === 'Left');
        const rightIdx = results.handednesses.findIndex((h) => h[0].categoryName === 'Right');
        setHands(
          leftIdx >= 0 ? results.landmarks[leftIdx] : null,
          rightIdx >= 0 ? results.landmarks[rightIdx] : null
        );

        // End single hand gestures
        endRotation();
        endPan();

        if (hand1Pinching && hand2Pinching) {
          // Two-hand pinch = zoom
          const pinch1 = hand1[INDEX_TIP];
          const pinch2 = hand2[INDEX_TIP];
          const distance = getDistance(pinch1, pinch2) * 1000;

          updatePinchZoom(distance);
          setGestureStatus('zoom');

          if (ctx) {
            drawHandLandmarks(ctx, hand1, 'zoom');
            drawHandLandmarks(ctx, hand2, 'zoom');
          }
        } else {
          endPinch();
          setGestureStatus('none');

          if (ctx) {
            drawHandLandmarks(ctx, hand1, hand1Pinching ? 'pinch' : 'none');
            drawHandLandmarks(ctx, hand2, hand2Pinching ? 'pinch' : 'none');
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(runDetectionLoop);
    };

    initAndStart();

    return () => {
      isMounted = false;
      isRunningRef.current = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
        handLandmarkerRef.current = null;
      }

      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [enabled, setCameraEnabled, setCameraError, setHands, updatePinchZoom, endPinch,
      updateRotation, endRotation, updatePan, endPan]);

  if (!enabled) return null;

  // Gesture status emoji and label
  const statusDisplay = {
    none: { emoji: '👋', label: '' },
    rotate: { emoji: '🔄', label: 'Rotate' },
    pan: { emoji: '✋', label: 'Pan' },
    zoom: { emoji: '🤲', label: 'Zoom' },
  };

  const { emoji, label } = statusDisplay[gestureStatus] || statusDisplay.none;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative w-40 h-30 rounded-lg overflow-hidden shadow-lg border border-white/20">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Gesture status indicator */}
        {!isLoading && !error && (
          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-xs text-white/90 flex items-center gap-1">
            <span>{emoji}</span>
            {label && <span className="text-[10px]">{label}</span>}
          </div>
        )}

        {/* Loading overlay */}
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

      {/* Gesture hint */}
      <div className="mt-1 text-[10px] text-white/50 text-center">
        ✋ Open = Rotate · 🤏 Pinch = Pan · 🤲 Both = Zoom
      </div>
    </div>
  );
}
