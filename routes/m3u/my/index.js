const {m3uToObject} = require('../../../lib/m3u');  
const {getLocalM3u} = require('../../../lib/m3u');

exports.get = async req => {
    return {json:{data:m3uToObject(await getLocalM3u('./assets/mychannels.m3u'))}}
}