const fs = require('fs/promises');
const {downloadM3u} = require('../../lib/m3u');
const {compare} = require('../../lib/settings');

exports.get = async req => {
    const currentSettings = await fs.readFile('./assets/currentSettings.json', 'utf-8');

    return {json: {data: JSON.parse(currentSettings)}};
}

exports.post = async req => {

    try{
        const newSettings = req.body;
        const currentSettings = await fs.readFile('./assets/currentSettings.json', 'utf-8');
        const differences = compare(JSON.parse(currentSettings), newSettings);

        if(differences.changedM3us){
            for(const m3u of differences.changedM3us){
                const m3uData = await downloadM3u(m3u.url);
                const newSettingsM3uIndex = newSettings.m3uFiles.findIndex(m3u => m3u.url === m3uData.url);
                newSettings.m3uFiles[newSettingsM3uIndex] = {...newSettings.m3uFiles[newSettingsM3uIndex], ...m3uData}
            }
        }
        
        if(differences.changedXMLTVs){
            
        }
        
        await fs.writeFile('./assets/currentSettings.json', JSON.stringify(newSettings, null, 2));

        return {json: {data: newSettings}}
    }
    catch(err){
        console.log(err)
        return {error: err};
    }
}