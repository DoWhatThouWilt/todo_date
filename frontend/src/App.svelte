<script>
  /*===== WHAT I'VE LEARNED =====
	In order for the transitions to fire and properly animate, reactivity must be
	triggered by the reassignment of local variables. Syncing the local list 
	variable to the updated database does not trigger the animations. This means that the
	database must be updated seperately from the local variables. The placement and order of
	items that were modified by user actions are also required to be maintained for the sake of
	providing a consistent UI expirience, which cannot be achieved by tying the local list to
	the database. 
	*/
  import axios from "axios";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { elasticInOut } from "svelte/easing";
  const url = "http://localhost:4000/api/todos";

  const ENTER_KEY = 13;
  const ESCAPE_KEY = 27;

  let currentFilter = "all";
  let todos = [];
  let input = "";
  let editing = null;

  onMount(() => getTodos());

  async function getTodos() {
    const { data: response } = await axios.get(url);
    todos = response.data;
  }

  async function addTodo() {
    const { data: response } = await axios.post(url, {
      todo: {
        title: input,
      },
    });
    todos = [...todos, response.data];
    input = "";
  }

  async function removeTodo(id) {
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
    // todos[index].done = !todo.done;
  }

  function handleEdit(event) {
    if (event.which === ENTER_KEY) event.target.blur();
    else if (event.which === ESCAPE_KEY) editing = null;
  }

  async function submit(event, todo) {
    await axios.put(`${url}/${todo.id}`, {
      todo: {
        title: event.target.value,
      },
    });
    todos[editing].title = event.target.value;
    editing = null;
  }

  $: filtered =
    currentFilter === "all"
      ? todos
      : currentFilter === "completed"
      ? todos.filter((todo) => todo.done)
      : todos.filter((todo) => !todo.done);
</script>

<style>
  :global(body) {
    background-color: hsl(0, 0%, 96%);
    height: 100vh;
  }

  input[type="text"].input.editing {
    padding-left: 0 !important;
    margin-left: 1em !important;
    border: 0;
    width: 85%;
  }

  li span {
    transition: color 0.4s;
  }
  li span.completed {
    color: #d9d9d9;
    text-decoration: line-through;
  }
</style>

<svelte:head>
  <link
    rel="stylesheet"
    type="text/css"
    href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css" />
  <script src="https://use.fontawesome.com/releases/v5.3.1/js/all.js">

  </script>
</svelte:head>

<main class="container is-fluid">
  <div class="columns is-centered is-vcentered is-mobile">
    <div class="column is-three-quarters-tablet is-one-third-desktop">
      <h1 class="has-text-centered title">Svelte TODO</h1>
      <div class="tabs is-fullwidth">
        <ul>
          <!-- svelte-ignore a11y-missing-attribute -->
          <li
            class:is-active={currentFilter === 'all'}
            on:click={() => {
              currentFilter = 'all';
            }}>
            <a>All</a>
          </li>
          <!-- svelte-ignore a11y-missing-attribute -->
          <li
            class:is-active={currentFilter === 'active'}
            on:click={() => {
              currentFilter = 'active';
            }}>
            <a>Active</a>
          </li>
          <!-- svelte-ignore a11y-missing-attribute -->
          <li
            class:is-active={currentFilter === 'completed'}
            on:click={() => {
              currentFilter = 'completed';
            }}>
            <a>Completed</a>
          </li>
        </ul>
      </div>
      <form
        class="field has-addons"
        style="justify-content: center"
        on:submit|preventDefault={addTodo}>
        <div class="control is-expanded">
          <input
            bind:value={input}
            type="text"
            class="input is-medium"
            placeholder="TODO" />
        </div>
        <div class="control">
          <button class="button is-primary is-medium">
            <span class="icon is-primary">
              <i class="fas fa-plus" />
            </span>
          </button>
        </div>
      </form>
      <ul class:list={todos.length > 0}>
        {#each filtered as todo, index (todo.id)}
          <li
            class="list-item"
            transition:slide={{ duration: 300, easing: elasticInOut }}>
            <div class="is-flex" style="align-items: center">

              <label class="checkbox">
                <input
                  type="checkbox"
                  bind:checked={todo.done}
                  on:click={handleComplete(todo, index)} />
              </label>
              {#if editing === index}
                <!-- svelte-ignore a11y-autofocus -->
                <input
                  type="text"
                  value={todo.title}
                  on:keydown={handleEdit}
                  on:blur={(e) => {
                    submit(e, todo);
                  }}
                  class="input editing"
                  autofocus />
              {:else}
                <span
                  class:completed={todo.done}
                  style="margin-left: 1em"
                  on:dblclick={() => (editing = index)}>
                  {todo.title}
                </span>
              {/if}
              <div style="flex: 1" />

              <button
                class="button is-text is-pulled-right"
                on:click={removeTodo(todo.id)}>
                <span class="icon has-text-grey-lighter">
                  <i class="fas fa-lg fa-times" />
                </span>
              </button>
            </div>
          </li>
        {/each}

      </ul>
    </div>
  </div>
</main>
