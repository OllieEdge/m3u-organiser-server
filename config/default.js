module.exports = {
    httpAPI: {
        bodyParser: true,
        sessions: {
            secret: 'UnG4nmAZohgO8vOyQEMIkYQG'
        },
        docRoot: './routes',
        port: 3440,
        showLogs: false,
        duration: 86400000,
        cors: {
            credentials: false,
            origins: [ '*' ],
            allowHeaders: [
                'accept',
                'accept-version',
                'content-type',
                'request-id',
                'origin',
                'x-api-version',
                'x-request-id'
            ],
            exposeHeaders: [
                'accept',
                'accept-version',
                'content-type',
                'request-id',
                'origin',
                'x-api-version',
                'x-request-id'
            ],
        }
    }
};
