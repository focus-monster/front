import { Link } from "react-router-dom";

export default function Tabs() {
  return (
    <ul className="mx-auto flex gap-8 px-8 py-8 text-gray-50">
      <Link to="/">
        <li className="flex h-full flex-col items-center justify-center gap-2">
          <div className="grid w-20 grow place-content-center">
            <img src="home.png"></img>
          </div>
          <p>Today</p>
        </li>
      </Link>
      <Link to="/collection">
        <li className="flex h-full flex-col items-center justify-center gap-2">
          <div className="grid w-20 grow place-content-center">
            <img src="gallery.png"></img>
          </div>
          <p>Collection</p>
        </li>
      </Link>
      <Link to="/settings">
        <li className="flex h-full flex-col items-center justify-center gap-2">
          <div className="grid w-20 grow place-content-center">
            <img src="settings.png"></img>
          </div>
          <p>Settings</p>
        </li>
      </Link>
    </ul>
  );
}
