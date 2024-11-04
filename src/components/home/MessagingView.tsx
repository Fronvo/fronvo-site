import { channelData, serverData } from "@/lib/stores";
import { useReadable } from "react-use-svelte-store";
import ChannelView from "./ChannelView";
import EmptyMessagingView from "./EmptyMessagingView";

export default function MessagingView() {
  const $serverData = useReadable(serverData);
  const $channelData = useReadable(channelData);

  return (
    <>
      {$serverData && $channelData ? <ChannelView /> : <EmptyMessagingView />}
    </>
  );
}
