<template>
  <UContainer v-if="!translatedText" class="flex h-screen justify-center items-center">
    <UButton v-if="!isFileUploading && !isCompletedFileUpload" class="relative" size="xl" icon="i-heroicons-clipboard-document" color="gray">
      <!-- スクリプトで対処した方が良いかも -->
      <UInput class="absolute top-0 left-0 opacity-0" type="file" @change="uploadImage" />
    </UButton>

    <UButton
      v-if="isFileUploading && !isCompletedFileUpload && !translatedText"
      loading
      size="xl"
      color="gray"
    />
  </UContainer>
 
  <div v-else>
    <figure class="ma-0 pa-0"><img class="d-block" :src="imageBase64" alt="" width="500" /></figure>
    <UCard>
      <template #header>
        <p>翻訳前</p>
      </template>
      <p class="whitespace-pre-wrap">{{ imageTextContent }}</p>
    </UCard>
    <UCard>
      <template #header>
        <p>翻訳後</p>
      </template>
      <pre class="whitespace-pre-wrap">{{ translatedText }}</pre>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { ref } from  'vue'
import OpenAI from 'openai'

const apiKey = useRuntimeConfig().public.apiKey
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

const ocrPrompt = useRuntimeConfig().public.ocrPrompt
const translatePrompt = useRuntimeConfig().public.translatePrompt

const imageBase64 = ref('') as any;
const isCompletedFileUpload = ref(false);
const isFileUploading = ref(false);
const imageTextContent = ref('');
const translatedText = ref('');

// 画像をアップロードし、base64に変換する
const uploadImage = async (event: any) => {
  isFileUploading.value = true;
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = async (e) => {
    imageBase64.value = e.target!.result;
    await extractChatFromImage()
    await translateToJapanese()
    isFileUploading.value = false;
    isCompletedFileUpload.value = true;
  }
  reader.readAsDataURL(file);
}

// 画像からチャットの抜き出し
const extractChatFromImage = async () => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content: "You are an Optical Character Recognition (OCR) machine. You will extract all the characters from the image file in the URL provided by the user, and you will only privide the extracted text in your response. As an OCR machine, You can only respond with the extracted text."
      },
      {
        role: "user",
        content: [
          { type: "text", text: ocrPrompt },
          {
            type: "image_url",
            image_url: {
              "url": imageBase64.value,
            },
          },
        ],
      },
    ],
  });
  imageTextContent.value = response.choices[0].message.content || '';
}

// チャットをGPT-4に投げ、日本語以外を翻訳する
const translateToJapanese = async () => {
  const response = await openai.chat.completions.create({
    model:"gpt-4-1106-preview",
    messages:[
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": `${translatePrompt} '${imageTextContent.value}'`},
    ]
  })
  translatedText.value = response.choices[0].message.content || '';
}
</script>