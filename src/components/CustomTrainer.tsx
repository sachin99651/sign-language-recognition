import React, { useState, useEffect } from 'react';
import { customTrainer } from '../services/customModelTrainer';
import { HandLandmarks, NormalizedFeatures } from '../types/signLanguage';
import { aslClassifier } from '../services/gestureClassifier';
import { Cpu, Plus, Trash2, Download, Upload, Check, Play, AlertCircle } from 'lucide-react';

interface CustomTrainerProps {
  currentLandmarks: HandLandmarks;
}

export const CustomTrainer: React.FC<CustomTrainerProps> = ({ currentLandmarks }) => {
  const [newClassName, setNewClassName] = useState('');
  const [classes, setClasses] = useState<string[]>([]);
  const [sampleCounts, setSampleCounts] = useState<{ [label: string]: number }>({});
  const [isRecording, setIsRecording] = useState<string | null>(null);
  const [trainedModelInfo, setTrainedModelInfo] = useState<string | null>(null);
  const [customPrediction, setCustomPrediction] = useState<{ label: string; confidence: number } | null>(null);

  // Refresh counts on mount and updates
  const refreshStats = () => {
    setClasses(customTrainer.getClasses());
    setSampleCounts(customTrainer.getSamplesByLabel());
  };

  useEffect(() => {
    refreshStats();
  }, []);

  // Live recording stream
  useEffect(() => {
    if (!isRecording) return;
    if (!currentLandmarks || currentLandmarks.length < 21) return;

    const interval = setInterval(() => {
      const features = aslClassifier.normalizeLandmarks(currentLandmarks);
      if (features.coords && features.coords.length > 0) {
        customTrainer.addSample(isRecording, features);
        refreshStats();
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isRecording, currentLandmarks]);

  // Live test against custom trained model
  useEffect(() => {
    if (!currentLandmarks || currentLandmarks.length < 21) {
      setCustomPrediction(null);
      return;
    }
    const features = aslClassifier.normalizeLandmarks(currentLandmarks);
    const pred = customTrainer.predict(features);
    setCustomPrediction(pred);
  }, [currentLandmarks]);

  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    const name = newClassName.trim().toUpperCase();
    if (!classes.includes(name)) {
      setClasses([...classes, name]);
      setSampleCounts({ ...sampleCounts, [name]: 0 });
    }
    setNewClassName('');
  };

  const handleRemoveClass = (label: string) => {
    customTrainer.removeClass(label);
    refreshStats();
  };

  const handleTrain = () => {
    const model = customTrainer.trainModel();
    if (model) {
      setTrainedModelInfo(
        `Model successfully trained on ${model.sampleCount} samples across ${model.classes.length} classes.`
      );
    } else {
      setTrainedModelInfo('Need at least 2 distinct classes with recorded samples to train a model.');
    }
  };

  const handleExport = () => {
    const dataStr = customTrainer.exportDatasetJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asl_custom_model_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const ok = customTrainer.importDatasetJSON(text);
      if (ok) {
        refreshStats();
        setTrainedModelInfo('Dataset and trained model imported successfully.');
      } else {
        alert('Invalid dataset JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (confirm('Clear all custom recorded dataset samples and trained weights?')) {
      customTrainer.clearAllSamples();
      refreshStats();
      setTrainedModelInfo(null);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Custom ASL Machine Learning Trainer</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>In-Browser k-NN Classifier</span>
            <span aria-hidden="true">·</span>
            <span>Spatial Feature Vectors</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Inference</span>
          </div>
        </div>

        {/* Dataset Export / Import Actions */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={handleExport}
            disabled={customTrainer.getSampleCount() === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium rounded-lg transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleClearAll}
            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
            title="Reset All Dataset"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add New Class Form */}
      <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <input
          type="text"
          placeholder="Enter new ASL sign name (e.g. COFFEE, MOM, DAD)..."
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
          className="flex-1 bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={handleAddClass}
          disabled={!newClassName.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors disabled:opacity-40"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Sign Class</span>
        </button>
      </div>

      {/* Class List & Sample Recorders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Trained Classes ({classes.length})</span>
          <span>Hold "Record Samples" while performing sign</span>
        </div>

        {classes.length === 0 ? (
          <div className="text-center py-8 bg-slate-950 rounded-xl border border-slate-850 text-slate-500 text-xs">
            No custom sign classes yet. Add a class above to start collecting training data!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {classes.map((cls) => {
              const count = sampleCounts[cls] || 0;
              const isCurrentlyRecording = isRecording === cls;

              return (
                <div
                  key={cls}
                  className={`bg-slate-950 border rounded-xl p-4 flex flex-col justify-between transition-colors ${
                    isCurrentlyRecording
                      ? 'border-cyan-500 bg-cyan-500/5'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-bold text-sm text-slate-100">{cls}</span>
                    <button
                      onClick={() => handleRemoveClass(cls)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-400 mb-3">
                    Samples: <strong className="text-cyan-400 font-mono tabular-nums">{count}</strong>
                  </div>

                  <button
                    onMouseDown={() => setIsRecording(cls)}
                    onMouseUp={() => setIsRecording(null)}
                    onTouchStart={() => setIsRecording(cls)}
                    onTouchEnd={() => setIsRecording(null)}
                    className={`w-full py-2 rounded-lg text-xs font-semibold select-none transition-colors flex items-center justify-center gap-2 ${
                      isCurrentlyRecording
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isCurrentlyRecording ? 'Capturing Frames...' : 'Hold to Record'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Train & Test Section */}
      <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={handleTrain}
            disabled={classes.length < 2 || customTrainer.getSampleCount() < 6}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors disabled:opacity-40"
          >
            Train Machine Learning Model
          </button>
          {trainedModelInfo && (
            <p className="text-xs text-emerald-400 mt-2">{trainedModelInfo}</p>
          )}
        </div>

        {/* Live Test Feedback Card */}
        {customPrediction && (
          <div className="bg-slate-950 border border-cyan-500/40 rounded-xl px-4 py-2.5 flex items-center gap-3">
            <span className="text-xs text-slate-400">Custom Prediction:</span>
            <span className="font-mono font-bold text-sm text-cyan-300">
              {customPrediction.label}
            </span>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {Math.round(customPrediction.confidence * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
