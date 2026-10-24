import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { HandLandmarks, Landmark, HAND_CONNECTIONS } from '../types/signLanguage';

/**
 * Computer Vision Hand Tracking Engine
 * Manages MediaPipe Hand Landmarker, video stream processing, and canvas rendering.
 */

export class HandDetectorService {
  private handLandmarker: HandLandmarker | null = null;
  private isInitializing: boolean = false;
  private lastVideoTime: number = -1;

  public async initialize(): Promise<boolean> {
    if (this.handLandmarker) return true;
    if (this.isInitializing) return false;

    this.isInitializing = true;
    try {
      // Load MediaPipe WASM binaries from reliable CDN
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      console.log('MediaPipe HandLandmarker initialized successfully');
      this.isInitializing = false;
      return true;
    } catch (err) {
      console.warn('Failed to initialize MediaPipe with GPU, attempting CPU fallback:', err);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        this.isInitializing = false;
        return true;
      } catch (fallbackErr) {
        console.error('MediaPipe initialization failed completely:', fallbackErr);
        this.isInitializing = false;
        return false;
      }
    }
  }

  public isReady(): boolean {
    return this.handLandmarker !== null;
  }

  /**
   * Process a single video frame and return detected hand landmarks
   */
  public detect(videoElement: HTMLVideoElement, timestampMs: number): HandLandmarks[] {
    if (!this.handLandmarker || !videoElement || videoElement.readyState < 2) {
      return [];
    }

    if (videoElement.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = videoElement.currentTime;
      try {
        const result = this.handLandmarker.detectForVideo(videoElement, timestampMs);
        if (result && result.landmarks && result.landmarks.length > 0) {
          return result.landmarks as HandLandmarks[];
        }
      } catch (e) {
        // Handle dropped frames gracefully
      }
    }

    return [];
  }

  /**
   * Render high-tech biometric bone skeleton, nodes, and bounding box onto the canvas
   */
  public renderLandmarks(
    ctx: CanvasRenderingContext2D,
    landmarks: HandLandmarks,
    canvasWidth: number,
    canvasHeight: number,
    options: {
      showBones?: boolean;
      showJoints?: boolean;
      showBoundingBox?: boolean;
      showCoordinates?: boolean;
      activeLabel?: string;
      confidence?: number;
    } = {}
  ): void {
    const {
      showBones = true,
      showJoints = true,
      showBoundingBox = true,
      activeLabel,
      confidence
    } = options;

    if (!landmarks || landmarks.length < 21) return;

    // Calculate bounding box
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const lm of landmarks) {
      const px = lm.x * canvasWidth;
      const py = lm.y * canvasHeight;
      if (px < minX) minX = px;
      if (py < minY) minY = py;
      if (px > maxX) maxX = px;
      if (py > maxY) maxY = py;
    }

    // Add padding to bounding box
    const pad = 24;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(canvasWidth, maxX + pad);
    maxY = Math.min(canvasHeight, maxY + pad);

    // 1. Draw Biometric Skeleton (Bones)
    if (showBones) {
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Connect each bone
      for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
        const p1 = landmarks[startIdx];
        const p2 = landmarks[endIdx];

        // Cyan-to-emerald gradient for futuristic biometric HUD
        const x1 = p1.x * canvasWidth;
        const y1 = p1.y * canvasHeight;
        const x2 = p2.x * canvasWidth;
        const y2 = p2.y * canvasHeight;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, '#06B6D4'); // Cyan-500
        grad.addColorStop(1, '#10B981'); // Emerald-500

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    // 2. Draw Landmark Joints
    if (showJoints) {
      for (let i = 0; i < landmarks.length; i++) {
        const lm = landmarks[i];
        const x = lm.x * canvasWidth;
        const y = lm.y * canvasHeight;

        // Fingertips (4, 8, 12, 16, 20) have larger glowing radar rings
        const isFingertip = [4, 8, 12, 16, 20].includes(i);
        const isWrist = i === 0;

        ctx.beginPath();
        if (isFingertip) {
          // Outer halo
          ctx.arc(x, y, 7, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
          ctx.fill();

          // Core node
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = '#22D3EE'; // Cyan-400
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (isWrist) {
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#F59E0B'; // Amber origin node
          ctx.fill();
        } else {
          ctx.arc(x, y, 3.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#E2E8F0';
          ctx.fill();
          ctx.strokeStyle = '#0284C7';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 3. Draw Cybernetic Corner Brackets & Tag HUD
    if (showBoundingBox) {
      const cornerLen = 18;
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 2;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(minX, minY + cornerLen);
      ctx.lineTo(minX, minY);
      ctx.lineTo(minX + cornerLen, minY);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(maxX - cornerLen, minY);
      ctx.lineTo(maxX, minY);
      ctx.lineTo(maxX, minY + cornerLen);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(minX, maxY - cornerLen);
      ctx.lineTo(minX, maxY);
      ctx.lineTo(minX + cornerLen, maxY);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(maxX - cornerLen, maxY);
      ctx.lineTo(maxX, maxY);
      ctx.lineTo(maxX, maxY - cornerLen);
      ctx.stroke();

      // Tag HUD above bounding box
      if (activeLabel && activeLabel !== 'None') {
        const hudText = `ASL: ${activeLabel} · ${(confidence ? Math.round(confidence * 100) : 95)}%`;
        ctx.font = '600 12px "JetBrains Mono", monospace';
        const textMetrics = ctx.measureText(hudText);
        const tagW = textMetrics.width + 16;
        const tagH = 22;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(minX, Math.max(4, minY - tagH - 4), tagW, tagH);

        ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(minX, Math.max(4, minY - tagH - 4), tagW, tagH);

        ctx.fillStyle = '#22D3EE';
        ctx.fillText(hudText, minX + 8, Math.max(4, minY - tagH - 4) + 15);
      }
    }
  }

  /**
   * Generates synthetic ASL hand landmarks for instant testing without a camera
   */
  public generateSyntheticLandmarks(signLabel: string): HandLandmarks {
    // Generate base wrist at center bottom
    const baseX = 0.5;
    const baseY = 0.65;
    const landmarks: Landmark[] = [];

    // 0: Wrist
    landmarks.push({ x: baseX, y: baseY, z: 0 });

    // Thumb (1, 2, 3, 4)
    // Index (5, 6, 7, 8)
    // Middle (9, 10, 11, 12)
    // Ring (13, 14, 15, 16)
    // Pinky (17, 18, 19, 20)
    const isL = signLabel === 'L';
    const isV = signLabel === 'V';
    const isILY = signLabel === 'I LOVE YOU';
    const isY = signLabel === 'Y';
    const isB = signLabel === 'B' || signLabel === 'HELLO';
    const isThree = signLabel === '3';
    const isPinkyOnly = signLabel === 'I';

    // Helper to build a finger
    const makeFinger = (
      mcpX: number,
      mcpY: number,
      isExtended: boolean,
      angleRad: number = -Math.PI / 2,
      spreadX: number = 0
    ) => {
      landmarks.push({ x: mcpX, y: mcpY, z: 0 });
      const segLen = 0.055;
      if (isExtended) {
        landmarks.push({ x: mcpX + Math.cos(angleRad) * segLen + spreadX * 0.3, y: mcpY + Math.sin(angleRad) * segLen, z: 0 });
        landmarks.push({ x: mcpX + Math.cos(angleRad) * segLen * 2 + spreadX * 0.6, y: mcpY + Math.sin(angleRad) * segLen * 2, z: 0 });
        landmarks.push({ x: mcpX + Math.cos(angleRad) * segLen * 3 + spreadX, y: mcpY + Math.sin(angleRad) * segLen * 3, z: 0 });
      } else {
        // Curled down toward palm
        landmarks.push({ x: mcpX, y: mcpY - 0.02, z: -0.02 });
        landmarks.push({ x: mcpX, y: mcpY + 0.03, z: -0.04 });
        landmarks.push({ x: mcpX, y: mcpY + 0.06, z: -0.05 });
      }
    };

    // Thumb
    const thumbExt = isL || isILY || isY || isThree || isB;
    landmarks.push({ x: baseX - 0.04, y: baseY - 0.03, z: 0 });
    landmarks.push({ x: baseX - (thumbExt ? 0.14 : 0.06), y: baseY - (thumbExt ? 0.09 : 0.12), z: 0 });
    landmarks.push({ x: baseX - (thumbExt ? 0.19 : 0.04), y: baseY - (thumbExt ? 0.10 : 0.14), z: 0 });

    // Index
    const indexExt = isL || isV || isILY || isB || isThree || signLabel === '1' || signLabel === 'D';
    makeFinger(baseX - 0.04, baseY - 0.14, indexExt, -Math.PI / 2, isV ? -0.04 : 0);

    // Middle
    const middleExt = isV || isB || isThree || signLabel === '2';
    makeFinger(baseX, baseY - 0.15, middleExt, -Math.PI / 2, isV ? 0.04 : 0);

    // Ring
    const ringExt = isB;
    makeFinger(baseX + 0.04, baseY - 0.14, ringExt, -Math.PI / 2);

    // Pinky
    const pinkyExt = isILY || isY || isB || isPinkyOnly;
    makeFinger(baseX + 0.08, baseY - 0.12, pinkyExt, -Math.PI / 2, isY || isILY ? 0.05 : 0);

    return landmarks;
  }
}

export const handDetector = new HandDetectorService();
