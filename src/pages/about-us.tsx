import PrivacyPolicyDialog from "@/components/dialog/privacy-policy-dialog";
import UserAgreementDialog from "@/components/dialog/user-agreement-dialog";
import Loading from "@/components/loading";
import { useQuery } from "@tanstack/react-query";

export default function AboutUs() {
  return (
    <div className="flex flex-col gap-8 rounded-lg px-12 pb-12 text-xl">
      <div className="flex w-full flex-row-reverse">
        <DownloadExtension />
      </div>
      <Description />
      <div className="flex gap-8">
        <div className="flex-1">
          <TermsAndPolicies />
        </div>
        <div className="flex-1">
          <ContactUs />
        </div>
      </div>
    </div>
  );
}

function DownloadExtension() {
  return (
    <a
      style={{
        backgroundImage: `url('/black-button.png')`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
      href="https://chromewebstore.google.com/detail/focusmonster/gjmnmmhemocpceakakckmpnhkddienbe?hl=en"
      className="flex items-center gap-4 self-end px-8 py-4 text-white"
    >
      <img src="/extension.png" height="30px" width="35px"></img>
      Download Extension
    </a>
  );
}

function Description() {
  return (
    <div className="overflow-clip rounded-3xl bg-white">
      <div className="bg-[#C2D5EB] py-4 text-center text-2xl">
        Let's Get Focused Together!
      </div>
      <div className="px-12 py-12">
        <div>
          FocusMonster enhances your focus by analyzing your screen time
          activity and providing AI-driven feedback!
        </div>
        <DescriptionList />
      </div>
    </div>
  );
}

type Description = {
  id: number;
  title: string;
  body: string;
  order: number;
  createdDateTime: string;
  lastModifiedDateTime: string;
};

function DescriptionList() {
  const { data, isLoading } = useQuery<Description[]>({
    queryKey: ["about-us-description"],
    queryFn: async () => {
      const response = await fetch("/api/about");
      return response.json();
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return <p>Oops.. Something wrong happened</p>;
  }

  return (
    <div className="flex flex-col gap-6 pt-12">
      {data
        .sort((a, b) => a.order - b.order)
        .map((description) => (
          <div key={description.id} className="flex gap-10">
            <img
              src={`/about-us-${description.order}.png`}
              width="250px"
              height="100px"
            />
            <div className="flex flex-col justify-center gap-4">
              <div className="flex items-center gap-4 text-2xl font-semibold">
                <div className="rounded-[100%] bg-black px-4 py-0.5 text-white">
                  {description.order}
                </div>
                {description.title}
              </div>
              <div className="text-balance">{description.body}</div>
            </div>
          </div>
        ))}
    </div>
  );
}

function TermsAndPolicies() {
  return (
    <div className="flex h-full w-full flex-col overflow-clip rounded-3xl bg-white">
      <div className="bg-[#C2D5EB] py-4 text-center text-2xl">
        Terms and Policies
      </div>
      <div className="grow overflow-clip rounded-3xl bg-white">
        <div className="flex h-full items-center justify-evenly px-12 py-12">
          <UserAgreementDialog />
          <PrivacyPolicyDialog />
        </div>
      </div>
    </div>
  );
}

function ContactUs() {
  return (
    <div
      style={{
        backgroundImage: "url(/sticky-note.png)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
      className="grid h-[300px] place-content-center place-items-center gap-10"
    >
      <div className="text-2xl">Feel Free to Contact Us</div>
      <div className="flex gap-16">
        <a href="mailto:focusmonster.official@gmail.com">
          <img src="/email.png" width="82px" height="62px" />
        </a>
        <a href="https://www.instagram.com/focusmonster.official">
          <img src="/instagram.png" width="65px" height="61px" />
        </a>
      </div>
    </div>
  );
}
