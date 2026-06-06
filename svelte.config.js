import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    prerender: {
      handleHttpError: ({ path, message }) => {
        if (path.includes('favicon')) return;
        throw new Error(message);
      },
      handleUnseenRoutes: 'warn'
    }
  },
  compilerOptions: {
    runes: false
  }
};

export default config;
