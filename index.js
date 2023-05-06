const fs = require('fs');
const mic = require('mic');
require('dotenv').config();

const green = '\x1b[32m';
const reset = '\x1b[0m';
const red = '\x1b[31m';

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const audioFile = 'audio.wav';
const micInstance = mic({
    rate: '13000',
    channels: '1',
    debug: true,
    fileType: 'wav',
});

const micInputStream = micInstance.getAudioStream();

const outputFileStream = fs.WriteStream(audioFile);

micInputStream.pipe(outputFileStream);

micInstance.start();

console.log('Recording started. Press Ctrl+C to stop.');

// Stop the recording after 7 seconds
setTimeout(() => {
    micInstance.stop();
    console.log('Recording stopped.');

    transcribe(audioFile);
}, 7000);


async function generateChatGPTResponse(prompt) {

    try {
        const model = 'text-davinci-003';
        //const model = 'gpt-4'
        const response = await openai.createCompletion({
            model: model,
            prompt: prompt,
            max_tokens: 1000
        });

        return response.data.choices[0].text.trim();
    }
    catch (error) {
        console.log(error.response.data)
    }
}

async function transcribe(file) {

    const resp = await openai.createTranscription(
        fs.createReadStream("audio.wav"),
        "whisper-1",
        undefined, // The prompt to use for transcription.
        'json', // The format of the transcription.
        1, // Temperature
        'en' // Language
    );
    console.log(`${green}Transcription: ${resp.data.text}${reset}`);

    const chatGPTResponse = await generateChatGPTResponse(resp.data.text);
    console.log(`${red}ChatGPT: ${chatGPTResponse}${reset}`);

    return resp.data.text
}
