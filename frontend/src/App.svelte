<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { backInOut } from 'svelte/easing';
  import axios from 'axios';
  import { today, upcomingFilter, overdueFilter } from './date_utilities.js';
  import ProgressCircle from 'svelte-progresscircle';
  import TodoItem from './components/TodoItem.svelte';
  const url = 'https://serene-crag-60356.herokuapp.com/api/todos';
  let todos = [];
  let input = '';
  let date = today();
  let editing = null;
  onMount(() => getTodos());
  let isHidden = true;
  $: value = Math.trunc((numCompleted / todos.length) * 100);
  let width;
  $: sidebar = width >= 768;
  let currentFilter = 'all';
  $: filtered =
    currentFilter === 'all'
      ? todos
      : currentFilter === 'overdue'
      ? todos.filter(overdueFilter)
      : currentFilter === 'upcoming'
      ? todos.filter(upcomingFilter)
      : todos.filter((todo) => todo.done); //else currentFilter === completed
  $: numCompleted = todos.filter((item) => item.done).length;
  $: numOverdue = todos.filter(overdueFilter).length;
  $: numUpcoming = todos.filter(upcomingFilter).length;

  async function getResponse() {
    const res = await axios.get(url);
    return res;
  }
  let promise = getResponse();

  async function getTodos() {
    const { data: response } = await axios.get(url);
    todos = response.data;
  }

  async function addTodo() {
    const { data: response } = await axios.post(url, {
      todo: {
        title: input,
        due: date,
      },
    });
    todos = [...todos, response.data];
    input = '';
    date = today();
  }

  async function handleDelete(event) {
    const id = event.detail.id;
    console.log(id);
    await axios.delete(`${url}/${id}`);
    const index = todos.findIndex((todo) => todo.id === id);
    todos.splice(index, 1);
    todos = todos;
  }

  async function handleComplete(todo, index) {
    await axios.put(`${url}/${todo.id}`, {
      todo: {
        done: !todo.done,
      },
    });
    todos[index].done = !todo.done;
  }

  async function handleEdit(event) {
    await axios.put(`${url}/${event.detail.id}`, {
      todo: {
        title: event.detail.title,
      },
    });
  }
</script>

