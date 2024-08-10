import { useEffect, useState } from "react";

const steps = [".", "..", "..."];

export default function Loading() {
  const [step, setStep] = useState(0);

  const TIMEOUT_INTERVAL = 500;

  useEffect(() => {
    const ref = setInterval(() => {
      setStep((prev) => prev + 1);
    }, TIMEOUT_INTERVAL);

    return () => clearInterval(ref);
  }, []);

  function makeString() {
    return "Loading" + steps[step % steps.length];
  }

  const status = makeString();

  return (
    <div className="grid h-full w-full place-content-center text-2xl">
      {status}
    </div>
  );
}
