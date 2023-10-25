const fs = require('fs/promises');

exports.downloadM3u = async (url) => {
    const m3uData = await fetch(url).then(res => res.text());
    const uuid = require('crypto').randomBytes(16).toString('hex');
    await fs.writeFile(`./assets/${uuid}.m3u`, m3uData, 'utf8');
    const newM3uData = {
        url,
        name: url,
        id: uuid,
        fileName: `./assets/${uuid}.m3u`
    }

    return newM3uData;
}

exports.getLocalM3u = async ( fileName ) => {
    const m3uData = await fs.readFile(fileName, 'utf-8');

    return m3uData;
}

exports.m3uToObject = (m3uContent) => {
    const lines = m3uContent.split('\n');
    const channels = [];
    let currentChannel = {};
  
    lines.forEach(line => {
      if (line.startsWith('#EXTINF')) {
        // Parse the channel attributes
        const attributes = {};
        const attrMatch = line.match(/(\w+-?="[^"]+")/g);
        if (attrMatch) {
          attrMatch.forEach(attr => {
            const [key, value] = attr.split('=');
            attributes[key] = value.replace(/"/g, '');
          });
        }
  
        // Parse the channel title
        const titleMatch = line.match(/,(.+)/);
        if (titleMatch) {
          attributes.title = titleMatch[1].trim();
        }
  
        currentChannel.attributes = attributes;
      } else if (line.trim() !== '' && !line.startsWith('#EXTM3U')) {
        currentChannel.url = line.trim();
        channels.push(currentChannel);
        currentChannel = {};
      }
    });
  
    return channels;
  }