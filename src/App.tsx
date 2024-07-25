import GoogleAuth from "./components/auth/google";
import Folder from "./components/folder";

const TERMS_AND_SERVICE_URL = "#";
const PRIVACY_URL = "#";
const GUEST_URL = "#";

function App() {
  return (
    <>
      <div className="h-fit">
        <Folder
          className="grid place-items-center gap-4"
          insert={<img src="/vite.svg" className="w-40"></img>}
        >
          <GoogleAuth />
          <p className="text-xs">
            By using this site, you agree to our{" "}
            <a
              href={TERMS_AND_SERVICE_URL}
              className="cursor-pointer font-bold underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href={PRIVACY_URL}
              className="cursor-pointer font-bold underline"
            >
              Privacy
            </a>
          </p>
        </Folder>
      </div>
      <a
        href={GUEST_URL}
        className="mt-4 w-fit cursor-pointer text-white underline"
      >
        Access as a guest
      </a>
    </>
  );
}

export default App;
