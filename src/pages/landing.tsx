import SignIn from "./sign-in";
import { Floating } from "../components/floating";

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

export default Landing;
