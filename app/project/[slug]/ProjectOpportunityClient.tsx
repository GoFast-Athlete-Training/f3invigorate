"use client";

import { FormEvent, useMemo, useState } from "react";

type MemberView = {
  id: string;
  f3Name: string;
  avatarUrl: string;
};

type ChatMessage = {
  id: string;
  authorF3Name: string;
  authorAvatarUrl: string;
  text: string;
  timeLabel: string;
};

type Props = {
  title: string;
  sponsoringAo: string;
  photoUrl: string;
  description: string;
  whatYoullDo: string;
  dateLabel: string;
  startTimeLabel: string;
  endTimeLabel: string;
  address: string;
  postProjectCoffeeLocation: string;
  mapUrl: string;
  initialMembers: MemberView[];
};

const demoViewer: MemberView = {
  id: "viewer-demo",
  f3Name: "Project Q",
  avatarUrl: "https://randomuser.me/api/portraits/men/83.jpg",
};

export default function ProjectOpportunityClient({
  title,
  sponsoringAo,
  photoUrl,
  description,
  whatYoullDo,
  dateLabel,
  startTimeLabel,
  endTimeLabel,
  address,
  postProjectCoffeeLocation,
  mapUrl,
  initialMembers,
}: Props) {
  const [members, setMembers] = useState<MemberView[]>(initialMembers);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const groundHog = initialMembers.find((member) => member.f3Name === "Ground Hog");
    const slingShot = initialMembers.find((member) => member.f3Name === "Sling Shot");
    const ironMike = initialMembers.find((member) => member.f3Name === "Iron Mike");
    return [
      {
        id: "msg-1",
        authorF3Name: "Ground Hog",
        authorAvatarUrl: groundHog?.avatarUrl ?? "https://randomuser.me/api/portraits/men/12.jpg",
        text: "What time we show up?",
        timeLabel: "7:02 PM",
      },
      {
        id: "msg-2",
        authorF3Name: "Sling Shot",
        authorAvatarUrl: slingShot?.avatarUrl ?? "https://randomuser.me/api/portraits/men/24.jpg",
        text: "Let’s lock in for 7:45 and roll together.",
        timeLabel: "7:04 PM",
      },
      {
        id: "msg-3",
        authorF3Name: "Iron Mike",
        authorAvatarUrl: ironMike?.avatarUrl ?? "https://randomuser.me/api/portraits/men/31.jpg",
        text: "Can’t wait. Bringing extra gloves.",
        timeLabel: "7:06 PM",
      },
    ];
  });
  const [isJoined, setIsJoined] = useState(
    initialMembers.some((member) => member.id === demoViewer.id)
  );

  const joinLabel = useMemo(() => (isJoined ? "Joined" : "Join this Project"), [isJoined]);

  const handleJoinToggle = () => {
    if (isJoined) {
      setMembers((prev) => prev.filter((member) => member.id !== demoViewer.id));
      setIsJoined(false);
      return;
    }
    setMembers((prev) => [demoViewer, ...prev]);
    setIsJoined(true);
  };

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed) return;
    const now = new Date();
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${now.getTime()}`,
        authorF3Name: demoViewer.f3Name,
        authorAvatarUrl: demoViewer.avatarUrl,
        text: trimmed,
        timeLabel: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      },
    ]);
    setMessageInput("");
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-3">
      <section className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <img src={photoUrl} alt={title} className="h-56 w-full object-cover sm:h-72" />
        </div>

        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-600">Sponsoring AO: {sponsoringAo}</p>
        </div>

        <article className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Description
              </h2>
              <p className="mt-1 text-gray-800">{description}</p>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                What You&apos;ll Do
              </h2>
              <p className="mt-1 text-gray-800">{whatYoullDo}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <p className="text-gray-800">
                <span className="font-semibold text-gray-500">Date:</span> {dateLabel}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold text-gray-500">Time:</span> {startTimeLabel} - {endTimeLabel}
              </p>
            </div>

            <div>
              <p className="text-gray-800">
                <span className="font-semibold text-gray-500">Address:</span> {address}
              </p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex text-sm font-semibold text-blue-600 hover:underline"
              >
                Open in Google Maps
              </a>
            </div>

            <p className="text-gray-800">
              <span className="font-semibold text-gray-500">Post-project coffee:</span>{" "}
              {postProjectCoffeeLocation}
            </p>
          </div>
        </article>

        <button
          type="button"
          onClick={handleJoinToggle}
          className={`mt-6 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
            isJoined
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {joinLabel}
        </button>
      </section>

      <aside className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            You&apos;re viewing as
          </p>
          <div className="mt-2 flex items-center gap-3">
            <img
              src={demoViewer.avatarUrl}
              alt={demoViewer.f3Name}
              className="h-10 w-10 rounded-full border border-gray-200"
            />
            <p className="text-sm font-semibold text-gray-900">{demoViewer.f3Name}</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900">Who&apos;s Joining</h2>
        <p className="mt-1 text-sm text-gray-600">{members.length} members joined</p>

        <ul className="mt-4 space-y-3">
          {members.map((member) => (
            <li key={member.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatarUrl}
                  alt={member.f3Name}
                  className="h-10 w-10 rounded-full border border-gray-200 bg-white"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{member.f3Name}</p>
                  <p className="text-xs text-gray-600">F3 HIM</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <section className="mt-6 border-t border-gray-200 pt-5">
          <h3 className="text-base font-semibold text-gray-900">Project Chatter</h3>
          <p className="mt-1 text-xs text-gray-600">RunCrew-style team banter</p>

          <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div key={message.id} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                <div className="flex items-center gap-2">
                  <img
                    src={message.authorAvatarUrl}
                    alt={message.authorF3Name}
                    className="h-7 w-7 rounded-full border border-gray-200"
                  />
                  <p className="text-xs font-semibold text-gray-900">{message.authorF3Name}</p>
                  <span className="text-[11px] text-gray-500">{message.timeLabel}</span>
                </div>
                <p className="mt-1 text-sm text-gray-800">{message.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              placeholder="Drop a quick message..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Send
            </button>
          </form>
        </section>
      </aside>
    </div>
  );
}
