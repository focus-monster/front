import { Link } from "react-router-dom";

export default function Tabs() {
  return (
    <ul className="flex shrink-0 gap-12 px-8 py-8 text-neutral-50">
      <Link to="/">
        <li className="flex h-full flex-col items-center justify-center gap-2">
          <div className="grid w-16 grow place-content-center drop-shadow-lg">
            <img width="80px" height="68px" src="/home.png" alt="home"></img>
          </div>
          <p>Today's Log</p>
        </li>
      </Link>
      <Link to="/collection">
        <li className="flex h-full flex-col items-center justify-center gap-2">
          <div className="grid w-16 grow place-content-center drop-shadow-lg">
            <img
              width="80px"
              height="68px"
              src="/gallery.png"
              alt="collection"
            ></img>
          </div>
          <p>Collection</p>
        </li>
      </Link>
      <Link to="/settings">
        <li className="flex h-full flex-col items-center justify-center gap-2">
          <div className="grid w-16 grow place-content-center drop-shadow-lg">
            <img
              width="80px"
              height="78px"
              src="/settings.png"
              alt="settings"
            ></img>
          </div>
          <p>Settings</p>
        </li>
      </Link>
    </ul>
  );
}
