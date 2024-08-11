import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useSessions } from "./sessions";

export function useVideoStream() {
  const { isFocusing } = useSessions();
  const mutation = useMutation({
    mutationKey: ["mediaStream"],
    mutationFn: async () => {
      if (!isFocusing) {
        return null;
      }
      const stream = await startScreenCapture();
      if (!stream) {
        throw new Error("No video feed");
      }

      const video = document.createElement("video");
      video.srcObject = stream ?? null;
      video.play();

      return {
        stream,
        video,
      };
    },
    onError: (error) => {
      toast.error("Failed to start video stream: " + error);
    },
  });

  return mutation;
}

async function handleStream(data: {
  video: HTMLVideoElement;
  focusId: number;
}) {
  try {
    if (data.video.readyState < 2) {
      await new Promise((resolve) => {
        data.video.onloadedmetadata = () => resolve(true);
      });
    }

    const canvas = document.createElement("canvas");
    canvas.width = data.video.videoWidth;
    canvas.height = data.video.videoHeight;
    const ctx = canvas.getContext("2d");

    ctx?.drawImage(data.video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (blob) {
        sendBlobToServer(blob, data.focusId);
      }
    }, "image/png");
  } catch (e) {
    console.error("Failed to capture screen: " + e);
    toast.error("Failed to capture screen: " + e);
  }
}

export function useVideo({ interval = 1000 * 60 }: { interval?: number }) {
  const {
    mutate: fetchVideoStream,
    data: videoStream,
    isSuccess,
  } = useVideoStream();

  const { mutate } = useMutation({
    mutationKey: ["video"],
    mutationFn: handleStream,
    onSuccess: () => {
      toast.success("Screen capture sent");
    },
    onError: (error) => {
      toast.error("Failed to send screen capture: " + error);
    },
  });
  const { currentFocusId } = useSessions();

  const startVideoCapture = useCallback(() => {
    if (!videoStream) {
      fetchVideoStream();
    }
    if (videoStream && currentFocusId) {
      mutate({
        video: videoStream.video,
        focusId: currentFocusId,
      });
    }
  }, [currentFocusId, fetchVideoStream, videoStream, mutate]);

  useEffect(() => {
    if (isSuccess && videoStream && currentFocusId) {
      const ref = setInterval(startVideoCapture, interval);
      startScreenCapture();
      return () => {
        clearInterval(ref);
      };
    }
  }, [interval, isSuccess, videoStream, currentFocusId, startVideoCapture]);

  function release() {
    videoStream?.stream.getTracks().forEach((track) => {
      track.stop();
    });
    videoStream?.video.pause();
  }

  return {
    videoStream,
    fetchVideoStream,
    release,
  };
}

async function sendBlobToServer(blob: Blob, focusId: number) {
  const formData = new FormData();
  formData.append("file", blob);

  const req = await fetch(`/gemini/image?focusId=${focusId}`, {
    method: "POST",
    body: formData,
  });

  if (!req.ok) {
    console.error("Failed to send screen capture: " + (await req.text()));
    toast.error("Failed to send screen capture: " + (await req.text()));
  }

  const data = await req.json();
  if (data.error) {
    console.error("Failed to send screen capture: " + data.error);
    toast.error("Failed to send screen capture: " + data.error);
  }

  return data;
}

export async function startScreenCapture() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    return stream;
  } catch (e) {
    toast.error("Failed to start screen capture: " + e);
  }
}
