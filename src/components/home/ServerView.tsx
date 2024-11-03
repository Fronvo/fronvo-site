import {
  banningMembers,
  creatingChannel,
  creatingRole,
  deletingRole,
  deletingServer,
  editingRole,
  editingServer,
  leavingServer,
  managingChannels,
  managingMembers,
  managingRoles,
  serverData,
  userData,
} from "@/lib/stores";
import {
  ChatBubbleIcon,
  CircleBackslashIcon,
  CopyIcon,
  ExclamationTriangleIcon,
  HamburgerMenuIcon,
  Link2Icon,
  LoopIcon,
  MagicWandIcon,
  MixIcon,
  Pencil1Icon,
  PersonIcon,
  PlusIcon,
  TrashIcon,
  ViewVerticalIcon,
} from "@radix-ui/react-icons";
import { useWritable } from "react-use-svelte-store";
import PropChannel from "./PropChannel";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Separator } from "../ui/separator";
import Channel from "./ServerChannel";

export default function ServerView() {
  const [$userData, setUserData] = useWritable(userData);
  const [$serverData, setServerData] = useWritable(serverData);
  const [_, setEditingServer] = useWritable(editingServer);
  const [__, setDeletingServer] = useWritable(deletingServer);
  const [___, setLeavingServer] = useWritable(leavingServer);
  const [____, setCreatingChannel] = useWritable(creatingChannel);
  const [_____, setManagingMembers] = useWritable(managingMembers);
  const [______, setBanningMembers] = useWritable(banningMembers);
  const [_______, setCreatingRole] = useWritable(creatingRole);
  const [________, setEditingRole] = useWritable(editingRole);
  const [_________, setDeletingRole] = useWritable(deletingRole);
  const [__________, setManagingRoles] = useWritable(managingRoles);
  const [___________, setManagingChannels] = useWritable(managingChannels);

  const isOwner = $userData.id === $serverData.owner_id;

  function copyInvite(showToast: boolean = false) {
    navigator.clipboard.writeText($serverData.invite);

    if (showToast === true) {
      toast.success("Invite copied to clipboard!");
    }
  }

  function regenerateInvite() {
    toast.promise(regenerateInvitePromise, {
      loading: "Regenerating invite...",
      success: () => "Invite regenerated and copied to clipboard!",
      error: (e) => e,
    });

    async function regenerateInvitePromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("/api/invites/regenerate", {
          method: "POST",
          body: JSON.stringify({
            id: $serverData.id,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          resolve("");

          const invite = (await res.json()).invite as string;

          let newServers = $userData.servers;

          setServerData({ ...$serverData, invite });

          newServers = newServers.map((v) => {
            if (v.id === $serverData.id) {
              return { ...$serverData, invite };
            } else return v;
          });

          setUserData({
            ...$userData,
            servers: newServers,
          });

          navigator.clipboard.writeText(invite);
        } else {
          reject((await res.json()).errors[0].message);
        }
      });
    }
  }

  function toggleInvite() {
    const disabling = !$serverData.invites_disabled;

    toast.promise(toggleInvitePromise, {
      loading: `${disabling ? "Disabling" : "Enabling"} invite...`,
      success: () => `Invite ${disabling ? "disabled" : "enabled"}!`,
      error: (e) => e,
    });

    async function toggleInvitePromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch(
          `/api/invites/${disabling ? "disable" : "enable"}`,
          {
            method: "POST",
            body: JSON.stringify({
              id: $serverData.id,
            }),
            headers: {
              Authorization: Cookies.get("accessToken") as string,
              "content-type": "application/json",
            },
          }
        );

        if (res.status === 200) {
          resolve("");

          // Visual delay
          setTimeout(() => {
            setServerData({
              ...$serverData,
              invites_disabled: !$serverData.invites_disabled,
            });
          }, 100);

          let newServers = $userData.servers;

          newServers = newServers.map((v) => {
            if (v.id === $serverData.id) {
              return {
                ...$serverData,
                invites_disabled: !$serverData.invites_disabled,
              };
            } else return v;
          });

          setUserData({
            ...$userData,
            servers: newServers,
          });
        } else {
          reject((await res.json()).errors[0].message);
        }
      });
    }
  }

  return (
    <>
      <div className="w-full items-center transition-[150ms] select-none">
        {$serverData.banner && (
          <img
            src={`${$serverData.banner}/tr:pr-true,q-60`}
            className="w-full min-w-full min-h-[200px] max-h-[200px] object-cover opacity-70"
            draggable={false}
          />
        )}

        <div
          className={`${
            $serverData.banner &&
            "translate-y-[-200px] bg-background/75 backdrop-blur-sm"
          } p-2 pr-2 pl-5 flex items-center`}
        >
          <h1 className="flex-1 text-sm z-10 font-medium">
            {$serverData.name}
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant={"ghost"}
                size="icon"
                className={`${
                  $serverData.banner && "hover:bg-primary/10"
                } p-0 m-0 z-10`}
              >
                <HamburgerMenuIcon width={20} height={20} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[175px]">
              {isOwner && (
                <>
                  <DropdownMenuItem onClick={() => setEditingServer(true)}>
                    <Pencil1Icon className="mr-2" /> Edit
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Link2Icon className="mr-2" /> Invite
                </DropdownMenuSubTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-[175px]">
                    <DropdownMenuItem onClick={() => copyInvite(true)}>
                      <CopyIcon className="mr-2" /> Copy
                    </DropdownMenuItem>

                    {isOwner && (
                      <>
                        <DropdownMenuItem onClick={regenerateInvite}>
                          <LoopIcon className="mr-2" /> Regenerate
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={toggleInvite}>
                          <ExclamationTriangleIcon
                            className="mr-2"
                            color={"red"}
                          />
                          {$serverData.invites_disabled ? "Enable" : "Disable"}{" "}
                          invite
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              {isOwner && (
                <>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <MagicWandIcon className="mr-2" /> Roles
                    </DropdownMenuSubTrigger>

                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="w-[175px]">
                        <DropdownMenuItem onClick={() => setCreatingRole(true)}>
                          <PlusIcon className="mr-2" /> Create
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setManagingRoles(true)}
                        >
                          <ViewVerticalIcon className="mr-2" /> Manage
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ChatBubbleIcon className="mr-2" /> Channels
                    </DropdownMenuSubTrigger>

                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="w-[175px]">
                        <DropdownMenuItem
                          onClick={() => setCreatingChannel(true)}
                        >
                          <PlusIcon className="mr-2" /> Create
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setManagingChannels(true)}
                        >
                          <ViewVerticalIcon className="mr-2" /> Manage
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <PersonIcon className="mr-2" /> Members
                    </DropdownMenuSubTrigger>

                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="w-[175px]">
                        <DropdownMenuItem
                          onClick={() => setManagingMembers(true)}
                        >
                          <ViewVerticalIcon className="mr-2" /> Manage
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => setBanningMembers(true)}
                        >
                          <CircleBackslashIcon className="mr-2" color={"red"} />
                          Bans
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  isOwner ? setDeletingServer(true) : setLeavingServer(true)
                }
              >
                <TrashIcon className="mr-2" color={"red"} />{" "}
                {isOwner ? "Delete" : "Leave"} server
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {!$serverData.banner && <Separator />}

      {$serverData.channels.length === 0 ? (
        <div className={`${$serverData.banner && "translate-y-[-50px]"}`}>
          <PropChannel />
          <PropChannel />
          <PropChannel />
          <PropChannel />
          <PropChannel />
        </div>
      ) : (
        <div
          className={`${
            $serverData.banner && "translate-y-[-50px]"
          } flex flex-col space-y-1.5 w-full pt-2 pb-2`}
        >
          {$serverData.channels.map((channel) => (
            <Channel key={channel.id} channel={channel} />
          ))}
        </div>
      )}
    </>
  );
}
