<script lang="ts">
    let expandJobPostings: boolean = false;
</script>

<div class:expand={expandJobPostings}>
    <slot />
</div>

{#if !expandJobPostings}
    <button on:click={() => expandJobPostings = true}>Expand all</button>
{/if}

<style>
    div {
        max-height: 370px;
        overflow: hidden;
        position: relative;
    }

    div::after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 32px;
        background: linear-gradient(180deg, transparent, #fff 80%);
        content: '';
    }

    div.expand {
        overflow: auto;
        max-height: none;
    }

    div.expand::after {
        background: none;
        pointer-events: none;
    }
    
    button {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        background: transparent;
        border: none;
        color: #555;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
    }
</style>