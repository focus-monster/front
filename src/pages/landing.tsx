import { useEffect, useRef } from "react";
import SignIn from "./sign-in";
import { cn } from "@/lib/utils";

function Landing() {
  return (
    <div>
      <div>
        <img
          src="/logo.png"
          alt="FocusMonster"
          className="w-[320px] px-11 py-8"
        />
      </div>
      <SignIn />
      <Floating />
    </div>
  );
}

type Floating = {
  borderImage: string;
  image?: string;
  phrase?: string;
  top: number;
  left: number;
  className?: string;
  speed: number;
};

const floatings: Floating[] = [
  {
    borderImage: "/image-border.png",
    image: "/meme-1.png",
    left: 0.1,
    top: 0.1,
    className: "w-56",
    speed: 0.003,
  },
  {
    borderImage: "/image-border.png",
    image: "/meme-2.png",
    left: 0.95,
    top: 0.3,
    speed: 0.0035,
  },
  {
    borderImage: "/image-border.png",
    image: "/meme-3.png",
    left: 0.3,
    top: 0.99,
    speed: 0.004,
  },
  {
    borderImage: "/word-border.png",
    phrase: "Ready to adopt a monster\nto conquer your distractions?",
    left: 0.3,
    top: 0.4,
    speed: 0.001,
  },
  {
    borderImage: "/word-border.png",
    phrase: "FocusMonster",
    left: 0.7,
    top: 0.2,
    className: "text-4xl font-bold",
    speed: 0.002,
  },
  {
    borderImage: "/word-border.png",
    phrase:
      "Losing focus?\nSummon the monster residing in the folders of your PC!",
    left: 0.8,
    top: 0.5,
    speed: 0.0015,
  },
  {
    borderImage: "/word-border.png",
    phrase: "Your monster will give you some tips!",
    left: 0,
    top: 0.95,
    speed: 0.0022,
  },
];

function Floating() {
  return (
    <div className="pointer-events-none fixed left-0 top-0 isolate z-50 h-screen w-screen overflow-hidden">
      {floatings.map((floating, index) => (
        <MovingFloat key={index} props={floating} />
      ))}
    </div>
  );
}

function MovingFloat({ props }: { props: Floating }) {
  const ref = useRef<HTMLDivElement & { left: number }>(null);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      if (ref.current) {
        if (!ref.current.left) ref.current.left = props.left;
        ref.current.left += props.speed;
        ref.current.style.left = `${ref.current.left * 100}vw`;

        if (ref.current.left > 1.3) {
          ref.current.left = -0.4;
        } else if (ref.current.left > 1.2) {
          ref.current.style.opacity = "0";
          ref.current.style.scale = "0.9";
        } else if (ref.current.left >= -0.1) {
          ref.current.style.opacity = "1";
          ref.current.style.scale = "1";
        }
      }

      return () => clearInterval(intervalRef);
    }, 100);
  }, [props.left, props.speed]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute w-fit p-10"
      style={{
        top: `${props.top * 100}vh`,
        left: `${props.left * 100}vw`,
        transform: `translate(-50%, -50%)`,
        backgroundImage: `url(${props.borderImage})`,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        transition:
          "opacity 0.1s ease-in-out, left 0.1s, scale 0.3s ease-in-out",
        transformOrigin: "center",
      }}
    >
      {props.image && (
        <div
          className={cn(
            "aspect-square w-48 overflow-hidden object-cover p-4",
            props?.className,
          )}
        >
          <img src={props.image} height="200px" alt="" className="w-full"></img>
        </div>
      )}
      {props.phrase && (
        <div className={cn("p-4", props?.className)}>
          {props.phrase.split("\n").map((phrase, index) => (
            <p key={index} className="mx-auto w-max text-neutral-900">
              {phrase}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Landing;
