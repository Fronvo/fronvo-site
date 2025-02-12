<script lang="ts">
    import Time from 'svelte-time/src/Time.svelte';

    export let since: string;
</script>

<h1 class="text-xs font-bold select-none">Join date</h1>

<h1 class="text-xs mt-1"><Time timestamp={since} /></h1>
