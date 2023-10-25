const fs = require('fs/promises');

exports.get = async req => {
    const rawM3u = await fs.readFile('./assets/raw.m3u', 'utf8');
    const lines = rawM3u.split('\n');
    let groupedChannels = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check for metadata line
        if (line.startsWith('#EXTINF:')) {
            const groupMatch = line.match(/group-title="(.*?)"/);
            if (groupMatch && groupMatch[1]) {
                const groupTitle = groupMatch[1];
                const channelInfo = line + '\n' + lines[i + 1].trim();

                // Group channels by group-title
                if (!groupedChannels[groupTitle]) {
                    groupedChannels[groupTitle] = [];
                }

                groupedChannels[groupTitle].push(channelInfo);
            }
        }
    }

    const includeGroupsWith = [
        'UK | ',
    ]
    const excludeGroupsWith = [
        'Ireland',
        'Betting',
        'India'
    ]

    const filteredGroups = Object.fromEntries(
        Object.entries(groupedChannels).filter(([key]) => includeGroupsWith.some( includeGroupKey => key.includes(includeGroupKey)) && !excludeGroupsWith.some( excludeGroupKey => key.includes(excludeGroupKey)) )
    );

    // Generate a new M3U file
    let newM3U = '#EXTM3U\n';

    for (const group in filteredGroups) {
        for (const channel of filteredGroups[group]) {
            newM3U += channel + '\n';
        }
    }

    // Write the new M3U to a file
    fs.writeFile('./assets/filtered.m3u', newM3U, (err) => {
        if (err) throw err;
        console.log('New M3U file has been generated!');
    });

    return {json: {included: Object.keys(filteredGroups), all: Object.keys(groupedChannels)}};
};