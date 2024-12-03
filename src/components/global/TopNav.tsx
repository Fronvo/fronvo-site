"use client";

import { Button } from "../ui/button";
import ThemeToggle from "./ThemeToggle";
import {
  ArrowRightIcon,
  BellIcon,
  FileIcon,
  GearIcon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
  ImageIcon,
  LockOpen1Icon,
  MagnifyingGlassIcon,
  PaperPlaneIcon,
  PersonIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useReadable, useWritable } from "react-use-svelte-store";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  authenticated,
  loggingOut,
  messaging,
  settingsOpen,
  sharingPost,
  switchingAccounts,
  updatingProfileNote,
  userData,
} from "@/lib/stores";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { convertLastStatusToStatus } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { LastStatus, UserData } from "@/lib/types";

interface Props {
  isHomepage?: boolean;
  notFixed?: boolean;
  forceShowSheet?: boolean;
}

interface TopNavHeader {
  title: string;
  ref: string;
}

export default function TopNav({
  isHomepage = false,
  notFixed = false,
  forceShowSheet = false,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [hasJWT, setHasJWT] = useState(false);
  const [isInHome, setIsInHome] = useState(false);
  const $authenticated = useReadable(authenticated);
  const [$messaging, setMessaging] = useWritable(messaging);

  const [$userData, setUserData] = useWritable(userData);
  const [$status, setStatus] = useState($userData?.status);

  const [_, setUpdatingProfileNote] = useWritable(updatingProfileNote);
  const [__, setSharingPost] = useWritable(sharingPost);
  const [___, setSettingsOpen] = useWritable(settingsOpen);
  const [____, setSwitchingAccounts] = useWritable(switchingAccounts);
  const [_____, setLoggingOut] = useWritable(loggingOut);

  const headers: TopNavHeader[] = [];

  function scrollTop() {
    window.scrollTo({
      top: 0,
    });
  }

  const handleHome = () => {
    router.replace("/home");
  };

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      setHasJWT(true);
    }

    setIsInHome(location.href.endsWith("/home"));
  }, []);

  async function updateStatus(status: LastStatus) {
    await fetch("api/me/status", {
      method: "POST",
      body: JSON.stringify({
        status,
      }),
      headers: {
        Authorization: Cookies.get("accessToken") as string,
        "content-type": "application/json",
      },
    });

    setStatus(status);

    setUserData({
      ...$userData,
      status,
    });
  }

  return (
    <div
      className={`${
        !notFixed ? "fixed top-0 right-0 left-0" : ""
      } mobile:w-[100%] bg-background/70 backdrop-blur-md m-auto w-screen pr-0 pl-0 h-[64px] max-h-[64px] p-4 select-none`}
    >
      <div className="mobile:pl-4 mobile:pr-6 flex items-center pl-[15%] pr-[15%] mb-3">
        {(isHomepage || forceShowSheet) && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="xs:inline-flex hidden mr-3 min-w-[36px]"
              >
                <HamburgerMenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="min-w-[250px] w-[40%]">
              <SheetHeader>
                <SheetTitle asChild>
                  <div className="flex items-center">
                    {!isInHome && (
                      <>
                        <Link href="https://stamtsag.com">
                          <img
                            src="/stamtsag.ico"
                            className="w-[28px] h-[28px] mr-2 cursor-pointer"
                          />
                        </Link>

                        <h1 className="font-black text-3xl mr-2">/</h1>
                      </>
                    )}

                    <img
                      onClick={scrollTop}
                      src="/fronvo.svg"
                      className="w-[28px] h-[28px] mr-2 cursor-pointer"
                    />
                    <h1
                      onClick={scrollTop}
                      className="xs:text-lg tracking-tighter font-bold text-xl mr-6 translate-x-[-3px] font-black cursor-pointer"
                    >
                      Fronvo
                    </h1>
                  </div>
                </SheetTitle>
                <SheetDescription>
                  <div className="flex flex-col ml-1">
                    {!isInHome ? (
                      <>
                        {headers.map(({ title, ref }) => {
                          return (
                            <div key={title} className="flex mt-2 mb-2">
                              <h1
                                onClick={() => {
                                  document
                                    .querySelector(`#${ref}`)
                                    ?.scrollIntoView({ block: "start" });

                                  setOpen(false);
                                }}
                                className="hover:opacity-[100%] tracking-thin font-medium opacity-[60%] text-sm w-max cursor-pointer transition-[150ms]"
                              >
                                {title}
                              </h1>
                            </div>
                          );
                        })}

                        <span className="mt-6" />

                        {!hasJWT && (
                          <Link href="/auth?for=login" className="w-[100%]">
                            <Button className="mb-4 w-full" variant={"outline"}>
                              Login
                            </Button>
                          </Link>
                        )}

                        <Link
                          href={`${hasJWT ? "/home" : "/auth"}`}
                          className="w-[100%]"
                        >
                          <Button className="w-full">
                            {hasJWT ? "Home" : "Register"}
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <div className="flex flex-col items-center min-w-[200px] w-[200px] pt-4"></div>
                    )}
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        )}

        {isHomepage ? (
          <>
            <Link href="https://stamtsag.com">
              <img
                src="/stamtsag.ico"
                className="xs:hidden w-[28px] h-[28px] mr-2 cursor-pointer"
              />
            </Link>

            <h1 className="xs:hidden font-black text-3xl mr-2">/</h1>

            <img
              onClick={scrollTop}
              src="/fronvo.svg"
              className="xs:hidden w-[28px] h-[28px] mr-2 cursor-pointer"
            />
            <h1
              onClick={!isInHome ? scrollTop : handleHome}
              className="xs:text-lg tracking-tighter font-bold text-xl mr-6 translate-x-[-3px] font-black cursor-pointer"
            >
              Fronvo
            </h1>
          </>
        ) : (
          <Link
            href={`${!isInHome ? "/" : "/home"}`}
            className="flex items-center no-underline"
            onClick={!isInHome ? scrollTop : handleHome}
          >
            <img
              src="/fronvo.svg"
              className="w-[28px] h-[28px] mr-2 cursor-pointer"
            />
            <h1 className="xs:text-lg tracking-tighter font-bold text-xl mr-6 translate-x-[-3px] font-black cursor-pointer">
              Fronvo
            </h1>
          </Link>
        )}

        {!$authenticated ? (
          <>
            {headers.map(({ title, ref }) => {
              return (
                <div
                  onClick={() =>
                    document.querySelector(`#${ref}`)?.scrollIntoView({
                      block: "start",
                    })
                  }
                  key={title}
                  className="flex items-center mr-6"
                >
                  <h1 className="xs:hidden hover:opacity-[100%] tracking-thin font-medium opacity-[60%] text-sm w-max cursor-pointer transition-[150ms]">
                    {title}
                  </h1>
                </div>
              );
            })}

            <span className="flex-1" />

            <div className="xs:hidden flex">
              {isHomepage && (
                <>
                  {!hasJWT && (
                    <Link href="/auth?for=login">
                      <Button variant={"outline"}>Login</Button>
                    </Link>
                  )}

                  <Link href={`${hasJWT ? "/home" : "/auth"}`} className="ml-4">
                    <Button>{hasJWT ? "Home" : "Register"}</Button>
                  </Link>
                </>
              )}

              <a
                href="https://github.com/Fronvo"
                target="_blank"
                className="mr-2 ml-10"
              >
                <Button size="icon" variant="ghost">
                  <GitHubLogoIcon className="w-[20px] h-[20px]" />
                </Button>
              </a>
            </div>
          </>
        ) : (
          <>
            <span className="flex-1" />

            <div className="mobile-md:hidden fixed top-[19px] w-max m-auto right-0 left-0 flex-1 flex items-center justify-center">
              <Button
                variant={"outline"}
                className="flex items-center justify-start w-[300px]"
              >
                <MagnifyingGlassIcon className="w-[18px] h-[18px] mr-1" />
                {$messaging ? "Find conversations" : "Search for users"}
              </Button>
            </div>

            <TooltipProvider delayDuration={750} disableHoverableContent>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size="icon"
                    className="mobile-md:flex hidden ml-2"
                  >
                    <MagnifyingGlassIcon width={22} height={22} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={750} disableHoverableContent>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setMessaging(!$messaging)}
                    variant={"ghost"}
                    size="icon"
                    className="ml-2 mr-2"
                  >
                    {!$messaging ? (
                      <PaperPlaneIcon width={20} height={20} />
                    ) : (
                      <ImageIcon width={20} height={20} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {!$messaging ? "Messaging" : "Home"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}

        <ThemeToggle />

        {$authenticated && <span className="mr-4" />}

        {$authenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <TooltipProvider delayDuration={750} disableHoverableContent>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="xs:w-max flex justify-start mr-2 w-[200px] pt-5 pb-5 m-0"
                    >
                      {!$userData?.avatar ? (
                        <PersonIcon
                          width={20}
                          height={20}
                          className="xs:mr-0 min-w-[20px] min-h-[20px] mr-2"
                        />
                      ) : (
                        <img
                          src={$userData.avatar}
                          className="min-w-[20px] min-h-[20px] w-[20px] h-[20px] rounded-full mr-2"
                        />
                      )}

                      <div className="xs:hidden flex flex-col items-start">
                        <h1 className="translate-y-[3px] max-w-[150px] overflow-hidden text-ellipsis text-[0.9rem] font-bold m-0 p-0">
                          {$userData.username}
                        </h1>

                        <div className="flex items-center">
                          <div
                            className={`${
                              $userData?.status === 0 &&
                              "bg-online border-online"
                            } ${
                              $userData?.status === 1 && "bg-dnd border-dnd"
                            } ${
                              $userData?.status === 2 && "bg-idle border-idle"
                            } ${
                              $userData?.status === 3 &&
                              "bg-none border-offline"
                            } rounded-full w-[8px] h-[8px] border-2 mr-1 duration-150`}
                          />

                          <h1 className="text-[0.7rem] max-w-[130px] overflow-hidden text-ellipsis">
                            {($userData.status || $userData.status === 0) &&
                            !$userData.note
                              ? convertLastStatusToStatus($userData.status)
                              : $userData.note}
                          </h1>
                        </div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {$userData?.username} ({$userData?.id})
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuItem>
                <PersonIcon className="mr-2" /> View profile
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <BellIcon className="mr-2" /> Status
                </DropdownMenuSubTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      // @ts-ignore
                      value={$status}
                      // @ts-ignore
                      onValueChange={(e) => updateStatus(e)}
                    >
                      {/* @ts-ignore */}
                      <DropdownMenuRadioItem value={0}>
                        Online
                      </DropdownMenuRadioItem>
                      {/* @ts-ignore */}
                      <DropdownMenuRadioItem value={1}>
                        Do Not Disturb
                      </DropdownMenuRadioItem>
                      {/* @ts-ignore */}
                      <DropdownMenuRadioItem value={2}>
                        Idle
                      </DropdownMenuRadioItem>
                      {/* @ts-ignore */}
                      <DropdownMenuRadioItem value={3}>
                        Offline
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setUpdatingProfileNote(true)}>
                <FileIcon className="mr-2" /> Update note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSharingPost(true)}>
                <PlusIcon className="mr-2" /> Share post
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <GearIcon className="mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSwitchingAccounts(true)}>
                <LockOpen1Icon className="mr-2" /> Switch accounts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLoggingOut(true)}>
                <ArrowRightIcon className="mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Separator />
    </div>
  );
}
