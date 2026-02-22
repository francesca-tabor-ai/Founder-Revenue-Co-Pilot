"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(
  () => import("@/components/ChatWidget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false, loading: () => null }
);

export function LazyChatWidget() {
  return <ChatWidget />;
}
