<script>
  import Checkbox from './Checkbox.svelte';
  export let title = 'Task Title';
  export let description =
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.';
  export let img = "http://placeimg.com/300/300/any";
  export let completed;
  export let date = "8/17/2020";

  function test() {
    console.log(completed);
  }
</script>

<div class="mx-auto max-w-lg mt-6 mb-6">
  <div
    class="rounded-lg shadow-md w-full flex flex-row flex-wrap p-3 antialiased">
    <div class="w-1/3">
      <img
        src={img}
        alt=""
        class="rounded-lg shadow-md" />
    </div>
    <div class="w-2/3 flex flex-col justify-between pl-3">

      <div class="flex items-center">
        <h1 class="text-gray-800 text-xl font-semibold relative leading-tight">
          {title}
        </h1>
        <div class="ml-auto">
          <button>
            <i
              class="fa fa-lg fa-pencil text-orange-500 hover:text-orange-600
              transition duration-150" />
          </button>
          <button>
            <i
              class="fa fa-lg fa-eraser text-red-500 hover:text-red-600
              transition duration-150" />
          </button>
        </div>
      </div>

      <div>
        <p class="mt-2 text-base text-gray-700">
          {description}
        </p>
      </div>

      <div class="flex justify-between items-end text-sm text-gray-500 mt-2">
        <p>
          Due date:
          <b>{date}</b>
        </p>
        <Checkbox bind:completed />
      </div>

    </div>
  </div>
</div>
