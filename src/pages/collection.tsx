const imageCards = [
  {
    key: 1,
    image:
      "https://kr.object.ncloudstorage.com/gemini/failure/stress%20at%20work.png",
    date: "2024-07-22T12:48:25.613",
    multiple: false,
  },
  {
    key: 2,
    image: "https://pbs.twimg.com/media/GGjuFyDbAAAOtOz.jpg",
    date: "2024-07-23T12:48:25.613",
    multiple: true,
  },
  {
    key: 3,
    image:
      "https://kr.object.ncloudstorage.com/gemini/failure/Being%20Adult%20is%20bad%20for%20health..jpg",
    date: "2024-07-24T12:48:25.613",
    multiple: false,
  },
  {
    key: 4,
    image:
      "https://kr.object.ncloudstorage.com/gemini/success/Waiting%20for%20the%20f_ckening.jpg",
    date: "2024-07-25T12:48:25.613",
    multiple: false,
  },
  {
    key: 5,
    image:
      "https://kr.object.ncloudstorage.com/gemini/success/F_k%20you%20and%20I_ll%20see%20you%20tomo.jpg",
    date: "2024-07-25T12:48:25.613",
    multiple: false,
  },
  {
    key: 6,
    image:
      "https://kr.object.ncloudstorage.com/gemini/success/50%20shades%20of%20grey%E2%80%A6%20under%20my%20ey.jpg",
    date: "2024-07-25T12:48:25.613",
    multiple: false,
  },
  {
    key: 7,
    image:
      "https://kr.object.ncloudstorage.com/gemini/failure/Monday%20mornings..jpg",
    date: "2024-07-25T12:48:25.613",
    multiple: false,
  },
  {
    key: 8,
    image:
      "https://kr.object.ncloudstorage.com/gemini/failure/stress%20at%20work.png",
    date: "2024-07-25T12:48:25.613",
    multiple: false,
  },
];

export default function Collection() {
  return (
    <div className="relative mx-auto">
      <div className="grid h-full w-full grid-cols-5 gap-12 p-8 blur">
        {imageCards.length === 0 ? (
          <p>Your collection is empty</p>
        ) : (
          imageCards.map(({ key, ...imageCard }) => (
            <ImageCard key={key} {...imageCard} />
          ))
        )}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-2xl text-neutral-100">
        <div>Coming Soon!</div>
        <div>Stay Tuned for Exciting Updates 🥰</div>
      </div>
    </div>
  );
}

function ImageCard({
  image,
  date,
  multiple,
}: {
  image: string;
  date: string;
  multiple: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="overflow-clip rounded-lg drop-shadow">
          <img
            height="180px"
            width="180px"
            loading="lazy"
            src={image}
            alt="image"
            className="w-full bg-gray-400 bg-cover"
          />
          <div className="absolute inset-0 -z-10 animate-pulse overflow-clip rounded-lg bg-neutral-400"></div>
        </div>
        {multiple ? (
          <div className="absolute inset-0 -z-10 rotate-12 overflow-clip rounded-lg bg-neutral-600 drop-shadow"></div>
        ) : null}
      </div>

      <p className="text-center text-neutral-50">{formatDate(date)}</p>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toDateString();
}
