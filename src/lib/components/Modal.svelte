<script lang="ts">
    export let title: string;
    export let close: () => void;
</script>

<div class="back" on:click={close} on:keypress={ e => e.key === 'Escape' && close() } role="none"></div>

<div class="modal">
    <div class="top">
        <h1>{title}</h1>
        <button on:click={close}>Close</button>
    </div>

    <div class="content">
        <slot />
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        min-height: 50vh;
        width: 33vw;
        background: #fff;
        padding: 16px;
        border-radius: 4px;
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
    }

    button {
        color: #6c5ce7;
        font-size: 18px;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .back {
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9;
    }
</style>