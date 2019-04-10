import * as fs from 'fs';
import * as must from 'must/register';
import { Object } from '@quenk/noni/lib/data/json';
import { tests } from '@quenk/facets-dsl/lib/tests';
import { Context } from '@quenk/facets-dsl/lib/compile/context';
import { regex, operator } from '../src/term';
import { defaultTerms, compile } from '../src';

const policies = {

    type: {

        type: 'string',
        operators: ['='],
        term: regex

    },
    name: {

        type: 'string',
        operators: ['='],
        term: regex

    },
    'user.username': {

        type: 'string',
        operators: ['='],
        term: regex

    },
    age: {

        type: 'number',
        operators: ['=', '>=', '<=', '>', '<'],
        term: operator

    },
    tag: {

        type: 'string',
        operators: ['='],
        term: regex

    },
    religion: {

        type: 'string',
        operators: ['='],
        term: regex

    },
    active: {

        type: 'boolean',
        operators: ['=', '>=', '<=', '>', '<'],
        term: operator

    },
    rank: {

        type: 'number',
        operators: ['=', '>=', '<=', '>', '<'],
        term: operator

    },
    discount: {

        type: 'number',
        operators: ['=', '>=', '<=', '>', '<'],
        term: operator

    },
    'namespace': {

        type: 'number',
        operators: ['=', '>=', '<=', '<=', '>=', '<'],
        term: operator

    },
    user: {

        type: 'string',
        operators: ['='],
        term: regex

    },
    price: {

        type: 'number',
        operators: ['=', '>=', '<=', '>', '<'],
        term: operator

    },
    filetype: {

        type: 'string',
        operators: ['='],
        term: regex

    },
    dob: {

        type: 'string',
        operators: ['=', '>=', '<=', '<=', '>=', '<', '>'],
        term: operator

    }

}

const options = {

    maxFilters: 100

};

const ctx: Context<Object> = { options, terms: defaultTerms, policies };

function compare(tree: any, that: any): void {

    must(tree).eql(that);

}

function makeTest(test, index) {

    let file = index.replace(/\s/g, '-');

    if (process.env.GENERATE) {

        compile(ctx, test.input)
            .map(o => {

                fs.writeFileSync(`./test/expectations/${file}.mongo`,
                    JSON.stringify(o));

            })
            .orRight(e => { if (!test.onError) throw new Error(e.message); })

    } else if (!test.skip) {

        compile(ctx, test.input)
            .map(o => {

                compare(JSON.stringify(o),
                    fs.readFileSync(`./test/expectations/${file}.mongo`, {
                        encoding: 'utf8'
                    }));

            })
            .orRight(e => {

                if (!test.onError)
                    throw new Error(e.message);

                test.onError(e);

            })

    }

}

describe('mongodb', function() {

    describe('compile', function() {

        Object.keys(tests).forEach(k => {

            it(k, function() {

                if (Array.isArray(tests[k])) {

                    tests[k].forEach(makeTest);

                } else {

                    makeTest(tests[k], k);

                }

            });
        });

    });

});
