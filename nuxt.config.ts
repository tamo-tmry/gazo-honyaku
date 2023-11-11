// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiKey: process.env.OPENAI_API_KEY,
      ocrPrompt: process.env.OCR_PROMPT,
      translatePrompt: process.env.TRANSLATE_PROMPT,
    }
  },
  modules: ['@nuxt/ui']
})
