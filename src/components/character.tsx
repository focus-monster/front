import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";

export function Character({ className }: { className: string }) {
  const { data } = useAuth();
  if (!data) {
    return null;
  }
  const { level } = data;

  return (
    <img
      className={cn("w-16", className)}
      src={CharacterImageString(level)}
      alt=""
    />
  );
}

function CharacterImageString(level: number) {
  if (level === 0) return "/0.png";
  if (level === 1) return "/1.png";
  if (level <= 5) return "/5.png";
  if (level <= 15) return "/15.png";
  if (level <= 30) return "/30.png";
  if (level <= 50) return "/50.png";
  if (level <= 70) return "/70.png";
  if (level <= 100) return "/100.png";
  if (level <= 150) return "/150.png";
  if (level <= 180) return "/180.png";
  return "/200.png";
}
