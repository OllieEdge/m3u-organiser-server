const fs = require('fs').promises;
const path = require('path');

exports.m3uToTreeData = async (filePath) => {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const treeData = [];
    let groupTitleMap = {};

    for (let line of lines) {
        if (line.startsWith('#EXTINF')) {
            const groupMatch = line.match(/group-title="(.*?)"/);
            const titleMatch = line.match(/,(.*)$/);
            if (groupMatch && titleMatch) {
                const groupTitle = groupMatch[1];
                const channelTitle = titleMatch[1];
                if (!groupTitleMap[groupTitle]) {
                    groupTitleMap[groupTitle] = {
                        key: groupTitle,
                        title: groupTitle,
                        children: []
                    };
                    treeData.push(groupTitleMap[groupTitle]);
                }
                groupTitleMap[groupTitle].children.push({
                    key: `${groupTitle}-${channelTitle}`,
                    title: channelTitle
                });
            }
        }
    }

    return treeData;
};
