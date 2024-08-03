import { useAuth } from "@/hooks/auth";
import Folder from "../components/folder";

type Session = {
  id: number;
  userSocialId: string;
  duration: {
    hours: number;
    minutes: number;
  };
  banedSiteAccessLog: {
    name: string;
    count: number;
  }[];
  history: string[];
  focusStatus: string;
  image: string;
  evaluation: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
};

const data: Session[] = [
  {
    id: 28,
    userSocialId: "116618166312500650927",
    duration: {
      hours: 2,
      minutes: 30,
    },
    banedSiteAccessLog: [
      {
        name: "YouTube",
        count: 3,
      },
      {
        name: "WhatsApp",
        count: 1,
      },
      {
        name: "Instagram",
        count: 10,
      },
    ],
    history: [
      "사용자의 직업에 대한 설명은 다음과 같습니다. '개발자'\n\n사용자가 평소에 하는 일은 다음과 같습니다. '평소에 하는 일은 코딩하기 게임하기 입니다'\n\n사용자는 2 시간 30 분 동안 집중을 하기로 했습니다.\n",
      "사용자는 메신저 앱에서 친구들과 대화를 하고 있습니다. 친구들과의 대화 내용은 LG 유플러스 알림, 하나머니, 인프런, 무신사스토어, 웨이프, 톡스, 제주항공 안내 입니다.  ",
      "게임 리그 오브 레전드를 플레이하고 있습니다. 게임 화면 하단의 'Level Up!' 메시지를 볼 수 있습니다.",
      "사용자가 집중 시간동안 접근이 금지된 YouTube 에 3 회 접근했습니다\n\n사용자가 집중 시간동안 접근이 금지된 WhatsApp 에 1 회 접근했습니다\n\n사용자가 집중 시간동안 접근이 금지된 Instagram 에 10 회 접근했습니다\n\n",
      "사용자가 2 시간 30 분 동안 집중에 성공했습니다!",
    ],
    focusStatus: "SUCCEED",
    image: "https://pbs.twimg.com/media/GGjuFyDbAAAOtOz.jpg",
    evaluation:
      "와! 오늘 개발자로서의 열정이 정말 대단했네요! 2시간 30분 동안 집중력을 유지하며 코딩과 게임에 몰두하다니, 정말 대단해요! 친구들과의 대화 내용을 보니 LG 유플러스 알림, 하나머니, 인프런, 무신사스토어, 웨이프, 톡스, 제주항공 안내 등 꽤 중요한 정보들이 오갔던 것 같아요. 그 와중에도 흔들리지 않고 집중력을 유지한 당신, 정말 프로페셔널이에요! 특히 게임 중에 'Level Up!' 메시지를 보니 게임 실력도 쑥쑥 늘고 있는 것 같아요. \\n\\n다만 YouTube, WhatsApp, Instagram에 접근한 기록이 보이는데, 혹시 잠깐 딴짓을 한 건 아니었을까요? 😉  하지만 2시간 30분 동안 집중 시간을 완벽하게 지켰다는 사실에 박수를 보냅니다! 앞으로도 이처럼 집중력을 유지하며 개발과 게임, 그리고 삶의 균형을 잘 맞춰나가길 바랍니다! 💪 \\n",
    createdDateTime: "2024-07-25T12:48:25.613",
    lastModifiedDateTime: "2024-07-25T12:52:08.784",
  },
  {
    id: 29,
    userSocialId: "116618166312500650927",
    duration: {
      hours: 2,
      minutes: 30,
    },
    banedSiteAccessLog: [
      {
        name: "YouTube",
        count: 3,
      },
      {
        name: "WhatsApp",
        count: 1,
      },
      {
        name: "Instagram",
        count: 10,
      },
    ],
    history: [
      "사용자의 직업에 대한 설명은 다음과 같습니다. '개발자'\n\n사용자가 평소에 하는 일은 다음과 같습니다. '평소에 하는 일은 코딩하기 게임하기 입니다'\n\n사용자는 2 시간 30 분 동안 집중을 하기로 했습니다.\n",
      "사용자가 집중 시간동안 접근이 금지된 YouTube 에 3 회 접근했습니다\n\n사용자가 집중 시간동안 접근이 금지된 WhatsApp 에 1 회 접근했습니다\n\n사용자가 집중 시간동안 접근이 금지된 Instagram 에 10 회 접근했습니다\n\n",
      "사용자가 2 시간 30 분 집중하기로 마음먹었는데 도중에 포기했습니다.",
    ],
    focusStatus: "FAILED",
    image:
      "https://i.etsystatic.com/47076623/r/il/9cc01d/5389231473/il_570xN.5389231473_arvu.jpg",
    evaluation:
      "오늘 2시간 30분 동안 집중해서 코딩을 하겠다고 마음먹었던 당신, 정말 대단해요! 개발자로서 집중력은 정말 중요한 부분이니까요. 😉  \n\n하지만 YouTube, WhatsApp, Instagram에 꽤 자주 접근했던 기록이 보이네요. 특히 Instagram은 무려 10번이나 접속했어요. 혹시 잠시 쉬어가는 시간에 습관처럼 들어가게 되는 건 아닐까요? \n\n아쉽게도 오늘은 2시간 30분 목표를 다 채우지는 못했지만,  포기하지 않고 다시 집중하려는 의지가 중요해요.  다음번에는 조금 더 집중력을 높여서  코딩에 몰입할 수 있도록 노력해 보는 건 어떨까요? 💪 \n\n혹시 집중력을 높이는 데 도움이 필요하다면,  집중 시간 동안 휴대폰을 멀리하거나,  잠깐 쉬는 시간을 정해서  스트레칭을 하는 것도 좋은 방법이에요.  \n\n힘내세요! 당신은 분명 할 수 있어요! 👍 \n",
    createdDateTime: "2024-07-25T12:54:34.654",
    lastModifiedDateTime: "2024-07-25T12:54:49.709",
  },
];

export default function Today() {
  const { data: auth } = useAuth();
  const sessions = data;

  return (
    <div className="p flex flex-col gap-8 px-4 lg:flex-row">
      <div className="mx-auto pb-8">
        <Folder
          title={
            <>
              <span className="text-2xl font-bold">{auth?.nickname}</span>
              {" / "}
              <span>Lv{3}</span>
            </>
          }
        />
      </div>
      <div className="mx-auto flex grow flex-col gap-6">
        {sessions.map((session) => {
          return <SessionCard key={session.id} session={session} />;
        })}
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  return (
    <div className="max-w-lg overflow-clip rounded-lg">
      <div className="w-full bg-blue-200 p-2 text-center">
        {session.createdDateTime}
      </div>
      <div className="flex gap-4 bg-neutral-50 p-4">
        <div className="line-clamp-4">{session.evaluation}</div>
        <div className="aspect-square h-24 flex-shrink-0 bg-neutral-200"></div>
      </div>
    </div>
  );
}
