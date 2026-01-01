import React, { useRef, useState } from "react";
import { startMicrophone } from "./services/audio";
import { createDeepgramSocket } from "./services/deepgram";

export default function App() {
  const [recording, setRecording] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState(false);

  const dgRef = useRef(null);
  const stopMicRef = useRef(null);

  const start = async () => {
    setFinalText("");
    setInterimText("");
    setStatus("requesting-mic");

    dgRef.current = createDeepgramSocket(
      (text, isFinal) => {
        if (isFinal) {
          setFinalText(prev => (prev ? prev + " " + text : text));
          setInterimText("");
        } else {
          setInterimText(text);
        }
      },
      () => setStatus("listening"),
      () => setStatus("closed"),
      () => setStatus("error")
    );

    stopMicRef.current = await startMicrophone((chunk) => {
      dgRef.current?.send(chunk);
    });

    setRecording(true);
  };

  const stop = () => {
    stopMicRef.current?.();
    dgRef.current?.close();
    setRecording(false);
    setStatus("idle");
    setInterimText("");
  };

  const handleCopy = async () => {
    const text = (finalText + " " + interimText).trim();
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleReset = () => {
    setFinalText("");
    setInterimText("");
    setCopied(false);
  };

  return (
    <div className="app">
      <header className="header">
        <h2>Voice to Text(Real time)</h2>
        <span className={`status ${status}`}>{status}</span>
      </header>

      <div className="controls">
        <button className="primary" onClick={recording ? stop : start}>
          {recording ? "Stop Recording" : "Push to Talk"}
        </button>

        <button
          className="secondary"
          onClick={handleReset}
          disabled={!finalText && !interimText}
        >
          Reset
        </button>
      </div>

      <div className="transcript-wrapper">
        <button
          className="copy-btn"
          onClick={handleCopy}
          disabled={!finalText && !interimText}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>

        <textarea
          readOnly
          value={(finalText + " " + interimText).trim()}
          placeholder="Press Push to Talk and start speaking…"
        />
      </div>
    </div>
  );
}
