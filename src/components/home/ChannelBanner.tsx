import { channelData } from "@/lib/stores";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useReadable } from "react-use-svelte-store";

export default function ChannelBanner() {
  const $channelData = useReadable(channelData);

  return (
    <div className="w-full h-[53px] flex items-center p-3 border-b select-none">
      <ChatBubbleIcon className="mr-2" width={24} height={20} />
      <h1 className="font-medium">{$channelData.name}</h1>
    </div>
  );
}
