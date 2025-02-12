<script lang="ts">
    import { setMode } from 'mode-watcher';
    import { Button } from '$lib/components/ui/button/index.js';
    import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu';
    import { Moon, Sun } from 'radix-icons-svelte';
    import DropdownMenuContent from './ui/dropdown-menu/dropdown-menu-content.svelte';
    import DropdownMenuItem from './ui/dropdown-menu/dropdown-menu-item.svelte';

    export let useButton = false;
</script>

<DropdownMenu>
    <DropdownMenuTrigger class={`${useButton && 'mt-2'} rounded-full`}>
        <Button
            variant={useButton ? 'outline' : 'ghost'}
            size="icon"
            class={useButton && 'w-[48px] h-[48px] rounded-full'}
        >
            <Sun class="dark:hidden" size={18} />

            <Moon size={18} class="hidden dark:block" />

            <span class="sr-only">Toggle theme</span>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
        <DropdownMenuItem on:click={() => setMode('light')}>
            Light
        </DropdownMenuItem>
        <DropdownMenuItem on:click={() => setMode('dark')}>
            Dark
        </DropdownMenuItem>
        <DropdownMenuItem on:click={() => setMode('system')}>
            System
        </DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
