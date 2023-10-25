const fs = require('fs');
const {m3uToTreeData} = require('../../../utils/m3u');
const settings = require('../../../lib/settings');

exports.get = async req => {
    const currentSettings = await settings.get();
    const treeDatas = await Promise.all( currentSettings.m3uFiles.map ( async ({fileName}) => {
        const treeData = await m3uToTreeData(fileName);
        return treeData;
    }));
    return { json: { data: {
        treeData: treeDatas.flat(),
        selectedGroupsAndChannels: JSON.parse(fs.readFileSync('./assets/selectedGroupsAndChannels.json', 'utf8'))
     } } };
}

exports.post = async req => {
    fs.writeFileSync('./assets/selectedGroupsAndChannels.json', JSON.stringify(req.body, null, 2), 'utf8');
    const { groups, children } = req.body;
    const currentSettings = await settings.get();
    const m3uFiles = currentSettings.m3uFiles; // Assuming the list of M3U files is included in the request

    const newM3UContent = ['#EXTM3U'];

    for (const m3uFile of m3uFiles) {
        if (!m3uFile.enabled) continue;

        // 1. Read and parse the M3U file
        const originalM3UContent = fs.readFileSync(m3uFile.fileName, 'utf8');
        const lines = originalM3UContent.split('\n');
        console.log(111, lines.length)
        const channels = [];
        let currentChannel = {};

        lines.forEach(line => {
            if (line.startsWith('#EXTINF')) {
                currentChannel.info = line;
            } else if (line.trim() !== '' && !line.startsWith('#EXTM3U')) {
                currentChannel.url = line;
                channels.push(currentChannel);
                currentChannel = {};
            }
        });

        console.log(channels)
        // 2. Filter the channels
        const cleanedChildren = children.map(child => child.replace(/.*?-/, '').trim()); // Remove the group name and dash
        const filteredChannels = channels.filter(channel => {
            const groupTitleMatch = groups.some(group => channel.info.includes(`group-title="${group}"`));
            const channelNameMatch = cleanedChildren.some(child => channel.info.includes(`"${child}"`)); // Match the cleaned child names
            return groupTitleMatch && channelNameMatch;
        });

        // 3. Convert back to M3U format and append to new M3U content
        newM3UContent.push(...filteredChannels.map(channel => `${channel.info}\n${channel.url}`));
    }

    // 4. Save to a new M3U file
    fs.writeFileSync('./assets/mychannels.m3u', newM3UContent.join('\n'), 'utf8');

    return { json: { data: { message: 'Success', newM3UContent} } };
}
