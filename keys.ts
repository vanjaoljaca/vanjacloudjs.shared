// fs doesnt work in expo.. sigh
// https://docs.expo.dev/versions/latest/sdk/filesystem/

let values: any;
try {
    const fs = require('fs');
    let settingsJson;
    try {
        settingsJson = fs.readFileSync('local.settings.json', 'utf8');
    } catch (err) {
        console.info('Could not load local.settings.json file. Falling back to ../local.settings.json variables.');
        settingsJson = fs.readFileSync('../vanjacloudjs/local.settings.json', 'utf8');
    }
    const settings = JSON.parse(settingsJson);
    values = settings.Values;
} catch (err) {
    console.info('Could not load  settings file. Falling back to ../keys.json variables.');

    try {
        values = require('../keys.json');
    } catch (err) {
        console.info('Could not load ../keys.json file. Falling back to env variables.');

        console.log(values)

        try {
            values = {
                OPENAI_KEY: process.env.OPENAI_KEY,
                NOTION_SECRET: process.env.NOTION_SECRET,
                SPOTIFY_CLIENTID: process.env.SPOTIFY_CLIENTID,
                SPOTIFY_CLIENTSECRET: process.env.SPOTIFY_CLIENTSECRET
            }
            console.info('Loaded env variables:',
                Object.keys(values).map(k => `${k}: ${values[k]?.length}`));
        } catch (err) {
            console.warn('Could not load env variables.');
            values = {
                OPENAI_KEY: undefined,
                NOTION_SECRET: undefined,
                SPOTIFY_CLIENTID: undefined,
                SPOTIFY_CLIENTSECRET: undefined,
            }
        }
    }
}

export default {
    openai: values.OPENAI_KEY,
    notion: values.NOTION_SECRET,
    spotify: {
        clientId: values.SPOTIFY_CLIENTID,
        clientSecret: values.SPOTIFY_CLIENTSECRET
    }
};