<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import Expandable from '$lib/components/Expandable.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import { onMount } from 'svelte';
	import type { Exercise } from '../../api/exercises/+server';

	let exercisePlan: Exercise[][] | null = null;
	let exerciseDetailsModal: Exercise | null = null;
	let maintenanceCalories = 2000;

	interface Food {
		name: string;
		cals: number;
		fats: number;
		carbs: number;
		protein: number;
	}
	let diet: Food[] = [];

	let addFoodModal: boolean = false;
	let modalLoadedFoods = [];
	let modalPageNum = 1;
	let modalTotalPages = 1;
	let searchTerm: string;

	let confirmAddModalFdcId: number | null = null;
	let confirmAddServingSize: number;
	const importantNutrients = [
		'Energy',
		'Energy (Atwater Specific Factors)',
		'Protein',
		'Total lipid (fat)',
		'Carbohydrate, by difference',
		'Fiber, total dietary',
		'Total Sugars',
		'Calcium, Ca',
		'Iron, Fe',
		'Potassium, K',
		'Sodium, Na',
		'Magnesium, Mg'
	];
	const nutrients = [
		'Cals',
		'Cals',
		'Protein',
		'Fats',
		'Carbs',
		'Fiber',
		'Sugar',
		'Calcium',
		'Iron',
		'Potassium',
		'Sodium',
		'Magnesium'
	];

	let updateMaintenanceModal: boolean = false;
	let maintenanceSex: 'male' | 'female';
	let maintenanceWeight: number;
	let maintenanceHeightFt: number;
	let maintenanceHeightIn: number;
	let maintenanceAge: number;

	async function createExercisePlan() {
		let plan = await (await fetch('/api/exercises')).json();
		exercisePlan = plan;
		localStorage.setItem('exercise', JSON.stringify(plan));
		return plan;
	}

	function deleteExercisePlan() {
		exercisePlan = null;
		localStorage.removeItem('exercise');
	}

	async function searchFoods(input: string, page: number) {
		const response = await fetch('/api/foods', {
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				term: input,
				page: page
			}),
			method: 'POST',
			mode: 'no-cors'
		});

		return await response.json();
	}

	async function searchCallback(term: string) {
		let resp = await searchFoods(term, modalPageNum);
		modalTotalPages = resp.totalPages;
		modalLoadedFoods = resp.foods;
	}

	async function loadMoreFoods() {
		modalPageNum++;
		let res = await searchFoods(searchTerm, modalPageNum);
		modalLoadedFoods = [...modalLoadedFoods, ...res.foods];
	}

	async function getFood(id: number) {
		const r = await fetch(`/api/foods?id=${id}`, {
			method: 'GET'
		});

		return await r.json();
	}

	function getCals(food: object) {
		for (let n of food.foodNutrients) {
			if (n.nutrient.name.includes('Energy') && n.nutrient.nutrientUnit.name === 'kcal') {
				return n.value;
			}
		}

		return null;
	}

	function getFats(food: object) {
		for (let n of food.foodNutrients) {
			if (n.nutrient.name.includes('Total lipid (fat)') && n.nutrient.nutrientUnit.name === 'g') {
				return n.value;
			}
		}

		return null;
	}

	function getProtein(food: object) {
		for (let n of food.foodNutrients) {
			if (n.nutrient.name.includes('Protein') && n.nutrient.nutrientUnit.name === 'g') {
				return n.value;
			}
		}

		return null;
	}

	function getCarbs(food: object) {
		for (let n of food.foodNutrients) {
			if (
				n.nutrient.name.includes('Carbohydrate, by difference ') &&
				n.nutrient.nutrientUnit.name === 'g'
			) {
				return n.value;
			}
		}

		return null;
	}

	function saveMaintenanceCals() {
		let cals = 2000;
		if (maintenanceSex === 'male') {
			// Male BMR formula = 66 + (6.23 × weight in pounds) + (12.7 × height in inches) − (6.8 × age in years)
			cals =
				66 +
				6.23 * maintenanceWeight +
				12.7 * (maintenanceHeightFt * 12 + maintenanceHeightIn) -
				6.8 * maintenanceAge;
		} else if (maintenanceSex === 'female') {
			// Female BMR formula = 655 + (4.3 x weight in pounds) + (4.7 x height in inches) – (4.7 x age in years)
			cals =
				655 +
				4.3 * maintenanceWeight +
				4.7 * (maintenanceHeightFt * 12 + maintenanceHeightIn) -
				4.7 * maintenanceAge;
		}

		cals = Math.round(cals);

		maintenanceCalories = cals;
		localStorage.setItem('maintenanceCalories', maintenanceCalories.toString());
	}

	function addToDiet(food: Food) {
		diet = [...diet, food];
		localStorage.setItem('diet', JSON.stringify(diet));
	}

	onMount(() => {
		exercisePlan = JSON.parse(localStorage.getItem('exercise') || 'null');
		maintenanceCalories = parseFloat(localStorage.getItem('maintenanceCalories') || '2000');
		diet = JSON.parse(localStorage.getItem('diet') || '[]');
	});
