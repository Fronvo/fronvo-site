<script lang="ts">
    import PropFavorite from '$lib/app/reusables/rooms/PropFavorite.svelte';
    import { isMobile } from 'stores/main';
    import { blur } from 'svelte/transition';
    import type { TenorGifs } from 'interfaces/all';
    import { onMount } from 'svelte';

    let search: HTMLInputElement;

    let gifsP: TenorGifs[] = [];
    let showEmpty = true;

    onMount(() => {
        if (search) {
            search.focus();

            search.onkeydown = async (ev) => {
                if (ev.shiftKey || ev.key == 'Escape' || ev.key == 'Enter') {
                    return;
                }

                let oldVal: string;

                setTimeout(() => {
                    oldVal = search.value;

                    if (oldVal.length == 0) {
                        showEmpty = true;
                        return;
                    }

                    showEmpty = false;
                }, 0);

                setTimeout(() => {
                    if (oldVal != search.value || oldVal == '') {
                        gifsP = [];
                        return;
                    }

                    gifsP = [];

                    // socket.emit('fetchTenor', { q: oldVal }, ({ gifs }) => {
                    //     if (gifs.length > 0) {
                    //         gifsP = gifs;
                    //     }
                    // });
                }, 250);
            };
        }
    });
</script>

<div class="single">
    <input
        bind:this={search}
        placeholder="Search for GIFs"
        class="modal-input"
        maxlength={20}
    />

    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        stroke="currentColor"
        ><g fill="none" stroke-width="2"
            ><circle cx="11.5" cy="11.5" r="9.5" /><path
                stroke-linecap="round"
                d="m20 20l2 2"
            /></g
        ></svg
    >
</div>

{#if showEmpty}
    <div class="banner">
        <div class="single-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
                ><path
                    d="M20.535 3.464C19.07 2 16.713 2 11.999 2C7.285 2 4.93 2 3.464 3.464c-.758.758-1.123 1.754-1.3 3.192a6.5 6.5 0 0 1 1.884-1.448c.782-.398 1.619-.56 2.545-.635C7.488 4.5 8.59 4.5 9.936 4.5h4.126c1.347 0 2.448 0 3.343.073c.927.076 1.764.237 2.545.635a6.499 6.499 0 0 1 1.884 1.448c-.176-1.438-.542-2.434-1.3-3.192Z"
                /><path
                    fill-rule="evenodd"
                    d="M2 14c0-2.8 0-4.2.545-5.27A5 5 0 0 1 4.73 6.545C5.8 6 7.2 6 10 6h4c2.8 0 4.2 0 5.27.545a5 5 0 0 1 2.185 2.185C22 9.8 22 11.2 22 14c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 22 16.8 22 14 22h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 18.2 2 16.8 2 14Zm10.53 3.53a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.22 1.22V11a.75.75 0 0 1 1.5 0v4.19l1.22-1.22a.75.75 0 1 1 1.06 1.06l-2.5 2.5Z"
                    clip-rule="evenodd"
                /></svg
            >

            <h1>Start typing to share GIFs!</h1>
        </div>

        <div class="props">
            {#each { length: $isMobile ? 3 : 5 } as _}
                <PropFavorite opacity={0.075} />
            {/each}
        </div>

        <h1 id="copyright">Powered by Tenor</h1>
    </div>
{:else}
    <div class="gifs-container">
        {#each gifsP as { gif_medium }, i}
            <img
                in:blur={{
                    duration: 500,
                    delay: i < 6 ? Math.min(2000, i + i * 75) : 0,
                }}
                src={gif_medium}
                alt="Tenor GIF"
                draggable={false}
            />
        {/each}
    </div>
{/if}

<style>
    .single {
        width: 100%;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        padding-left: 0;
        background: rgb(125, 125, 125, 0.075);
        user-select: none;
    }

    input {
        width: 100%;
        height: 45px;
        border-radius: 2px;
        background: transparent;
        color: white;
        padding: 0;
        padding-left: 10px;
        margin: 0;
        font-size: 1rem;
        font-weight: 500;
    }

    input::placeholder {
        color: rgb(255, 255, 255, 0.75);
    }

    svg {
        width: 20px;
        height: 20px;
        stroke: white;
    }

    .banner {
        display: flex;
        flex-direction: column;
        margin-top: 50px;
        user-select: none;
    }

    .banner .single-2 {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .banner .single-2 svg {
        width: 32px;
        height: 32px;
        fill: white;
        margin-right: 5px;
    }

    .banner .single-2 h1 {
        font-size: 1.1rem;
        color: white;
    }

    .props {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
        margin-top: 10px;
    }

    .gifs-container {
        width: 850px;
        height: 342px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        padding-top: 10px;
        padding-right: 10px;
        overflow: auto;
    }

    img {
        max-width: 32%;
        max-height: 100%;
        cursor: pointer;
        border-radius: 6px;
        transition: 125ms;
        border: 2px solid transparent;
    }

    img:hover {
        box-shadow: 0 0 5px white;
        border: 2px solid white;
    }

    #copyright {
        font-size: 0.8rem;
        margin-top: 70px;
        color: white;
        user-select: none;
        text-align: center;
    }

    @media screen and (max-width: 850px) {
        input {
            font-size: 0.9rem;
        }

        .banner .single-2 svg {
            width: 26px;
            height: 26px;
        }

        .banner .single-2 h1 {
            font-size: 1rem;
        }

        .gifs-container {
            overflow-x: hidden;
            width: 100%;
            height: 263px;
        }

        img {
            max-width: 100%;
            max-height: 40%;
        }

        #copyright {
            font-size: 0.7rem;
        }
    }
</style>
