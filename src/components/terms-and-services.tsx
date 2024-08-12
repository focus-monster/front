export default function TermsAndServices() {
  const USER_AGREEMENT = "/user-agreement";
  const PRIVACY_URL = "/privacy-policy";

  return (
    <p className="mx-auto text-sm text-neutral-100">
      Your use of this website constitutes acceptance of our{" "}
      <a href={USER_AGREEMENT} className="cursor-pointer font-bold underline">
        User Agreement
      </a>{" "}
      and{" "}
      <a href={PRIVACY_URL} className="cursor-pointer font-bold underline">
        Privacy Policy
      </a>
      .
    </p>
  );
}