</script>

<h1>Fitness</h1>
<p>
	Elevate life with fitness choices aligned with well-being. Blend exercise and mindful nutrition
	for a healthier, fulfilling life, emphasizing consistency and ongoing self-improvement.
</p>
<br />

<h2>Exercise</h2>

{#if exerciseDetailsModal !== null}
	<Modal title={exerciseDetailsModal.name} close={() => (exerciseDetailsModal = null)}>
		<h3>Video</h3>
		<a
			href={`https://www.youtube.com/search?q=${exerciseDetailsModal.name} exercise`}
			target="_blank">Search</a
		>
		<br />
		<br />

		<h3>Description</h3>
		<p>{exerciseDetailsModal.desc}</p>
		<br />

		<h3>Equipment</h3>
		<p>{exerciseDetailsModal.equipment}</p>
		<br />

		<h3>Muscle group</h3>
		<p>{exerciseDetailsModal.group}</p>
		<br />

		<h3>Level</h3>
		<p>{exerciseDetailsModal.level}</p>
		<br />

		<h3>Type</h3>
		<p>{exerciseDetailsModal.type}</p>
		<br />

		<h3>Sets x Reps</h3>
		<p>{exerciseDetailsModal.sets}x{exerciseDetailsModal.reps}</p>
	</Modal>
{/if}

{#if exercisePlan}
	<Expandable>
		{#each Object.keys(exercisePlan) as day}
			<h3>Day {parseInt(day) + 1}</h3>

			{#each exercisePlan[parseInt(day)] as exercise}
				<p>
					{exercise.sets}x{exercise.reps}
					{exercise.name} <button on:click={() => (exerciseDetailsModal = exercise)}>How to</button>
				</p>
			{/each}
			<br />
		{/each}

		<button on:click={createExercisePlan}>New workout plan</button>
		<button on:click={deleteExercisePlan}>Delete workout plan</button>
	</Expandable>
{:else}
	<p>You don't have an exercise plan yet.</p>
	<br />
	<button on:click={createExercisePlan}>Create one for me</button>
{/if}

{#if updateMaintenanceModal}
	<Modal title="Update maintenance calories" close={() => (updateMaintenanceModal = false)}>
		<h3><label for="sex">Biological sex</label></h3>
		<select id="sex" bind:value={maintenanceSex}>
			<option value="male">Male</option>
			<option value="female">Female</option>
		</select>

		<br />
		<br />

		<h3>Weight (lbs)</h3>
		<input type="number" placeholder="Enter weight here" bind:value={maintenanceWeight} />
		<br />
		<br />

		<h3>Height (ft)</h3>
		<input type="number" placeholder="Enter height in feet here" bind:value={maintenanceHeightFt} />
		<br />
		<br />

		<h3>Height (in)</h3>
		<input
			type="number"
			placeholder="Enter height in inches here"
			bind:value={maintenanceHeightIn}
		/>
		<br />
		<br />

		<h3>Age</h3>
		<input type="number" placeholder="Enter age here" bind:value={maintenanceAge} />
		<br />
		<br />

		<button
			on:click={() => {
				saveMaintenanceCals();
				updateMaintenanceModal = false;
			}}>Update maintenance calories</button
		>
		<!-- 66 + (6.23 × weight in pounds) + (12.7 × height in inches) − (6.8 × age in years) -->
	</Modal>
{/if}

<br />
<br />
<h2>Nutrition</h2>
<p>
	Maintenance cals {maintenanceCalories}
	<button on:click={() => (updateMaintenanceModal = true)}>Update</button>
</p>
<p>
	Cals {Math.round(diet.map((f) => f.cals).reduce((v1, v2) => v1 + v2, 0))}
	({Math.round(
		(diet.map((f) => f.cals).reduce((v1, v2) => v1 + v2, 0) / maintenanceCalories) * 100
	)}% of maintenance) / Fats {Math.round(diet.map((f) => f.fats).reduce((v1, v2) => v1 + v2, 0))}g /
	Carbs {Math.round(diet.map((f) => f.carbs).reduce((v1, v2) => v1 + v2, 0))}g / Protein {Math.round(
		diet.map((f) => f.protein).reduce((v1, v2) => v1 + v2, 0)
	)}g
</p>
<br />

<Expandable>
	{#each diet as d, idx}
		<p>
			<strong>{d.name}</strong><br />Cals {Math.round(d.cals)} / Fats {Math.round(d.fats)}g / Carbs {Math.round(
				d.carbs
			)}g / Protein {Math.round(d.protein)}g
			<br />
			<button
				on:click={() => {
					diet.splice(idx, 1);
					diet = diet; // to trigger svelte
					localStorage.setItem('diet', JSON.stringify(diet));
				}}>Remove</button
			>
		</p>
		<br />
	{/each}
</Expandable>

<br />
<button on:click={() => (addFoodModal = true)}>Add food</button>

{#if addFoodModal}
	<Modal title="Add food" close={() => (addFoodModal = false)}>
		<input
			type="search"
			bind:value={searchTerm}
			placeholder="Search foods, brands, etc."
			on:blur={async (e) => await searchCallback(e.currentTarget.value)}
		/>

		<div class="scrollable">
			{#each modalLoadedFoods as food}
				<p>
					{food.description}
					<button
						on:click={() => {
							addFoodModal = false;
							confirmAddModalFdcId = food.fdcId;
						}}>Add</button
					>
				</p>
			{/each}

			{#if modalTotalPages > modalPageNum}
				<br />
				<button on:click={loadMoreFoods}>Load more</button>
			{/if}
		</div>
	</Modal>
{/if}

{#if confirmAddModalFdcId !== null}
	<Modal title="Confirm addition" close={() => (confirmAddModalFdcId = null)}>
		{#await getFood(confirmAddModalFdcId)}
			<Skeleton />
		{:then food}
			<h2>{food.description}</h2>

			<label for="serving">Serving size</label>
			<select id="serving" bind:value={confirmAddServingSize}>
				<option value={1}>100g</option>
				{#if food.foodMeasures}
					{#each food.foodMeasures as measure}
						<option value={measure.gramWeight / 100}
							>{measure.modifier} ({measure.gramWeight}g)</option
						>
					{/each}
				{/if}
			</select>
			<br />
			<br />

			<h3>Nutrition facts</h3>
			{#each food.foodNutrients as fact}
				{#if importantNutrients.includes(fact.nutrient.name)}
					<p>
						{nutrients[importantNutrients.indexOf(fact.nutrient.name)]}
						{Math.round(fact.value * confirmAddServingSize * 100) / 100}{fact.nutrient.nutrientUnit
							.name}
					</p>
				{/if}
			{/each}
			<br />
			<button
				on:click={() => {
					addToDiet({
						name: food.description,
						cals: getCals(food) * confirmAddServingSize,
						carbs: getCarbs(food) * confirmAddServingSize,
						fats: getFats(food) * confirmAddServingSize,
						protein: getProtein(food) * confirmAddServingSize
					});
					confirmAddModalFdcId = null;
				}}>Add</button
			>
		{/await}
	</Modal>
{/if}

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
</style>
