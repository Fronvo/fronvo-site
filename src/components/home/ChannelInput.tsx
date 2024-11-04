import { useReadable } from "react-use-svelte-store";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import { channelData } from "@/lib/stores";
import { CardStackIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useEffect } from "react";

export default function ChannelInput() {
  const $channelData = useReadable(channelData);

  useEffect(() => {
    setTimeout(() => {
      const el = document.getElementById("channel-input");

      if (el) el.focus();
    }, 0);
  }, [$channelData]);

  return (
    <div className="flex mr-3 ml-3 mb-3 border rounded-md pr-3 pl-3">
      <TooltipProvider delayDuration={750} disableHoverableContent>
        <Tooltip>
          <TooltipTrigger asChild>
            <CardStackIcon
              className="hover:fill-white cursor-pointer h-full"
              width={22}
              height={22}
            />
          </TooltipTrigger>
          <TooltipContent>Upload files</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AutosizeTextarea
        id="channel-input"
        autoFocus
        minHeight={20}
        maxHeight={250}
        className="border-none"
        placeholder={`Message #${$channelData.name}`}
      />
    </div>
  );
}
