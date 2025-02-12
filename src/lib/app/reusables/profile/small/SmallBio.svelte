<script lang="ts">
    import linkifyHtml from 'linkify-html';

    export let bio: string;
</script>

{#if bio}
    <h1 class="text-xs font-bold select-none">Bio</h1>

    <h1
        class="text-xs mt-1 max-w-[210px] overflow-hidden text-ellipsis whitespace-pre-wrap"
    >
        {@html linkifyHtml(bio, {
            attributes: {
                class: 'text-link font-medium hover:underline no-underline',
                target: '_blank',
            },
        })}
    </h1>
{/if}
