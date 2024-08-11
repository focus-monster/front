import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useVideoStream() {
  const mutation = useMutation({
    mutationKey: ["mediaStream"],
    mutationFn: async (focusId: number) => {
      const stream = await startScreenCapture();
      if (!stream) {
        throw new Error("No video feed");
      }

      const video = document.createElement("video");
      video.srcObject = stream ?? null;
      video.play();

      function release() {
        video.srcObject = null;
        if (stream) stream.getTracks().forEach((track) => track.stop());
      }

      return {
        video,
        focusId,
        release,
      };
    },
    onSuccess: () => {
      toast.success("Capturing screen...");
    },
    onError: (error) => {
      toast.error("Failed capturing screen... " + error.message);
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
  const { mutate, isSuccess, data } = useVideoStream();

  useEffect(() => {
    if (isSuccess && data.focusId) {
      const ref = setInterval(async () => handleStream(data), interval);
      handleStream(data);
      return () => {
        clearInterval(ref);
      };
    }
  }, [interval, isSuccess, data]);

  return {
    mutate,
    release: data?.release,
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

  toast.success("Screen capture sent: " + data);

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
