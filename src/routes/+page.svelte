<script>
	const MOTIVATIONAL_QUOTES = [
		"There's only two rules to actually improve yourself.\nRule 1: Always keep trying.\nRule 2: Follow rule #1.",
		"Success is not final, failure is not fatal: It is the courage to continue that counts.",
		"The only limit to our realization of tomorrow will be our doubts of today.",
		"The future belongs to those who believe in the beauty of their dreams.",
		"Don't watch the clock; do what it does. Keep going.",
		"Believe you can and you're halfway there.",
		"The only place where success comes before work is in the dictionary."
	];

	const DAYS_OF_WEEK = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	const DAY_OF_WEEK_IDX = new Date().getDay();
</script>

<svelte:head>
	<title>Journey</title>
</svelte:head>

<section>
	<h1>{DAYS_OF_WEEK[DAY_OF_WEEK_IDX]}</h1>
	<span>{MOTIVATIONAL_QUOTES[DAY_OF_WEEK_IDX]}</span>
	<a href="/app">Continue journey</a>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		font-size: 2ch;

		/* affected by anim */
		opacity: 0;
		transform: translateY(25px) scale(0.95);


		animation: fade-in 2s ease 0s 1 forwards;
	}

	span {
		white-space: pre-line;
		text-align: center;
	}

	a {
		margin-top: 32px;
		padding: 20px;
		background: #ededed;
		border-radius: 4px;
		color: #000;
		text-decoration: none;
		
		transition: 0.15s ease background;
	}

	a:hover {
		background: #ddd;
	}

	@keyframes fade-in {
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
