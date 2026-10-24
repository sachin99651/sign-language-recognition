/**
 * Sign Language Recognition System Types & Data Definitions
 */

export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export type HandLandmarks = Landmark[]; // 21 landmarks per hand

export interface NormalizedFeatures {
  coords: number[]; // 63 normalized coordinates (x, y, z centered at wrist and scaled)
  angles: number[]; // Joint flexion angles in degrees
  extensions: number[]; // 5 finger extension ratios (0 = curled, 1 = fully extended)
  distances: number[]; // Relative keypoint distances
}

export interface GesturePrediction {
  label: string;
  confidence: number; // 0 to 1
  category: 'alphabet' | 'number' | 'phrase' | 'custom';
  description?: string;
  isDynamic?: boolean;
}

export interface SignDefinition {
  id: string;
  label: string;
  category: 'alphabet' | 'number' | 'phrase';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string[];
  mnemonic?: string;
  commonMistakes?: string[];
  fingerStatus: {
    thumb: 'extended' | 'tucked' | 'across' | 'curled' | 'opposing';
    index: 'extended' | 'curled' | 'half' | 'crossed';
    middle: 'extended' | 'curled' | 'half' | 'crossed';
    ring: 'extended' | 'curled' | 'half';
    pinky: 'extended' | 'curled' | 'half';
  };
  sampleLandmarks?: Landmark[]; // Representative landmark wireframe
}

export interface CustomDatasetSample {
  id: string;
  label: string;
  features: NormalizedFeatures;
  timestamp: number;
}

export interface CustomTrainedModel {
  name: string;
  classes: string[];
  sampleCount: number;
  trainedAt: string;
  centroids: { [label: string]: number[] }; // Mean feature vector per class
  k: number;
}

export interface VisionTelemetry {
  fps: number;
  handsDetected: number;
  handScore: number;
  handedness: 'Right' | 'Left' | 'Unknown';
  palmFacing: 'Camera' | 'Self' | 'Side' | 'Up' | 'Down';
  inferenceTimeMs: number;
  fingerExtensions: [number, number, number, number, number]; // Thumb, Index, Middle, Ring, Pinky
  jointAngles: {
    thumbMcp: number;
    indexPip: number;
    middlePip: number;
    ringPip: number;
    pinkyPip: number;
  };
}

// MediaPipe 21 Hand Landmark Indices
export const HAND_CONNECTIONS: [number, number][] = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm base connection
  [5, 9], [9, 13], [13, 17]
];

export const LANDMARK_NAMES = [
  'Wrist',
  'Thumb CMC', 'Thumb MCP', 'Thumb IP', 'Thumb Tip',
  'Index MCP', 'Index PIP', 'Index DIP', 'Index Tip',
  'Middle MCP', 'Middle PIP', 'Middle DIP', 'Middle Tip',
  'Ring MCP', 'Ring PIP', 'Ring DIP', 'Ring Tip',
  'Pinky MCP', 'Pinky PIP', 'Pinky DIP', 'Pinky Tip'
];
