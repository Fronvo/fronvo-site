import { channelData, serverData } from "@/lib/stores";
import { ChatBubbleIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { useReadable, useWritable } from "react-use-svelte-store";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import MemberView from "./MemberView";

export default function ChannelBanner() {
  const $serverData = useReadable(serverData);
  const [$channelData, setChannelData] = useWritable(channelData);

  function exitChannel() {
    if (document.body.clientWidth < 1075) {
      // @ts-ignore
      setChannelData(undefined);
    }
  }

  return (
    <div className="w-full h-[53px] flex items-center p-3 border-b select-none">
      <div className="flex items-center" onClick={exitChannel}>
        {document.body.clientWidth < 1075 && <ChevronLeftIcon />}

        <ChatBubbleIcon className="mr-1" width={24} height={20} />
        <h1 className="font-medium">{$channelData.name}</h1>
      </div>

      <span className="flex-1" />

      {document.body.clientWidth < 1075 && (
        <Button size="icon" variant={"outline"} className="rounded-full">
          <Sheet>
            <SheetTrigger asChild>
              <ChevronLeftIcon />
            </SheetTrigger>

            <SheetContent>
              <div className="w-full flex flex-col h-full items-center select-none">
                <h1 className="text-xs font-semibold uppercase opacity-75 w-full mt-3 mb-2 ml-7">
                  Members -- {$serverData.members.length}
                </h1>

                <div className="flex flex-col w-full">
                  {$serverData.members.map((member) => (
                    <MemberView key={member.id} member={member} />
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </Button>
      )}
    </div>
  );
}
