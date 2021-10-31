import { writable } from 'svelte/store';

export const fetchStore = () => {
  const { set, update, subscribe } = writable(false);

  const get = async (url) => {
    const {data} = await (await fetch(url)).json();
    set(data);
  };

  return { subscribe, get };
};
