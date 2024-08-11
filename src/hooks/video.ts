import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useCapturableCanvas() {
  const mutation = useMutation({
    mutationKey: ["mediaStream"],
    mutationFn: async () => {
      const stream = await startScreenCapture();

      const video = document.createElement("video");
      video.style.display = "none";
      video.srcObject = stream ?? null;
      video.play();

      const canvas = document.createElement("canvas");
      canvas.style.display = "none";
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      return canvas;
    },
    onSuccess: () => {
      toast.success("Capturing screen...");
    },
    onError: (error) => {
      toast.error("Failed capturing screen..." + error.message);
    },
  });

  return mutation;
}

export function useVideo({
  interval = 1000 * 60,
  focusId = 1,
}: {
  interval?: number;
  focusId?: number | null;
}) {
  const { mutate, isSuccess, data } = useCapturableCanvas();

  console.log(isSuccess, data);

  useEffect(() => {
    if (isSuccess && focusId) {
      const ref = setInterval(() => {
        try {
          data.toBlob(async (blob) => {
            if (blob) {
              sendBlobToServer(blob, focusId);
            }
          }, "image/png");
        } catch (e) {
          console.error("Failed to capture screen: " + e);
          toast.error("Failed to capture screen: " + e);
        }
      }, interval);

      return () => clearInterval(ref);
    }
  }, [focusId, interval, isSuccess, data]);

  return mutate;
}

async function sendBlobToServer(blob: Blob, focusId: number) {
  const formData = new FormData();
  formData.append("file", blob);

  console.log("blob", blob);
  // const req = await fetch(`/api/image?focusId=${focusId}`, {
  //   method: "POST",
  //   body: formData,
  // });

  // if (!req.ok) {
  //   console.error("Failed to send screen capture: " + (await req.text()));
  //   toast.error("Failed to send screen capture: " + (await req.text()));
  // }

  // const data = await req.json();
  // if (data.error) {
  //   console.error("Failed to send screen capture: " + data.error);
  //   toast.error("Failed to send screen capture: " + data.error);
  // }

  // toast.success("Screen capture sent: " + data);

  // return data;
}

export async function startScreenCapture() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia();
    return stream;
  } catch (e) {
    toast.error("Failed to start screen capture: " + e);
  }
}
