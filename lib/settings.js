const fs = require('fs');

exports.compare = (oldSettings, newSettings) => {
    const changedM3us = [];

    if(oldSettings?.m3uFiles){
        newSettings.m3uFiles.forEach(newM3u => {
            const changedM3u = oldSettings?.m3uFiles.find(m3u => m3u.url === newM3u.url);
            if (!changedM3u) {
                changedM3us.push(newM3u);
            }
        });
    }

    const changedXMLTVs = [];
    if(oldSettings?.xmltvFiles){
        newSettings.xmltvFiles.forEach(newXMLTV => {
            const changedXMLTV = oldSettings?.xmltvFiles.find(xmltv => xmltv.url === newXMLTV.url);
            if (!changedXMLTV) {
                changedXMLTVs.push(newXMLTV);
            }
        });
    }

    const removedM3us = [];
    if(oldSettings?.m3uFiles){
        oldSettings.m3uFiles.forEach(oldM3u => {
            const removedM3u = newSettings?.m3uFiles.find(m3u => m3u.url === oldM3u.url);
            if (!removedM3u) {
                removedM3us.push(oldM3u);
            }
        });
    }

    const removedXMLTVs = [];
    if(oldSettings?.xmltvFiles){
        oldSettings.xmltvFiles.forEach(oldXMLTV => {
            const removedXMLTV = newSettings?.xmltvFiles.find(xmltv => xmltv.url === oldXMLTV.url);
            if (!removedXMLTV) {
                removedXMLTVs.push(oldXMLTV);
            }
        });
    }

    removedM3us.forEach( removedM3u => {
        fs.rmSync(removedM3u.fileName);
    })

    removedXMLTVs.forEach( removedXMLTV => {
        fs.rmSync(removedXMLTV.fileName);
    })

    return {changedM3us, changedXMLTVs};
}

exports.get = async () => {
    const currentSettings = await fs.promises.readFile('./assets/currentSettings.json', 'utf-8');

    return JSON.parse(currentSettings);
}