import GuestSignIn from "../components/auth/guest-sign-in";
import GoogleAuth from "../components/auth/google";
import Folder from "../components/folder";
import TermsAndServices from "../components/terms-and-services";

export default function SignIn() {
  return (
    <div className="mx-auto grid min-h-svh place-content-center gap-4">
      <Folder
        className="grid place-items-center gap-4"
        insert={
          <img
            src="/cat_sad.png"
            className="w-44 -translate-y-10"
            alt="sad cat"
          ></img>
        }
        title={<Title />}
      >
        <GoogleAuth />
        <TermsAndServices />
      </Folder>
      <GuestSignIn />
    </div>
  );
}

function Title() {
  return <div className="text-neutral-900">FocusMonster</div>;
}
