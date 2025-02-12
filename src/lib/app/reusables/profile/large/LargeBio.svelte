<script lang="ts">
    import Textarea from '$lib/components/ui/textarea/textarea.svelte';
    import linkifyHtml from 'linkify-html';

    export let bio: string;
    export let editable = false;
</script>

{#if bio || editable}
    <h1 class="text-xs font-bold select-none">Bio</h1>

    {#if !editable}
        <h1
            class="text-xs mt-1 max-w-[425px] overflow-hidden text-ellipsis whitespace-pre-wrap"
        >
            {@html linkifyHtml(bio, {
                attributes: {
                    class: 'text-link font-medium hover:underline no-underline',
                    target: '_blank',
                },
            })}
        </h1>
    {:else}
        <Textarea
            class="text-xs mt-1 max-w-[425px] pb-6 max-h-[150px] overflow-hidden text-ellipsis whitespace-pre-wrap pr-1.5 pl-1.5"
            bind:value={bio}
            maxlength={128}
        />

        <h1
            class="text-[0.7rem] fixed w-full text-right translate-x-[-95px] translate-y-[-22px] select-none"
        >
            {bio.length} / 128
        </h1>
    {/if}
{/if}
