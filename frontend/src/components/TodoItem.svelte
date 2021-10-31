<script>
  export let title;
  export let done = false;
  export let due;
  export let id;
  export let index;

  let editing = null;

  const ENTER_KEY = 13;
  const ESCAPE_KEY = 27;

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  import { formatDate, isOverdue } from '../date_utilities.js';

  function deleteEvent() {
    dispatch('deleteTodo', {
      id: id,
    });
  }
  function toggleCompletionEvent() {
    dispatch('toggleTodoCompletion', {
      done: done,
    });
  }
  function editEvent() {
    dispatch('editTodo', {
      id: id,
      title: title,
    });
    console.log(`${id} ${title}`);
    editing = null;
  }
  function initiateEdit(event) {
    if (event.which === ENTER_KEY) event.target.blur();
    else if (event.which === ESCAPE_KEY) editing = null;
  }
</script>

<style>
  .title {
    transition: color 0.4s;
  }

  .title.completed {
    color: #cbd5e0;
    text-decoration: line-through;
  }

  input:focus {
    outline: none;
    border: 1px solid skyblue;
    border-radius: 5px;
    box-shadow: 0 0 5px #719ece;
    opacity: 0.5;
  }
</style>

<li class="flex flex-row mb-2 shadow-md rounded-lg">
  <div
    class="bg-white rounded-lg flex flex-1 items-center p-4 transition
    duration-500 ease-in-out transform hover:translate-y-1 hover:shadow-lg
    border-2"
    class:border-red-300={isOverdue(due)}>

    <div
      on:click={toggleCompletionEvent}
      class="{done ? 'bg-green-500' : 'bg-gray-300'}
      {done ? 'hover:bg-green-300' : 'hover:bg-gray-200'} flex flex-col
      rounded-full w-12 h-12 justify-center items-center mr-4 cursor-pointer">
      <i class="text-white fa fa-2x {done ? 'fa-check-circle' : 'fa-circle'}" />
    </div>
    {#if editing === index}
      <!-- svelte-ignore a11y-autofocus -->
      <div class="flex-1 pl-1">
        <input
          class="w-11/12 py-2"
          type="text"
          bind:value={title}
          on:keydown={initiateEdit}
          on:blur={editEvent}
          autofocus />
      </div>
    {:else}
      <div class="flex-1 pl-1">
        <div
          class="title font-medium text-gray-600"
          class:completed={done}
          on:click={() => (editing = index)}>
          {title}
        </div>
      </div>
    {/if}

    <div class="text-gray-600">{formatDate(due)}</div>

    <button class="md:ml-1 lg:ml-6" on:click={deleteEvent}>
      <i
        class="pl-2 fa fa-lg fa-times text-gray-400 hover:text-red-500
        transition duration-150" />
    </button>
  </div>
</li>
