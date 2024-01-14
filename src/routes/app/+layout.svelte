<script>
	import Modal from "$lib/components/Modal.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
	import '../styles.css';
</script>

<div class="app">
    <Sidebar />

	<main>
		<slot />
	</main>
</div>

<style>
	.app {
        margin-top: 50px;
        margin-left: 25%;
        margin-right: 25%;
        width: 50%;
        
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: 24px;
    }
</style>
