export default function TermsAndServices() {
  const TERMS_AND_SERVICE_URL = "#";
  const PRIVACY_URL = "#";

  return (
    <p className="mx-auto text-sm text-neutral-100">
      Your use of this website constitutes acceptance of our{" "}
      <a
        href={TERMS_AND_SERVICE_URL}
        className="cursor-pointer font-bold underline"
      >
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
