import { channelData } from "@/lib/stores";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useReadable } from "react-use-svelte-store";

export default function ChannelChat() {
  const $channelData = useReadable(channelData);

  return (
    <div className="flex flex-col flex-1 p-4 justify-end select-none">
      <div className="p-4 bg-border/50 border rounded-full w-max">
        <ChatBubbleIcon width={32} height={32} />
      </div>

      <h1 className="text-xl mt-2 font-bold">
        Welcome to #{$channelData.name}!
      </h1>
      <h1 className="text-sm mt-2 font-normal text-primary/75">
        This is the start of the channel.
      </h1>
    </div>
  );
}
