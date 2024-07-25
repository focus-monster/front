import GoogleAuth from "./components/auth/google";
import Folder from "./components/folder";

function App() {
  return (
    <>
      <div className="h-fit">
        <Folder insert={<img src="/vite.svg" className="w-40"></img>}>
          <GoogleAuth />
        </Folder>
      </div>
    </>
  );
}

export default App;
