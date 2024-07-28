import { useAuth } from "./hooks/auth";

function App() {
  return (
    <div className="min-h-svh w-svw">
      <Header />
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between p-6">
      <div className="flex items-center gap-3">
        <span className="aspect-square w-8 overflow-clip rounded-full bg-gray-400">
          {/** Image */}
        </span>
        <div className="text-lg">Focus Monster</div>
      </div>
      <div>
        <AuthActions />
      </div>
    </header>
  );
}

function AuthActions() {
  const auth = useAuth();

  if (!auth.session) {
    return (
      <div className="flex items-center gap-3">
        <LogIn />
        <button className="rounded-lg bg-gray-900 px-4 py-2 text-gray-50">
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <button className="rounded-lg bg-gray-900 px-4 py-2 text-gray-50">
      Log Out
    </button>
  );
}

function LogIn() {
  return (
    <button className="rounded-lg bg-gray-100 px-4 py-2 text-gray-900">
      Log In
    </button>
  );
}

export default App;
