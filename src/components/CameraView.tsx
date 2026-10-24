import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Camera,
  VideoOff,
  FlipHorizontal,
  Layers,
  Sparkles,
  Maximize2,
  RefreshCw,
  PlayCircle
} from 'lucide-react';
import { handDetector } from '../services/handDetector';
import { aslClassifier } from '../services/gestureClassifier';
import { HandLandmarks, GesturePrediction, VisionTelemetry } from '../types/signLanguage';

interface CameraViewProps {
  onPrediction: (pred: GesturePrediction, landmarks: HandLandmarks) => void;
  onTelemetryUpdate: (telemetry: VisionTelemetry) => void;
  activeTargetSign?: string | null;
  onCaptureFrame?: (base64Image: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  onPrediction,
  onTelemetryUpdate,
  activeTargetSign,
  onCaptureFrame,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMirrored, setIsMirrored] = useState<boolean>(true);
  const [showBones, setShowBones] = useState<boolean>(true);
  const [showJoints, setShowJoints] = useState<boolean>(true);
  const [showBoundingBox, setShowBoundingBox] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [selectedDemoSign, setSelectedDemoSign] = useState<string>('L');
  const [fps, setFps] = useState<number>(0);

  const animFrameId = useRef<number | null>(null);
  const lastFrameTime = useRef<number>(performance.now());
  const frameCount = useRef<number>(0);
  const fpsTimer = useRef<number>(performance.now());

