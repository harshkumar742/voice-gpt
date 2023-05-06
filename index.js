const fs = require('fs');
const mic = require('mic');
const say = require('say');
const keypress = require('keypress');
require('dotenv').config();

const green = '\x1b[32m';
const reset = '\x1b[0m';
const red = '\x1b[31m';

let micInstance;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const audioFile = 'audio.wav';

// Setup keypress events
keypress(process.stdin);
process.stdin.on('keypress', (ch, key) => {
    if (key && key.name === 's') {
        console.log('Stopping voice answer.');
        say.stop();
    }
    else if (key && (key.name === 'escape' || (key.ctrl && key.name === 'c'))) {
        console.log('Stopping recording and exiting...');
        say.stop(); // Stop any pending voice
        setTimeout(() => {
            process.exit();
        }, 1000);
    }
});
process.stdin.setRawMode(true);
process.stdin.resume();

async function startVoiceInteraction() {
    const micInstance = mic({
        rate: '13000',
        channels: '1',
        debug: true,
        fileType: 'wav',
    });

    const micInputStream = micInstance.getAudioStream();
    const outputFileStream = fs.WriteStream(audioFile);
    micInputStream.pipe(outputFileStream);

    say.speak('Recording starting. Speak now', null, 1, (err) => {
        if (err) {
            console.error('Error speaking:', err);
        } else {
            //console.log('Finished speaking the prompt.');
            console.log('Recording started. Press Ctrl+C to stop.');
            micInstance.start();

            setTimeout(() => {
                micInstance.stop();
                console.log('Recording stopped.');
                transcribe(audioFile);
            }, 7000);
        }
    });

}

async function generateChatGPTResponse(prompt) {
    try {
        const model = 'text-davinci-003';
        const response = await openai.createCompletion({
            model: model,
            prompt: prompt,
            max_tokens: 1000,
        });

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.log(error.response.data);
    }
}

async function transcribe(file) {
    const resp = await openai.createTranscription(
        fs.createReadStream("audio.wav"),
        "whisper-1",
        undefined,
        'json',
        1,
        'en'
    );

    console.log("Transcribing...")
    console.log(`${green}Transcription: ${resp.data.text}${reset}`);

    fs.unlinkSync('audio.wav'); // delete existing audio file

    console.log("Fetching Response...")
    const chatGPTResponse = await generateChatGPTResponse(resp.data.text);
    console.log(`${red}ChatGPT: ${chatGPTResponse}${reset}`);

    say.speak(chatGPTResponse, null, 1, (err) => {
        if (err) {
            console.error('Error speaking:', err);
        } else {
            console.log('Finished speaking the response.');
            setTimeout(() => {
                startVoiceInteraction();
            }, 1000)
        }
    });
}

startVoiceInteraction();
