import { Link1Icon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useReadable, useWritable } from "react-use-svelte-store";
import {
  channelData,
  creatingServer,
  joiningServer,
  userData,
} from "@/lib/stores";
import Server from "./Server";
import HomeButton from "./HomeButton";

export default function ServersList() {
  const $userData = useReadable(userData);
  const $channelData = useReadable(channelData);
  const [_, setCreatingServer] = useWritable(creatingServer);
  const [__, setJoiningServer] = useWritable(joiningServer);

  return (
    <div
      className="no-scrollbar text-center w-[80px] border-r pb-2 border-1 h-full overflow-x-hidden overflow-y-auto"
      style={{
        display:
          document.body.clientWidth < 1075 && $channelData ? "none" : "block",
      }}
    >
      <HomeButton />

      <Separator className="w-[75%] m-auto mb-4" />

      {$userData.servers.length > 0 &&
        $userData.servers.map((server) => {
          return (
            <>
              <Server server={server} />{" "}
            </>
          );
        })}

      <TooltipProvider>
        <Tooltip delayDuration={0} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              variant={"outline"}
              size="icon"
              className="w-[50px] h-[50px] rounded-full p-3 mb-3"
              onClick={() => setCreatingServer(true)}
            >
              <PlusIcon width={48} height={48} />
            </Button>
          </TooltipTrigger>

          <TooltipContent
            side="right"
            sideOffset={16}
            className="font-semibold text-sm flex items-center select-none"
          >
            <div className="flex flex-col items-center">Create server</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip delayDuration={0} disableHoverableContent>
          <TooltipTrigger asChild>
            <Button
              variant={"outline"}
              size="icon"
              className="w-[50px] h-[50px] rounded-full p-3"
              onClick={() => setJoiningServer(true)}
            >
              <Link1Icon width={48} height={48} />
            </Button>
          </TooltipTrigger>

          <TooltipContent
            side="right"
            sideOffset={16}
            className="font-semibold text-sm flex items-center select-none"
          >
            <div className="flex flex-col items-center">Join server</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
