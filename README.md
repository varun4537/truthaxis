
# TruthAxis 📉⚖️

**Don't be fooled by shady graphs.**

TruthAxis is an AI-powered forensic tool that detects misleading data visualizations—specifically truncated Y-axes—and reconstructs them with an honest zero-baseline.

## 🚀 The Problem

Data visualization is often weaponized by starting the Y-axis at a non-zero value. This tactic exaggerates small differences, making a 1% change look like a 50% shift. This is common in politics, marketing, and news media to push specific narratives.

## 🛡️ The Solution

TruthAxis uses computer vision and LLMs (Google Gemini 3 Flash) to:
1.  **Extract** the raw data points from a static image.
2.  **Analyze** the visual scaling to calculate a "Deception Score".
3.  **Re-render** the chart with a proper 0-to-max axis.
4.  **Preserve** the original aesthetic (colors, fonts) for a fair comparison.

## ✨ Features

-   **Forensic AI Audit**: Automatically detects if a chart is misleading.
-   **Visual Reconstruction**: Generates a "Fixed Reality" version of the chart next to the "Original Visual Bias".
-   **Deception Index**: A 0-100 score indicating how much the visual differs from the mathematical reality.
-   **Style Matching**: Extracts HEX codes and fonts to ensure the fixed chart looks like the original.
-   **Data Transparency**: View and verify the raw numbers extracted by the AI.
-   **Export Tools**: Download the corrected chart as a PNG to share the truth.

## 🛠️ Tech Stack

-   **Frontend**: React 19, TypeScript
-   **AI Model**: Google Gemini 3 Flash Preview (`gemini-3-flash-preview`)
-   **Visualization**: Recharts
-   **Styling**: Tailwind CSS
-   **Image Processing**: html-to-image

## 🚦 Getting Started

### Prerequisites

-   A Google Gemini API Key. Get one at [Google AI Studio](https://aistudio.google.com/).
-   Node.js (v18+)

### Environment Setup

The application requires a valid API key from Google AI Studio to perform image analysis.

```bash
export API_KEY=your_gemini_api_key_here
```

## 🧠 How it Works

1.  **Upload**: User drops an image of a bar, line, or area chart.
2.  **Vision Analysis**: Gemini analyzes the pixel data to extract labels, values, axis limits, and styling attributes.
3.  **Math Check**: The system calculates the visual ratio vs. the actual data ratio to determine the *Deception Score*.
4.  **Render**: A new chart is drawn using React and Recharts with `domain={[0, 'auto']}` to force a zero baseline.

## 📝 License

MIT

---

*Note: TruthAxis provides estimates based on AI vision analysis. Always verify raw data before citing.*
