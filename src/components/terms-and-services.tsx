export default function TermsAndServices() {
  const TERMS_AND_SERVICE_URL = "#";
  const PRIVACY_URL = "#";

  return (
    <p className="text-sm text-neutral-700">
      By using this site, you agree to our{" "}
      <a
        href={TERMS_AND_SERVICE_URL}
        className="cursor-pointer font-bold underline"
      >
        Terms of Service
      </a>{" "}
      and{" "}
      <a href={PRIVACY_URL} className="cursor-pointer font-bold underline">
        Privacy
      </a>
    </p>
  );
}
