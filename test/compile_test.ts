import * as fs from 'fs';

import { assert } from '@quenk/test/lib/assert';
import { tests } from '@quenk/search-filters/lib/tests';

import { MongoDBFilterCompiler } from '../lib';

const policies = {

    type: 'match',

    name: 'matchci',

    'user.username': 'match',

    age: 'number',

    tag: 'match',

    religion: 'matchci',

    active: 'boolean',

    rank: 'number',

    discount: 'number',

    'namespace': 'number',

    user: 'match',

    price: 'number',

    filetype: 'string',

    dob: 'date',

    date_of_birth: 'date',

    created_on: 'date',

    trini_national_id: 'string'

}
const mfc = new MongoDBFilterCompiler();

const compare = (tree: any, that: any) => {

    assert(tree).equate(that);

}

const makeTest = (test, index) => {

    let file = index.replace(/\s/g, '-');

    if (process.env.GENERATE) {

        mfc.compile(policies, test.input)
            .map(o => {

                fs.writeFileSync(`./test/expectations/${file}.json`,
                    JSON.stringify(o));

            })
            .orRight(e => { if (!test.onError) throw new Error(e.message); })

    } else if (!test.skip) {

        mfc.compile(policies, test.input)
            .map(o => {

                compare(JSON.stringify(o),
                    fs.readFileSync(`./test/expectations/${file}.json`, {
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

describe('MongoDBFilterCompiler', () => {

    describe('compile', () => {

        Object.keys(tests).forEach(k => {

            it(k, () => {

                if (Array.isArray(tests[k])) {

                    tests[k].forEach(makeTest);

                } else {

                    makeTest(tests[k], k);

                }

            });
        });

    });

});
