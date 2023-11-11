// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiKey: process.env.OPENAI_API_KEY,
    }
  },
  modules: ['@nuxt/ui']
})
