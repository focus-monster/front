import GuestSignIn from "../components/auth/guest-sign-in";
import GoogleAuth from "../components/auth/google";
import Folder from "../components/folder";
import TermsAndServices from "../components/terms-and-services";

export default function SignIn() {
  return (
    <div className="mx-auto grid h-full place-content-center gap-4">
      <Folder
        landing="-landing"
        className="grid w-[600px] place-items-center gap-4"
        insert={
          <div className="absolute right-[4rem] top-16">
            <img
              src="/landing-char.png"
              className="w-56"
              alt="focusmonster"
            ></img>
          </div>
        }
        title={
          <div className="absolute left-[270px] top-[50px] z-20 w-fit min-w-[200px] -translate-x-1/2 -translate-y-1/2 px-8 py-1 text-center">
            <Title />
          </div>
        }
      >
        <GoogleAuth />
        <GuestSignIn />
      </Folder>
      <TermsAndServices />
    </div>
  );
}

function Title() {
  return (
    <div className="p-2 text-4xl font-semibold text-neutral-900">
      FocusMonster
    </div>
  );
}
