import { useRouteError, ErrorResponse } from "react-router-dom";

export function ErrorBoundary() {
  const error = useRouteError() as ErrorResponse;
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return (
    <div className="grid h-screen w-full place-content-center place-items-center text-white">
      <h1 className="pb-12 text-center text-4xl">
        Something unexpected happened...
      </h1>
      <p className="pb-2 text-lg">Here is the reason why it errored</p>
      <div className="rounded-lg bg-red-200 p-4 text-center text-lg text-red-700">
        <pre>
          [{error.status}] {error.statusText}
        </pre>
        <pre>{error.data}</pre>
      </div>
    </div>
  );
}
