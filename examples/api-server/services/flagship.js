var flagship = require('@flagship.io/js-sdk');

const sdk = flagship.start('bn1ab7m56qolupi5sa0g', {
    fetchNow: true,
    enableConsoleLogs: true
});

module.exports = sdk;
