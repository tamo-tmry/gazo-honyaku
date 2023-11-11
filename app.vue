<template>
  <div class="container">
    <h2>翻訳したい画像をアップロード</h2>
    <p>画像をアップロードすると、画像内のチャットを抜き出し、日本語以外を翻訳します。</p>
    <input type="file" @change="uploadImage">
    <button @click="submit" :disabled="isCompletedFileUpload">アップロード</button>

    <figure><img :src="imageBase64" alt="" width="500" /></figure>
  
    <ul class="preformatted-text-wrap">
      <li v-show="imageTextContent" class="preformatted-text">
        <h3>Before</h3>
        <p>{{ imageTextContent }}</p></li>
      <li v-show="translatedText" class="preformatted-text">
        <h3>After</h3>
        <p>{{ translatedText }}</p>
      </li>
    </ul>
  </div>
  <div>
    <h2>うまく翻訳されない文章がある場合</h2>
    <p>以下のフォームに翻訳したい文章を入力してください。</p>
    <textarea v-model="additionalTranslatedText" cols="40" rows="2"></textarea>
    <button @click="translateAdditionalText">翻訳</button>

    <p>{{ translatedAdditionalText }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from  'vue'
import OpenAI from 'openai'

const apiKey = useRuntimeConfig().public.apiKey
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

const imageBase64 = ref('') as any;
const isCompletedFileUpload = ref(true);
const imageTextContent = ref('');

const translatedText = ref('');
const translatedAdditionalText = ref('');

const additionalTranslatedText = ref('');

// 画像をアップロードし、base64に変換する
const uploadImage = async (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    imageBase64.value = e.target!.result;
    isCompletedFileUpload.value = false;
  }
  reader.readAsDataURL(file);
}

const submit = async () => {
  await extractChatFromImage()
  await translateToJapanese()
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
          { type: "text", text: "Please extract the text of the conversation that appears to be a chat from the image." },
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
    model:"gpt-4",
    messages:[
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": `Convert the non-Japanese sentences and words in the chat content below into Japanese. The following is a chat-style conversation. '${imageTextContent.value}'`},
    ]
  })
  translatedText.value = response.choices[0].message.content || '';
}

// 単語、文章をGPT-4に投げ、日本語以外を翻訳する
const translateAdditionalText = async () => {
  const response = await openai.chat.completions.create({
    model:"gpt-4",
    messages:[
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": `Please translate the following sentence and words into Japanese. Provide only the translated content without any additional comments or responses. '${additionalTranslatedText.value}'`},
    ]
  })
  translatedAdditionalText.value = response.choices[0].message.content || '';
}
</script>

<style scoped>
figure {
  margin: 0;
  padding: 0;
}

img {
  display: block;
  margin: 0;
  width: 100%;
}

.preformatted-text-wrap {
  display: flex;
  list-style: none;
}

.preformatted-text {
  width: 50%;
  white-space: pre-wrap;
}
</style>