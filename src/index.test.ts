// testable-http-triggered-function/__tests__/index.test.ts

// import assert = require('assert')
import assert from 'assert';
import keys from '../keys';
// todo: https://github.com/anthonychu/azure-functions-test-utils
import { backOff } from "exponential-backoff";
import { Configuration, OpenAIApi } from "openai"
import * as fs from 'fs';
import axios from 'axios';
import path from 'path';

// const ChatGPTAPI = require('chatgpt').ChatGPTAPI;
// import { ChatGPTAPI } from 'chatgpt'

// https://www.npmjs.com/package/openai
const configuration = new Configuration({
    apiKey: keys.openai,
});
const openai = new OpenAIApi(configuration);

async function withLocalCache<T>(filename: string, fn: () => Promise<any>): Promise<T> {
    if (fs.existsSync(filename)) {
        return JSON.parse(fs.readFileSync(filename, 'utf-8'));
    }

    if (process.env.GITHUB_ACTION) {
        throw new Error('Remote interaction disabled for CI tests. Check in snapshots instead.')
    }

    const result = await fn();
    const unwrapped = {
        data: result.data,
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
        config: result.config
    }

    fs.writeFileSync(filename, JSON.stringify(unwrapped))

    return result;
}

async function testOpenAI(version: number, prompt: string) {
    const promptHash = Buffer.from(prompt).toString('base64')
    const destfolder = path.join('./testdata/openai/', version.toString())
    const filename = path.join(destfolder, 'response.' + promptHash + '.json')

    return withLocalCache(filename, () =>
        openai.createCompletion({
            model: "text-davinci-00" + version,
            prompt: prompt,
        })
    );
}

describe('openai', () => {
    it('can do basic stuff', async () => {
        const prompt = "A single word synonym for test: "
        let r2 = await testOpenAI(2, prompt)
        let r3 = await testOpenAI(3, prompt)
    })
})
