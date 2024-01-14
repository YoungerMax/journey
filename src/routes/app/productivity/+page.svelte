<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { onMount } from 'svelte';

	let taskName: string;
	let tasks: string[] = [];

    let workOnTaskIdx: number | null = null;
    let pomodoroStatus: string;
    let pomodoroInterval: number;
    let intervalSecondsLeft = 0;
    let timeStr = '00:00';

    function updateTimeStr() {
        intervalSecondsLeft--;
        timeStr = (Math.floor(intervalSecondsLeft / 60)) + ":";
        if (intervalSecondsLeft % 60 > 9) {
            timeStr += intervalSecondsLeft % 60;
        } else {
            timeStr += '0';
            timeStr += intervalSecondsLeft % 60;
        }

        if (intervalSecondsLeft === 0) {
            clearInterval(pomodoroInterval);
            if (pomodoroStatus === 'Break') {
                pomodoroStatus = 'Work';
                timeStr = '25:00';
                intervalSecondsLeft = 25 * 60;
            } else {
                pomodoroStatus = 'Break';
                timeStr = '5:00';
                intervalSecondsLeft = 5 * 60;
            }
        }
    }

    function start() {
        updateTimeStr();
        pomodoroInterval = setInterval(updateTimeStr, 1000);
    }

	function addTask() {
		if (taskName.trim().length === 0) return;
		tasks = [...tasks, taskName];
		taskName = '';
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	onMount(() => {
		tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
	});
</script>

{#if workOnTaskIdx !== null}
<Modal title={"Working on: "+tasks[workOnTaskIdx]} close={() => {
    workOnTaskIdx = null;
    clearInterval(pomodoroInterval);
}}>
    <div class="center">
        <h1>{timeStr}</h1>
        <p>{pomodoroStatus}</p>
        <button on:click={() => {
            if (pomodoroStatus === 'Ready') {
                intervalSecondsLeft = 25 * 60;
                pomodoroStatus = 'Work';
            }

            start();
        }}>Start</button>
        <button on:click={() => clearInterval(pomodoroInterval)}>Stop</button>
    </div>
</Modal>
{/if}

<h1>Productivity</h1>
<p>
	Boost productivity by aligning tasks with goals, using effective time management. Combine focused
	work with breaks, prioritize ongoing learning for sustained efficiency. Success requires
	discipline and a commitment to improvement.
</p>
<br />

<h2>Tasks</h2>
<br />

<ul>
	{#each tasks as task, idx}
		<li>
			<span
				contenteditable="true"
				on:input={(e) => {
					tasks[idx] = e.currentTarget.textContent;
					localStorage.setItem('tasks', JSON.stringify(tasks));
				}}>
                    {task}
                </span>

                <button on:click={ () => {
                    workOnTaskIdx = idx;
                    pomodoroStatus = 'Ready';
                    timeStr = '25:00';
                }}>Work on this task</button>
                
                <button on:click={ () => {
                    tasks.splice(idx, 1);
                    tasks = tasks;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                }}>Remove</button>
		</li>
	{/each}
	<li>
		<input
			type="text"
			placeholder="Enter new task..."
			bind:value={taskName}
			on:blur={addTask}
			on:keypress={(e) => e.key === 'Enter' && addTask()}
		/>
	</li>
</ul>

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

	input {
		width: 100%;
		font-size: 18px;
		border: none;
		background: transparent;
	}

	ul {
		margin-left: 24px;
		font-size: 18px;
	}

	span {
		display: block;
	}

	span,
	input {
		padding: 8px;
		color: rgba(0, 0, 0, 0.7);
	}

    .center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -80%);
        font-size: 50px;
        text-align: center;
    }
</style>
