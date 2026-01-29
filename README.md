
# TruthAxis 📉⚖️

**Don't be fooled by shady graphs.**

TruthAxis is an AI-powered forensic tool that detects misleading data visualizations—specifically truncated Y-axes—and reconstructs them with an honest zero-baseline.

## 🚀 The Problem

Data visualization is often weaponized by starting the Y-axis at a non-zero value. This tactic exaggerates small differences, making a 1% change look like a 50% shift. This is common in politics, marketing, and news media to push specific narratives.

## 🛡️ The Solution

TruthAxis uses advanced computer vision and generative AI (Google Gemini 3 Pro & Nano Banana Pro) to:
1.  **Extract** the raw data points from a static image.
2.  **Analyze** the visual scaling to calculate a "Deception Score".
3.  **Re-imagine** the chart using Generative AI with a proper 0-to-max axis.
4.  **Preserve** the original aesthetic (colors, fonts) for a fair comparison.

## ✨ Features

-   **Forensic AI Audit**: Automatically detects if a chart is misleading.
-   **Visual Reconstruction**: Generates a high-fidelity "Fixed Reality" version of the chart using Nano Banana Pro.
-   **Deception Index**: A 0-100 score indicating how much the visual differs from the mathematical reality.
-   **Step-by-Step Analysis**: Visualizes the forensic process in real-time.
-   **Data Transparency**: View and verify the raw numbers extracted by the AI.
-   **Export Tools**: Download the corrected chart as a PNG to share the truth.

## 🛠️ Tech Stack

-   **Frontend**: React 19, TypeScript
-   **AI Analysis**: Google Gemini 3 Pro (`gemini-3-pro-preview`)
-   **Image Generation**: Nano Banana Pro (`gemini-3-pro-image-preview`)
-   **Styling**: Tailwind CSS

## 🚦 Getting Started

### Prerequisites

-   A paid Google Gemini API Key (Required for Nano Banana Pro). Get one at [Google AI Studio](https://aistudio.google.com/).
-   Node.js (v18+)

### Environment Setup

The application handles API key selection via the Google AI Studio integration.

## 🧠 How it Works

1.  **Upload**: User drops an image of a bar, line, or area chart.
2.  **Forensic Process**:
    *   **Analysis**: Gemini 3 Pro scans the image to extract labels, values, axis limits, and styling attributes.
    *   **Reconstruction**: Gemini 3 Pro Image model (Nano Banana Pro) generates a new version of the image with the prompt to fix the Y-axis.
3.  **Math Check**: The system calculates the visual ratio vs. the actual data ratio to determine the *Deception Score*.
4.  **Result**: The original and fixed charts are displayed side-by-side.

## 📝 License

MIT

---

*Note: TruthAxis provides estimates based on AI vision analysis. Always verify raw data before citing.*TruthAxis © 2026
