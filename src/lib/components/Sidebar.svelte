<script lang="ts">
    import { page } from '$app/stores';
</script>

<div>
    <a aria-current={$page.route.id === '/app'} href="/app">My Journey</a>
    <a aria-current={$page.route.id === '/app/money'} href="/app/money">Money</a>
    <a aria-current={$page.route.id === '/app/fitness'} href="/app/fitness">Fitness</a>
    <a aria-current={$page.route.id === '/app/productivity'} href="/app/productivity">Productivity</a>
    <a aria-current={$page.route.id === '/app/college'} href="/app/college">College</a>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
    }

    a {
        padding: 10px;
        color: #000;
        text-decoration: none;
        position: relative;
        border-radius: 4px;
    }

    a:hover {
        background: #f9f9f9;
    }

    a[aria-current="true"] {
        color: #6c5ce7;
        background: #6c5ce711;
        font-weight: 600;
    }

    a[aria-current="true"]:before {
        position: absolute;
        top: 0;
        left: 0;
        width: 2px;
        height: 100%;
        background: #6c5ce7;
        content: '';
    }
</style>