var flagship = require('@flagship.io/js-sdk');

const sdk = flagship.start('bn1ab7m56qolupi5sa0g', {
    fetchNow: true,
    enableConsoleLogs: true,
    // decisionMode: 'Bucketing', // Uncomment this line to enable "Bucketing" mode
    // pollingInterval: 1, // Uncomment this line to do a bucketing polling every minutes
    activateNow: true
});

module.exports = sdk;
