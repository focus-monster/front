export default function GuestSignIn() {
  const GUEST_URL = "#";

  return (
    <a
      href={GUEST_URL}
      className="mt-4 w-fit cursor-pointer text-sm text-white underline"
    >
      Access as a guest
    </a>
  );
}