  // Initialize MediaPipe and Webcam
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      await handDetector.initialize();

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setStreamActive(true);
          setDemoMode(false);
        };
      }
    } catch (err: any) {
      console.warn('Webcam permission error or camera not found:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. You can use the Interactive ASL Simulator mode below to test computer vision recognition.'
          : 'No camera detected or permission unavailable. Switched to Interactive ASL Simulator mode.'
      );
      // Fallback to interactive demo mode
      setDemoMode(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  }, []);

  // Main Detection Loop
  useEffect(() => {
    let isRunning = true;

    const processFrame = () => {
      if (!isRunning) return;

      const now = performance.now();
      const delta = now - lastFrameTime.current;
      lastFrameTime.current = now;

      // Update FPS counter every 500ms
      frameCount.current++;
      if (now - fpsTimer.current >= 500) {
        const calculatedFps = Math.round((frameCount.current * 1000) / (now - fpsTimer.current));
        setFps(calculatedFps);
        frameCount.current = 0;
        fpsTimer.current = now;
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (canvas && ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let detectedLandmarks: HandLandmarks[] = [];

        if (demoMode) {
          // In Demo Simulator Mode, synthesize the selected sign landmarks with slight natural breathing jitter
          const signToSimulate = activeTargetSign || selectedDemoSign;
          const synthetic = handDetector.generateSyntheticLandmarks(signToSimulate);
          // Apply slight organic micro-motion
          const timeOffset = Math.sin(now / 400) * 0.003;
          const jittered = synthetic.map((lm, idx) => ({
            ...lm,
            x: lm.x + (idx === 8 || idx === 4 ? timeOffset : 0),
            y: lm.y + (idx === 8 || idx === 12 ? -timeOffset : 0),
          }));
          detectedLandmarks = [jittered];
        } else if (videoRef.current && videoRef.current.readyState >= 2) {
          // Detect using MediaPipe
          detectedLandmarks = handDetector.detect(videoRef.current, now);
        }

        if (detectedLandmarks.length > 0) {
          const primaryHand = detectedLandmarks[0];
          const inferenceStart = performance.now();

          // 1. Predict gesture with ASL Classifier
          const prediction = aslClassifier.predict(primaryHand);
          const inferenceTime = performance.now() - inferenceStart;

          // 2. Render Biometric Skeleton & Bounding Box
          handDetector.renderLandmarks(ctx, primaryHand, canvas.width, canvas.height, {
            showBones,
            showJoints,
            showBoundingBox,
            activeLabel: prediction.label,
            confidence: prediction.confidence,
          });

          // 3. Dispatch prediction & telemetry
          onPrediction(prediction, primaryHand);
          const telemetry = aslClassifier.extractTelemetry(primaryHand, inferenceTime, fps);
          onTelemetryUpdate(telemetry);
        } else {
          onPrediction({ label: 'None', confidence: 0, category: 'alphabet' }, []);
          onTelemetryUpdate({
            fps,
            handsDetected: 0,
            handScore: 0,
            handedness: 'Unknown',
            palmFacing: 'Camera',
            inferenceTimeMs: 0,
            fingerExtensions: [0, 0, 0, 0, 0],
            jointAngles: { thumbMcp: 0, indexPip: 0, middlePip: 0, ringPip: 0, pinkyPip: 0 },
          });
        }
      }

      animFrameId.current = requestAnimationFrame(processFrame);
    };

    animFrameId.current = requestAnimationFrame(processFrame);

    return () => {
      isRunning = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [demoMode, selectedDemoSign, activeTargetSign, showBones, showJoints, showBoundingBox, fps, onPrediction, onTelemetryUpdate]);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Capture frame helper
  const handleCaptureSnapshot = () => {
    if (!onCaptureFrame) return;

    const canvas = document.createElement('canvas');
    if (demoMode) {
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = '#22d3ee';
        ctx.font = '24px sans-serif';
        ctx.fillText(`ASL Demo Sign: ${selectedDemoSign}`, 40, 60);
        onCaptureFrame(canvas.toDataURL('image/jpeg', 0.85));
      }
    } else if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        onCaptureFrame(canvas.toDataURL('image/jpeg', 0.85));
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col relative shadow-xl">
      {/* Top Console Bar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">VISION STAGE</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-cyan-400">
            {demoMode ? 'SIMULATOR MODE' : streamActive ? 'LIVE WEBCAM' : 'INITIALIZING'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-slate-400">{fps} FPS</span>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            title="Toggle Mirror View"
            className={`p-1.5 rounded-lg border transition-colors ${
              isMirrored
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowBones(!showBones)}
            title="Toggle Skeleton Bones"
            className={`p-1.5 rounded-lg border transition-colors ${
              showBones
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowJoints(!showJoints)}
            title="Toggle Landmark Nodes"
            className={`p-1.5 rounded-lg border transition-colors ${
              showJoints
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowBoundingBox(!showBoundingBox)}
            title="Toggle Bounding Box"
            className={`p-1.5 rounded-lg border transition-colors ${
              showBoundingBox
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {streamActive ? (
            <button
              onClick={stopCamera}
              title="Stop Camera"
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-rose-400 hover:bg-slate-700 transition-colors"
            >
              <VideoOff className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={startCamera}
              title="Start Camera"
              className="p-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative aspect-4/3 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-transform ${
            isMirrored ? 'scale-x-[-1]' : ''
          } ${demoMode ? 'opacity-20' : 'opacity-100'}`}
        />

        {/* Demo Simulator Background Grid */}
        {demoMode && (
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
        )}

        {/* Tracking Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
            isMirrored && !demoMode ? 'scale-x-[-1]' : ''
          }`}
        />

        {/* Error notification banner if camera blocked */}
        {cameraError && !demoMode && (
          <div className="absolute top-4 inset-x-4 bg-slate-900/95 border border-amber-500/40 p-3 rounded-xl text-xs text-amber-200 backdrop-blur-md flex items-center justify-between z-20">
            <span>{cameraError}</span>
            <button
              onClick={() => setDemoMode(true)}
              className="ml-3 px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg hover:bg-amber-500/30 whitespace-nowrap"
            >
              Switch to Simulator
            </button>
          </div>
        )}

        {/* Target Sign Silhouette Guide (when user is in practice mode) */}
        {activeTargetSign && (
          <div className="absolute top-4 right-4 bg-slate-900/90 border border-cyan-500/40 rounded-xl px-3.5 py-2 text-xs backdrop-blur-md z-10 flex items-center gap-2">
            <span className="text-slate-400">Target ASL Sign:</span>
            <span className="font-bold text-cyan-400 text-sm font-mono">{activeTargetSign}</span>
          </div>
        )}

        {/* Camera Off / Fallback Overlay */}
        {!streamActive && !demoMode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90 text-center p-6 z-10">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Camera Feed Paused</p>
              <p className="text-xs text-slate-500 mt-1">
                Enable webcam to start real-time ASL recognition or switch to simulator.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Start Webcam
              </button>
              <button
                onClick={() => setDemoMode(true)}
                className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-medium rounded-lg hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Use ASL Simulator
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Simulator Switch Strip (Allows instant testing with 1 click) */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (demoMode) {
                setDemoMode(false);
                startCamera();
              } else {
                setDemoMode(true);
              }
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              demoMode
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            {demoMode ? '● Running Simulator' : 'Switch to ASL Simulator'}
          </button>

          {demoMode && (
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {['A', 'B', 'C', 'D', 'L', 'V', 'Y', 'ILY', '3', '5'].map((sign) => {
                const label = sign === 'ILY' ? 'I LOVE YOU' : sign;
                const isSelected = (activeTargetSign || selectedDemoSign) === label;
                return (
                  <button
                    key={sign}
                    onClick={() => setSelectedDemoSign(label)}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {sign}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {onCaptureFrame && (
          <button
            onClick={handleCaptureSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors ml-auto"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Capture for AI Analysis</span>
          </button>
        )}
      </div>
    </div>
  );
};
