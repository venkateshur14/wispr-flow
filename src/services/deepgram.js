const DEEPGRAM_API_KEY = "69254aab4bc27e3e81682c5e0395fa1298deda33";

export function createDeepgramSocket(onTranscript, onOpen, onClose, onError) {
  if (!DEEPGRAM_API_KEY || DEEPGRAM_API_KEY.startsWith("PASTE")) {
    console.error("❌ Deepgram API key is missing or not replaced");
  }

  const socket = new WebSocket(
    "wss://api.deepgram.com/v1/listen?model=nova-2&interim_results=true&punctuate=true",
    ["token", DEEPGRAM_API_KEY]
  );

  const queue = [];
  let isOpen = false;

  socket.binaryType = "arraybuffer";

  socket.onopen = () => {
    console.log("✅ [Deepgram] WebSocket connected");
    isOpen = true;

    while (queue.length > 0) {
      socket.send(queue.shift());
    }

    onOpen && onOpen();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (!data.channel) return;

      const transcript = data.channel.alternatives[0]?.transcript;
      const isFinal = data.is_final;

      if (transcript && transcript.trim()) {
        onTranscript(transcript, isFinal);
      }
    } catch (e) {
      console.error("[Deepgram] Message parse error", e);
    }
  };

  socket.onerror = (err) => {
    console.error("❌ [Deepgram] socket error", err);
    onError && onError(err);
  };

  socket.onclose = (e) => {
    console.log("[Deepgram] socket closed", e.code);
    onClose && onClose(e);
  };

  return {
    send(chunk) {
      if (isOpen && socket.readyState === WebSocket.OPEN) {
        socket.send(chunk);
      } else {
        queue.push(chunk);
      }
    },
    close() {
      socket.close();
    }
  };
}
