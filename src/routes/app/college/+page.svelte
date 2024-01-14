<script lang="ts">    
	import Modal from "$lib/components/Modal.svelte";
	import Skeleton from "$lib/components/Skeleton.svelte";
	import Expandable from "$lib/components/Expandable.svelte";

    let satReading: number;
    let satMath: number;
    let weightedGPA: number;

    let modalOpen: boolean;
    let modalSchoolName: string | null = null;

    satMath = parseFloat(localStorage.getItem('satmath') || '200');
    satReading = parseFloat(localStorage.getItem('satreading') || '200');
    weightedGPA = parseFloat(localStorage.getItem('wgpa') || '2.0');

    async function loadSchools(type: 'safety' | 'recommended' | 'reach') {
        return await (await fetch('/api/college/' + type  + '?' + new URLSearchParams({'s': (satReading + satMath).toString()}))).json();
    }

    async function loadSchoolEx(name: string) {
        const search = await (await fetch('/api/college?' + new URLSearchParams({'q': name}), { method: 'POST' })).json();
        const r = search[0];

        return await (await fetch('/api/college/' + r['id'])).json();
    }

    function saveStudent() {
        localStorage.setItem('satmath', satMath.toString());
        localStorage.setItem('satreading', satReading.toString());
        localStorage.setItem('wgpa', weightedGPA.toString());
    }
</script>

{#if modalOpen}
<Modal title="Update student profile" close={() => modalOpen = false}>
    <h3>SAT reading score</h3>
    <input type="number" placeholder="Enter SAT reading score here" bind:value={satReading} />
    <br />
    <br />

    <h3>SAT math score</h3>
    <input type="number" placeholder="Enter SAT math score here" bind:value={satMath} />
    <br />
    <br />

    <h3>Weighted GPA out of 4</h3>
    <input type="number" placeholder="Enter GPA here" bind:value={weightedGPA} />
    <br />
    <br />

    <button on:click={ () => {
        saveStudent();
        modalOpen = false;
    }}>Save</button>
</Modal>
{/if}

{#if modalSchoolName !== null}
<Modal title={modalSchoolName} close={() => modalSchoolName = null}>
    {#await loadSchoolEx(modalSchoolName)}
        <Skeleton />
    {:then school} 
        <p><strong>Location</strong>: {school.city}, {school.state}</p>
        <p><strong>SAT Reading Range</strong>: {school['SAT Critical Reading 25th Percentile']} - {school['SAT Critical Reading 75th Percentile']}</p>
        <p><strong>SAT Math Range</strong>: {school['SAT Math 25th Percentile']} - {school['SAT Math 75th Percentile']}</p>
        <p><strong>SAT Average</strong>: {school['sat_avg']}</p>
        <p><strong>Student count</strong>: {school['students']}</p>
        <p><strong>Salary after school</strong>: {school['salary_after_school']}</p>
        <p><strong>Acceptance Rate</strong>: {Math.floor(school['Admissions Total'] / school['Applicants Total'] * 100)}% ({school['Admissions Total']} / {school['Applicants Total']})</p>
        <p><strong>Tuition</strong>: ${school['State Tuition']}</p>
        <br />
        <a href={school.url} target="_blank">Visit their website</a>
        <br />
        <p>As of {school['ID Year']}, data via College Scorecard & DataUSA</p>
    {/await}
</Modal>
{/if}

<h1>College</h1>
<p>Search and chance yourself on colleges that align with your goals. Adopt effective study strategies, and prioritize continuous growth. Succeed with discipline and a commitment to ongoing learning.</p>

<br />
<button on:click={ () => modalOpen = true }>Update my student profile</button>
<br />
<br />

<h2>Recommended</h2>
<br />

{#await loadSchools('recommended')}
    <Skeleton />
{:then schools} 
<Expandable>
    <div class="grid">
        {#each schools as school}
            <div class="entry">
                <div style="padding: 16px;">
                    <h3>{school.name}</h3>
                    <p>{school.city}, {school.state} &bull; {school.sat_avg} SAT &bull; ${school.salary_after_school} salary after graduation</p>
                </div>

                <button on:click={ () => modalSchoolName = school.name }>More</button>
            </div>
        {/each}
    </div>
    <br />
</Expandable>
{/await}

<h2>Reaches</h2>
<br />

{#await loadSchools('reach')}
    <Skeleton />
{:then schools} 
<Expandable>
    <div class="grid">
        {#each schools as school}
            <div class="entry">
                <div style="padding: 16px;">
                    <h3>{school.name}</h3>
                    <p>{school.city}, {school.state} &bull; {school.sat_avg} SAT &bull; ${school.salary_after_school} salary after graduation</p>
                </div>

                <button on:click={ () => modalSchoolName = school.name }>More</button>
            </div>
        {/each}
    </div>
    <br />
</Expandable>
{/await}

<h2>Safeties</h2>
<br />

{#await loadSchools('safety')}
    <Skeleton />
{:then schools} 
<Expandable>
    <div class="grid">
        {#each schools as school}
            <div class="entry">
                <div style="padding: 16px;">
                    <h3>{school.name}</h3>
                    <p>{school.city}, {school.state} &bull; {school.sat_avg} SAT &bull; ${school.salary_after_school} salary after graduation</p>
                </div>

                <button on:click={ () => modalSchoolName = school.name }>More</button>
            </div>
        {/each}
    </div>
    <br />
</Expandable>
{/await}

<style>
    button {
		border: 1px solid #6c5ce7;
		border-radius: 4px;
		padding: 6px;
		color: #6c5ce7;
		background: transparent;
		cursor: pointer;
	}

	button:hover {
		background: #6c5ce722;
	}

	input, select {
		width: 100%;
		padding: 8px;
		font-size: 18px;
		border: none;
		border-bottom: 1px solid #000;
		background: transparent;
	}

	.scrollable {
		overflow: auto;
		max-height: 500px;
	}

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 8px;
    }

    .entry {
        border: 1px solid #000;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
    }

    .entry button, .entry a {
        border: none;
        display: block;
        text-decoration: none;
        padding: 12px 16px;
        background: #6c5ce7;
        color: #fff;
        font-weight: 800;
        margin-top: auto;
        font-size: 15px;
        text-align: left;
        font-family: 'Inter Tight Variable';
        cursor: pointer;
    }
</style>