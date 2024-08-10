import { Session } from "@/hooks/sessions";
import { Time } from "./today";

export function Result({ status }: { status: Session }) {
  return <Time session={status} />;
}
