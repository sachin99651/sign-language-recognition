import { CustomDatasetSample, CustomTrainedModel, NormalizedFeatures } from '../types/signLanguage';

/**
 * In-Browser Machine Learning Model Trainer for Custom ASL Signs
 * Implements k-Nearest Neighbors (k-NN) and Centroid Nearest Mean Classifiers.
 */

export class CustomModelTrainer {
  private samples: CustomDatasetSample[] = [];
  private trainedModel: CustomTrainedModel | null = null;
  private readonly defaultK = 3;

  constructor() {
    this.loadFromStorage();
  }

  public getSampleCount(): number {
    return this.samples.length;
  }

  public getSamplesByLabel(): { [label: string]: number } {
    const counts: { [label: string]: number } = {};
    for (const s of this.samples) {
      counts[s.label] = (counts[s.label] || 0) + 1;
    }
    return counts;
  }

  public getClasses(): string[] {
    return Object.keys(this.getSamplesByLabel());
  }

  public addSample(label: string, features: NormalizedFeatures): void {
    if (!label.trim() || !features.coords || features.coords.length === 0) return;

    this.samples.push({
      id: `sample_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: label.trim().toUpperCase(),
      features,
      timestamp: Date.now()
    });

    this.saveToStorage();
  }

  public removeClass(label: string): void {
    this.samples = this.samples.filter(s => s.label !== label.toUpperCase());
    if (this.trainedModel) {
      this.trainModel();
    }
    this.saveToStorage();
  }

  public clearAllSamples(): void {
    this.samples = [];
    this.trainedModel = null;
    localStorage.removeItem('asl_custom_dataset');
    localStorage.removeItem('asl_custom_model');
  }

  /**
   * Train Centroid and k-NN classifier from recorded samples
   */
  public trainModel(): CustomTrainedModel | null {
    const classes = this.getClasses();
    if (classes.length < 2) {
      return null;
    }

    const centroids: { [label: string]: number[] } = {};
    const counts: { [label: string]: number } = {};

    for (const sample of this.samples) {
      const vec = this.featureVector(sample.features);
      if (!centroids[sample.label]) {
        centroids[sample.label] = new Array(vec.length).fill(0);
        counts[sample.label] = 0;
      }
      for (let i = 0; i < vec.length; i++) {
        centroids[sample.label][i] += vec[i];
      }
      counts[sample.label]++;
    }

    // Divide by count to get mean centroid vector
    for (const cls of classes) {
      const n = counts[cls];
      if (n > 0) {
        for (let i = 0; i < centroids[cls].length; i++) {
          centroids[cls][i] /= n;
        }
      }
    }

    this.trainedModel = {
      name: 'Custom ASL Classifier',
      classes,
      sampleCount: this.samples.length,
      trainedAt: new Date().toISOString(),
      centroids,
      k: this.defaultK
    };

    localStorage.setItem('asl_custom_model', JSON.stringify(this.trainedModel));
    return this.trainedModel;
  }

  /**
   * Classify live normalized features using k-NN with distance-weighted voting
   */
  public predict(features: NormalizedFeatures): { label: string; confidence: number } | null {
    if (!this.trainedModel || this.samples.length === 0) return null;

    const queryVec = this.featureVector(features);
    if (queryVec.length === 0) return null;

    // Calculate distance to all samples
    const distances: { label: string; dist: number }[] = [];
    for (const sample of this.samples) {
      const sampleVec = this.featureVector(sample.features);
      const dist = this.euclideanDistance(queryVec, sampleVec);
      distances.push({ label: sample.label, dist });
    }

    // Sort by nearest
    distances.sort((a, b) => a.dist - b.dist);

    const k = Math.min(this.trainedModel.k, distances.length);
    const nearestK = distances.slice(0, k);

    // Vote with inverse-distance weights
    const votes: { [label: string]: number } = {};
    let totalWeight = 0;

    for (const item of nearestK) {
      const weight = 1 / (item.dist + 0.001);
      votes[item.label] = (votes[item.label] || 0) + weight;
      totalWeight += weight;
    }

    let topLabel = '';
    let maxWeight = 0;
    for (const label in votes) {
      if (votes[label] > maxWeight) {
        maxWeight = votes[label];
        topLabel = label;
      }
    }

    const confidence = totalWeight > 0 ? maxWeight / totalWeight : 0.5;

    return {
      label: topLabel,
      confidence: Number(Math.min(0.98, Math.max(0.55, confidence)).toFixed(2))
    };
  }

  private featureVector(features: NormalizedFeatures): number[] {
    // Combine 63 normalized coords + 5 extension ratios + 8 distances
    return [...(features.coords || []), ...(features.extensions || []), ...(features.distances || [])];
  }

  private euclideanDistance(v1: number[], v2: number[]): number {
    let sum = 0;
    const len = Math.min(v1.length, v2.length);
    for (let i = 0; i < len; i++) {
      sum += (v1[i] - v2[i]) * (v1[i] - v2[i]);
    }
    return Math.sqrt(sum);
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('asl_custom_dataset', JSON.stringify(this.samples));
    } catch (e) {
      console.warn('Dataset storage exceeded or unavailable');
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('asl_custom_dataset');
      if (stored) {
        this.samples = JSON.parse(stored);
      }
      const modelStored = localStorage.getItem('asl_custom_model');
      if (modelStored) {
        this.trainedModel = JSON.parse(modelStored);
      }
    } catch (e) {
      console.warn('Failed to load stored custom dataset');
    }
  }

  public exportDatasetJSON(): string {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      sampleCount: this.samples.length,
      classes: this.getClasses(),
      samples: this.samples
    }, null, 2);
  }

  public importDatasetJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data && Array.isArray(data.samples)) {
        this.samples = data.samples;
        this.trainModel();
        this.saveToStorage();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const customTrainer = new CustomModelTrainer();