<svelte:window bind:innerWidth={width} />
<div class="flex flex-row flex-wrap relative">
  <!-- MOBILE NAV -->
  <div class="px-6 py-2 z-20 shadow-lg w-full md:hidden">
    <button on:click={() => (isHidden = !isHidden)}>
      <i class="fa fa-2x fa-bars text-gray-600" />
    </button>
  </div>

  <!-- SIDEBAR -->
  {#if !isHidden || sidebar}
    <div
      transition:fly|local={{ y: -300, duration: 300 }}
      class="p-2 z-10 mt-10 bg-white shadow-2xl w-full md:block md:mt-0 md:w-84
      fixed md:h-screen"
    >
      <!-- begin inner-column -->
      <div class="flex flex-col bg-white">
        <!-- Begin Avatar -->
        <div class="p-4 w-full">
          <div class="h-full flex items-center shadow p-2 rounded-lg">
            <img
              alt="team"
              class="w-16 h-16 object-cover object-center flex-shrink-0
              rounded-full mr-4"
              src="https://randomuser.me/api/portraits/women/79.jpg"
            />
            <div class="flex-grow">
              <h2 class="text-gray-700 font-bold text-lg">Hello, User!</h2>
              <p class="text-gray-600">My Account | Log Out</p>
            </div>
          </div>
        </div>
        <!-- End Avatar -->

        <div class="p-4 w-full">
          <div class="h-full text-center shadow rounded-lg p-2">
            <h4 class="text-gray-700 font-medium">Date of Move</h4>
            <h1 class="text-gray-700 font-extrabold text-4xl">9/20/20</h1>
          </div>
        </div>

        <div class="p-4 w-full">
          <div class="progress h-48 py-2 text-center shadow rounded-lg p2">
            <ProgressCircle max="100" {value}>
              <span class="leading-none">
                <p class="text-gray-700 font-extrabold text-4xl">{value}%</p>
                <p class="text-base text-gray-500">complete</p>
              </span>
            </ProgressCircle>
          </div>
        </div>

        <div class="p-4 w-full">
          <div
            class="w-full h-full shadow-md rounded-lg text-gray-700 divide-y
            divide-gray-300"
          >
            <div class="flex items-center justify-between h-12 px-2">
              <p>Overdue Tasks</p>
              <div
                class="h-8 w-8 text-white font-bold bg-red-500 rounded-full flex
                justify-center items-center"
              >
                {numOverdue}
              </div>
            </div>
            <div class="flex items-center justify-between h-12 px-2">
              <p>Due this Week</p>
              <div
                class="h-8 w-8 text-white font-bold bg-orange-500 rounded-full
                flex justify-center items-center"
              >
                {numUpcoming}
              </div>
            </div>
            <div class="flex items-center justify-between h-12 px-2">
              <p>Completed Tasks</p>
              <div
                class="h-8 w-8 text-white font-bold bg-green-500 rounded-full
                flex justify-center items-center"
              >
                {numCompleted}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <main class="w-full md:ml-84 p-6">
    <div class="container mx-auto">
      <div
        class="text-3xl text-gray-700 font-medium leading-relaxed tracking-tight"
      >
        My Checklist
      </div>

      <!-- TABS SECTION -->
      <nav class="flex flex-row">
        <!-- svelte-ignore a11y-missing-attribute -->
        <button
          on:click={() => {
            currentFilter = 'all';
          }}
          class:active={currentFilter === 'all'}
          class="flex-grow text-gray-600 py-4 px-6 block hover:text-blue-500
            focus:outline-none active"
        >
          All
        </button>
        <!-- svelte-ignore a11y-missing-attribute -->
        <button
          on:click={() => {
            currentFilter = 'overdue';
          }}
          class:active={currentFilter === 'overdue'}
          class="flex-grow text-gray-600 py-4 px-6 block hover:text-blue-500
            focus:outline-none"
        >
          Overdue
        </button>
        <!-- svelte-ignore a11y-missing-attribute -->
        <button
          on:click={() => {
            currentFilter = 'upcoming';
          }}
          class:active={currentFilter === 'upcoming'}
          class="flex-grow text-gray-600 py-4 px-6 block hover:text-blue-500
            focus:outline-none"
        >
          Upcoming
        </button>
        <!-- svelte-ignore a11y-missing-attribute -->
        <button
          on:click={() => {
            currentFilter = 'completed';
          }}
          class:active={currentFilter === 'completed'}
          class="flex-grow text-gray-600 py-4 px-6 block hover:text-blue-500
            focus:outline-none"
        >
          Completed
        </button>
      </nav>

      <!-- INPUT BAR -->
      <form on:submit|preventDefault={addTodo}>
        <div class="bg-white shadow-lg p-4 mt-2 flex rounded-lg">
          <button class="flex items-center">
            <i
              class="fa fa-3x fa-plus-circle text-green-500 hover:text-green-300"
            />
          </button>
          <input
            class="ml-3 w-full rounded p-2 text-lg"
            type="text"
            placeholder="What do you have to do?"
            bind:value={input}
          />
          <input
            class="text-orange-600 rounded-lg"
            type="date"
            bind:value={date}
            min={today()}
          />
        </div>
      </form>

      {#await promise}
        <p>Waiting for server response....</p>
      {:then value}
        <ul class="flex flex-col bg-white py-4 mt-6">
          {#each filtered as todo, index (todo.id)}
            <div transition:slide={{ duration: 600, easing: backInOut }}>
              <TodoItem
                {...todo}
                {index}
                on:deleteTodo={handleDelete}
                on:toggleTodoCompletion={handleComplete(todo, index)}
                on:editTodo={handleEdit}
              />
            </div>
          {/each}
        </ul>
      {/await}

      <!-- {#each $todos as todo}
         <pre>{JSON.stringify(todo, null, 2)}</pre>
      {/each} -->
    </div>
  </main>
</div>

<style>
  input:focus {
    outline: none !important;
    border: 1px solid skyblue;
    box-shadow: 0 0 5px #719ece;
    opacity: 0.5;
  }
  [type='date'] {
    width: 11em;
    padding: 0;
    margin: 0;
  }
  .progress {
    --progress-color: #48bb78;
    --progress-trackcolor: #cbdfe0;
  }
  span {
    font-size: 1.25rem;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .active {
    @apply text-blue-500 border-b-2 font-medium border-blue-500;
  }
</style>
