import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  {
    to: "/",
    icon: "/home.png",
    label: "Today's Log",
    width: 80,
    height: 68,
  },
  {
    to: "/collection",
    icon: "/gallery.png",
    label: "Collection",
    width: 80,
    height: 68,
  },
  {
    to: "/settings",
    icon: "/settings.png",
    label: "Settings",
    width: 80,
    height: 78,
  },
  {
    to: "/about-us",
    icon: "/about-us.png",
    label: "About Us",
    width: 50,
    height: 64,
  },
];

function Tab({
  to,
  icon,
  label,
  width,
  height,
}: {
  to: string;
  icon: string;
  label: string;
  width: number;
  height: number;
}) {
  const location = useLocation();
  const isActive = location.pathname.split("/")[1] === to.slice(1);

  return (
    <Link to={to}>
      <li className="flex h-full flex-col items-center justify-center gap-2">
        <div
          className={cn(
            "grid w-16 grow origin-center place-content-center drop-shadow-lg transition-all hover:scale-110",
            isActive
              ? "brightness-100 grayscale-0"
              : "brightness-50 grayscale hover:brightness-100 hover:grayscale-0",
          )}
        >
          <img width={width} height={height} src={icon} alt={label}></img>
        </div>
        <p>{label}</p>
      </li>
    </Link>
  );
}

export default function Tabs() {
  return (
    <ul className="flex shrink-0 gap-8 px-8 py-8 text-neutral-50">
      {tabs.map((tab) => (
        <Tab key={tab.to} {...tab} />
      ))}
    </ul>
  );
}
