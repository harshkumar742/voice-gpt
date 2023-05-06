# Voice-GPT

Voice-GPT is an interactive voice-based application that records a 7-second user command or question, transcribes the audio, and generates contextually relevant responses using OpenAI's GPT-3 based DaVinci model. This offers a versatile voice interface for various use cases.

## Prerequisites

- Node.js installed on your system.
- An OpenAI API key.
- Installation of SoX (Mac/Windows Users) or ALSA tools for Linux.

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/voice-gpt.git
```

2. Navigate to the project directory:
```
cd voice-gpt
```

3. Install the dependencies:
```
npm i
```

4. Create a `.env` file in the project directory and add your OpenAI API key:
```
OPENAI_API_KEY=your-openai-api-key
```

## Usage

1. Run the application:
```
npm start
```

2. The application will start recording for 7 seconds. Speak your command or question into the microphone.

3. After the recording stops, the application will transcribe the audio and generate a contextually relevant response using the GPT-3 DaVinci model. The transcription and response will be displayed in the console.

## Example

User: "What is the capital of France?"
Transcription: "What is the capital of France?"
ChatGPT: "The capital of France is Paris."

## Dependencies

- SoX (Mac/Windows Users): Install SoX from [the official website](http://sox.sourceforge.net/) and follow the instructions for your operating system.
- ALSA tools (Linux Users): Install ALSA tools using the package manager for your distribution. For example, on Ubuntu or Debian-based systems, run:
```
sudo apt-get install alsa-utils
```
