const httpAPI = require ( 'just-another-http-api' );
const config = require ( 'config' );
const OS = require('os');

exports.start = async () => {
    const server = await httpAPI ( config.httpAPI );

    process.stdout.write ( '\x1B[38;5;9m┌-- [ \x1B[0m\x1B[38;5;118mSERVER READY (v2.0) \x1B[0m\x1B[38;5;9m] ---------------------------------------\x1B[0m\n' );
    process.stdout.write ( '\x1B[38;5;9m|\n' );
    process.stdout.write ( `\x1B[38;5;9m|    \x1B[38;5;244mRunning on: \x1B[38;5;214mhttp://127.0.0.1:${ config.httpAPI.port }\n` );
    process.stdout.write ( '\x1B[38;5;9m|\n' );
    process.stdout.write ( `\x1B[38;5;9m|    \x1B[38;5;244mStarted with args: [ \x1B[38;5;214m${ process.argv.join ( ', ' ) }\x1B[38;5;244m ]\n` );
    process.stdout.write ( '\x1B[38;5;9m|\n' );
    process.stdout.write ( '\x1B[38;5;9m└-- [ \x1B[0m\x1B[38;5;118mSERVER READY (v2.0)\x1B[0m\x1B[38;5;9m] ---------------------------------------\x1B[0m\n' );
};

this.start ();