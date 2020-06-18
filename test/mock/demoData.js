import decisionApi from './decisionApi';
import flagshipVisitor from './flagshipVisitor';
import event from './hit/event';
import item from './hit/item';
import page from './hit/page';
import screen from './hit/screen';
import transaction from './hit/transaction';
import bucketing from './bucketing';

const demoData = {
    bucketing,
    envId: ['bn1ab7m56qolupi5sa0g'],
    visitor: {
        id: ['test-perf', 'toto'],
        cleanContext: {
            pos: 'es'
        },
        contextWithUselessAttributes: {
            pos: 'es',
            uselessAttribute: false
        },
        contextWithObjectAttributes: {
            pos: 'es',
            badAttribute: { awesome: 'object' }
        },
        contextWithBadArrayAttributes: {
            pos: 'es',
            badAttribute: [false, { awesome: 'object' }]
        },
        contextWithGoodArrayAttributes: {
            pos: 'es',
            badAttribute: [false, 'awesome', 123]
        }
    },
    decisionApi,
    flagshipVisitor,
    hit: {
        event,
        item,
        page,
        screen,
        transaction
    }
};
export default demoData;
