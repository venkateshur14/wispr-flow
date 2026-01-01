export async function startMicrophone(onChunk, options = {}) {
  const mimeType = options.mimeType || "audio/webm;codecs=opus";
  const timeslice = options.timeslice || 250; 

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream, { mimeType });

  recorder.ondataavailable = async (event) => {
    try {
      if (event.data && event.data.size > 0) {
        const ab = await event.data.arrayBuffer();
        onChunk(ab);
      }
    } catch (err) {
      console.error("ondataavailable error:", err);
    }
  };

  recorder.onerror = (ev) => {
    console.error("MediaRecorder error", ev);
  };

  recorder.start(timeslice); 

  return () => {
    try {
      if (recorder.state !== "inactive") recorder.stop();
    } catch (e) {}
    stream.getTracks().forEach((t) => t.stop());
  };
}
