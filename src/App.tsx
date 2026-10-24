/**
 * SignSense ASL - American Sign Language Recognition System
 * Powered by Computer Vision & Machine Learning Models
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { CameraView } from './components/CameraView';
import { RecognitionPanel } from './components/RecognitionPanel';
import { SentenceBuilder } from './components/SentenceBuilder';
import { PracticeMode } from './components/PracticeMode';
import { SignDictionary } from './components/SignDictionary';
import { CustomTrainer } from './components/CustomTrainer';
import { ModelTelemetryModal } from './components/ModelTelemetryModal';
import {
  GesturePrediction,
  HandLandmarks,
  VisionTelemetry,
  SignDefinition
} from './types/signLanguage';
import { Sparkles, X, CheckCircle, Lightbulb } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'live' | 'dictionary' | 'practice' | 'trainer'>('live');
  const [currentPrediction, setCurrentPrediction] = useState<GesturePrediction>({
    label: 'None',
    confidence: 0,
    category: 'alphabet'
  });
  const [currentLandmarks, setCurrentLandmarks] = useState<HandLandmarks>([]);
  const [telemetry, setTelemetry] = useState<VisionTelemetry>({
    fps: 0,
    handsDetected: 0,
    handScore: 0,
    handedness: 'Unknown',
    palmFacing: 'Camera',
    inferenceTimeMs: 0,
    fingerExtensions: [0, 0, 0, 0, 0],
    jointAngles: { thumbMcp: 0, indexPip: 0, middlePip: 0, ringPip: 0, pinkyPip: 0 }
  });

  const [sentence, setSentence] = useState<string>('');
  const [recentSigns, setRecentSigns] = useState<string[]>([]);
  const [activeTargetSign, setActiveTargetSign] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [autoCommitEnabled, setAutoCommitEnabled] = useState<boolean>(true);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState<boolean>(false);

  // Gemini AI Analysis State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Hold-to-commit ref
  const currentHoldSign = useRef<string | null>(null);
  const holdStartTime = useRef<number>(0);
  const lastCommittedSign = useRef<string | null>(null);

  const handleCommitSign = useCallback((label: string) => {
    if (!label || label === 'None') return;

    setSentence((prev) => {
      // If it's a single letter, append directly (e.g. A-P-P-L-E)
      // If it's a full word/phrase like "HELLO", append with space
      const isWord = label.length > 1;
      if (prev.length === 0) return label;
      if (isWord) {
        return prev.endsWith(' ') ? prev + label : prev + ' ' + label;
      } else {
        return prev + label;
      }
    });

    setRecentSigns((prev) => {
      const next = [...prev, label];
      return next.slice(-20);
    });

    lastCommittedSign.current = label;
  }, []);

  // Auto-commit gesture when held steady for ~750ms
  const handlePrediction = useCallback(
    (pred: GesturePrediction, landmarks: HandLandmarks) => {
      setCurrentPrediction(pred);
      setCurrentLandmarks(landmarks);

      if (!autoCommitEnabled) {
        setHoldProgress(0);
        return;
      }

      if (pred.label !== 'None' && pred.confidence >= 0.75) {
        const now = Date.now();
        if (currentHoldSign.current === pred.label) {
          const elapsed = now - holdStartTime.current;
          const targetHoldTime = 800; // ms
          const progress = Math.min(100, Math.round((elapsed / targetHoldTime) * 100));
          setHoldProgress(progress);

          if (elapsed >= targetHoldTime) {
            // Commit if different from immediate previous commit or if held continuously past debounce
            if (lastCommittedSign.current !== pred.label) {
              handleCommitSign(pred.label);
            }
            holdStartTime.current = now + 400; // debounce before repeating
            setHoldProgress(0);
          }
        } else {
          currentHoldSign.current = pred.label;
          holdStartTime.current = now;
          setHoldProgress(5);
        }
      } else {
        currentHoldSign.current = null;
        setHoldProgress(0);
        lastCommittedSign.current = null;
      }
    },
    [autoCommitEnabled, handleCommitSign]
  );

  const handleTelemetryUpdate = useCallback((t: VisionTelemetry) => {
    setTelemetry(t);
  }, []);

  // Keyboard shortcut listener for quick space and backspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setSentence((prev) => (prev.length > 0 && !prev.endsWith(' ') ? prev + ' ' : prev));
      } else if (e.code === 'Backspace') {
        e.preventDefault();
        setSentence((prev) => prev.slice(0, -1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handler to select a sign from dictionary and practice it
  const handleSelectSignForPractice = (sign: SignDefinition) => {
    setActiveTargetSign(sign.label);
    setActiveTab('practice');
  };

  // Call server-side Gemini endpoint for contextual translation and verification
  const handleAnalyzeWithGemini = async (imageOverride?: string) => {
    setIsAiAnalyzing(true);
    setAiAnalysisResult(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageOverride || capturedImage,
          recognizedLabels: recentSigns.slice(-8),
          currentTranscript: sentence,
          mode: 'asl-translation',
          context: 'American Sign Language translation and grammar polish',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAiAnalysisResult(data);
        if (data.sentenceSuggestion) {
          // If suggestion received, offer to replace or update
        }
      } else {
        console.warn('Gemini analysis failed:', data.error);
      }
    } catch (err) {
      console.error('Error invoking Gemini endpoint:', err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleCaptureFrame = (base64Img: string) => {
    setCapturedImage(base64Img);
    handleAnalyzeWithGemini(base64Img);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        fps={telemetry.fps}
      />

      {/* Main Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* VIEW 1: LIVE RECOGNITION STUDIO */}
        {activeTab === 'live' && (
          <div className="flex flex-col gap-6">
            {/* Split Screen 2-Column Desktop Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Viewport: Camera & Computer Vision Stage (7 cols) */}
              <div className="lg:col-span-7 flex flex-col">
                <CameraView
                  onPrediction={handlePrediction}
                  onTelemetryUpdate={handleTelemetryUpdate}
                  activeTargetSign={activeTargetSign}
                  onCaptureFrame={handleCaptureFrame}
                />
              </div>

              {/* Right Viewport: ASL Recognition & Anatomy Panel (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <RecognitionPanel
                  prediction={currentPrediction}
                  telemetry={telemetry}
                  onCommitSign={handleCommitSign}
                  holdProgress={holdProgress}
                />

                {/* Auto-commit switch and tips */}
                <div className="mt-4 p-3 bg-slate-900/60 border border-slate-800/60 rounded-xl flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-300">Auto-Commit on Hold:</span>
                    <span className="text-slate-500">
                      {autoCommitEnabled ? 'Active (800ms)' : 'Manual Spacebar Only'}
                    </span>
                  </div>
                  <button
                    onClick={() => setAutoCommitEnabled(!autoCommitEnabled)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                      autoCommitEnabled
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {autoCommitEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Full-Width Sentence Builder & Transcription */}
            <SentenceBuilder
              sentence={sentence}
              setSentence={setSentence}
              recentSigns={recentSigns}
              onAnalyzeWithGemini={() => handleAnalyzeWithGemini()}
              isAiAnalyzing={isAiAnalyzing}
            />
          </div>
        )}

        {/* VIEW 2: ASL DICTIONARY */}
        {activeTab === 'dictionary' && (
          <SignDictionary onSelectSignForPractice={handleSelectSignForPractice} />
        )}

        {/* VIEW 3: INTERACTIVE PRACTICE DRILL */}
        {activeTab === 'practice' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <CameraView
                onPrediction={handlePrediction}
                onTelemetryUpdate={handleTelemetryUpdate}
                activeTargetSign={activeTargetSign}
              />
            </div>
            <div className="lg:col-span-6">
              <PracticeMode
                currentPrediction={currentPrediction}
                onSetTargetSign={setActiveTargetSign}
              />
            </div>
          </div>
        )}

        {/* VIEW 4: CUSTOM MACHINE LEARNING TRAINER */}
        {activeTab === 'trainer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <CameraView
                onPrediction={handlePrediction}
                onTelemetryUpdate={handleTelemetryUpdate}
                activeTargetSign={activeTargetSign}
              />
            </div>
            <div className="lg:col-span-6">
              <CustomTrainer currentLandmarks={currentLandmarks} />
            </div>
          </div>
        )}
      </main>

      {/* AI Interpretation Drawer / Result Modal */}
      {aiAnalysisResult && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setAiAnalysisResult(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-mono p-1"
            >
              [ESC / ✕]
            </button>

            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI Sign Language Analysis</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">
              {aiAnalysisResult.translation || 'Interpreted Sign'}
            </h3>

            {aiAnalysisResult.sentenceSuggestion && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
                <span className="text-[11px] font-mono uppercase text-slate-500 block mb-1">
                  Natural English Phrasing:
                </span>
                <p className="text-sm font-semibold text-cyan-300">
                  "{aiAnalysisResult.sentenceSuggestion}"
                </p>
                <button
                  onClick={() => {
                    setSentence(aiAnalysisResult.sentenceSuggestion);
                    setAiAnalysisResult(null);
                  }}
                  className="mt-3 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-medium transition-colors"
                >
                  Adopt as Sentence
                </button>
              </div>
            )}

            {aiAnalysisResult.detailedFeedback && (
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {aiAnalysisResult.detailedFeedback}
              </p>
            )}

            {aiAnalysisResult.tips && aiAnalysisResult.tips.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200 mb-4 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-300 mb-0.5">Form Coaching Tip:</strong>
                  <span>{aiAnalysisResult.tips[0]}</span>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setAiAnalysisResult(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deep Vision Telemetry Diagnostics Modal */}
      <ModelTelemetryModal
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        landmarks={currentLandmarks}
        telemetry={telemetry}
      />
    </div>
  );
}
