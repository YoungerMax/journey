<script lang="ts">
	import { onMount } from 'svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import Expandable from '$lib/components/Expandable.svelte';
	import Modal from '$lib/components/Modal.svelte';

    import type {Quote} from '../../api/quote/+server';

    interface Job {
        company: string;
        postedDate: string;
        url: string;
        position: string | undefined;
    }

    let modalTickerSymbol: string | null = null;

    function indexOfAfter(str: string, sub: string) {
        return str.indexOf(sub) + sub.length;
    }

    function processJobPosition(t: string) {
        const removeWords = [
            // Articles
            'a', 'an', 'the',

            // Prepositions
            'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'around',
            'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond',
            'but', 'by', 'concerning', 'considering', 'despite', 'down', 'during', 'except',
            'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of', 'off', 'on', 'onto',
            'out', 'outside', 'over', 'past', 'regarding', 'round', 'since', 'through', 'to',
            'toward', 'under', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without'
        ];

        const alphabet = 'abcdefghijklmnopqrstuvwxyz';

        let title = t.toLowerCase();
        const hiringIdx = indexOfAfter(title, 'hiring');

        if (hiringIdx > title.length) {
            return undefined;
        }

        // Trim
        let workingStr = title.substring(hiringIdx);
        while (true) {
            let startStr = workingStr;

            workingStr = workingStr.trimStart();

            if (!alphabet.includes(workingStr.charAt(0))) {
                workingStr = workingStr.substring(1);
            }

            for (let word of removeWords) {
                word = word + ' ';
                if (word === workingStr.substring(0, word.length)) {
                    workingStr = workingStr.substring(word.length);
                }
            }

            if (workingStr === startStr) {
                break;
            }
        }

        let formalized = t.substring(t.toLowerCase().indexOf(workingStr));
        return formalized.charAt(0).toUpperCase() + formalized.substring(1);
    }

	async function getJobOpenings() {
		const response = await fetch('https://hacker-news.firebaseio.com/v0/jobstories.json', {
			method: 'GET',
			mode: 'cors'
		});

		const ids = await response.json();
        let jobs = [];

        for (let id of ids) {
            const jobResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
                method: 'GET',
                mode: 'cors'
            });

            const jobData = await jobResponse.json();

            if (!jobData['url']) {
                continue;
            }

            let company = jobData['title'].substring(0, jobData['title'].indexOf('(')).trim();
            let position: string = processJobPosition(jobData['title']);


            let job: Job = {
                company: company,
                position: position,
                postedDate: new Date(jobData['time'] * 1000).toLocaleString(),
                url: jobData['url']
            };

            jobs.push(job);
        }

		return jobs;
	}

    async function getStocks() {
        const response = await fetch('/api/stocks');
		const stocks = await response.json();
        
        return stocks;
    }

    async function getQuote(ticker: string): Promise<Quote> {
        const response = await fetch(`/api/quote?symbol=${ticker}`);
		const stocks = await response.json();
        
        return stocks;
    }

    function fixDecimal(n: number) {
        return (Math.round(n * 100) / 100).toFixed(2);
    }
</script>

<!-- {#if modalTickerSymbol}
<Modal title={modalTickerSymbol} close={ () => modalTickerSymbol = null }>
    {#await getQuote(modalTickerSymbol)}
        <Skeleton />
    {:then quote} 
        <p>Price: {quote.price} {quote.currency} ({quote.percentChange}%)</p>
        <p>52-Week Range: {quote.fiftyTwoWeekLow} - {quote.fiftyTwoWeekHigh}</p>
        <p>Exchange: {quote.exchange}</p>
        <p>Analyst rating: {quote.analystRating}</p>
    {/await}
</Modal>
{/if} -->

<h1>Money</h1>

<p>
	Secure financial success by strategically choosing a job aligned with your skills and engaging in
	informed stock market research. Combine career growth with smart investments, emphasizing
	patience, discipline, and continuous learning for success.
</p>

<br />

<h2>Economy</h2>
<p>via Yahoo Finance</p>
<br />

{#await getStocks()}
    <Skeleton />
{:then stocks}
    {#each Object.keys(stocks) as stock}
        <h3>{stocks[stock]['name']}</h3>
        <br />

        <Expandable>
            <div class="grid">
                {#each stocks[stock]['quotes'] as quote}
                    <div class="entry">
                        <div style="padding: 16px;">
                            <h3>{quote.name} ({quote.symbol})</h3>
                            <p>Price: {fixDecimal(quote.price)} {quote.currency} ({quote.percentChange}%)</p>
                        </div>
    
                        <!-- <button on:click={ () => modalTickerSymbol = quote.symbol }>More</button> -->
                    </div>
                {/each}
            </div>
            <br />
        </Expandable>
    {/each}
{/await}

<br />

<h2>Latest job openings</h2>
<p>via HackerNews</p>
<br />

{#await getJobOpenings()}
	<Skeleton />
{:then jobs}
    <Expandable>
        <div class="grid">
            {#each jobs as job}
                <div class="entry">
                    <div style="padding: 16px;">
                        <h3>{job.position}</h3>
                        <p>{job.company}</p>
                        <p><i>Posted on {job.postedDate}</i></p>
                    </div>
    
                    <a target="_blank" href={job.url}>Apply now</a>
                </div>
            {/each}
        </div>
        <br />
    </Expandable>
{/await}

<style>
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

    button:hover {
        background: #6150e1;
    }
</style>