import { strict as assert } from 'node:assert';
import testUtils, { GLOBAL } from '../test-utils';
import GEORADIUSBYMEMBER_WITH from './GEORADIUSBYMEMBER_WITH';
import { CommandArguments } from '../RESP/types';
import { GEO_REPLY_WITH } from './GEOSEARCH_WITH';
import { parseArgs } from './generic-transformers';

describe('GEORADIUSBYMEMBER WITH', () => {
  it('transformArguments', () => {
    const expectedReply: CommandArguments = ['GEORADIUSBYMEMBER', 'key', 'member', '3', 'm', 'WITHDIST'];
    expectedReply.preserve = ['WITHDIST'];

    assert.deepEqual(
      parseArgs(GEORADIUSBYMEMBER_WITH, 'key', 'member', 3, 'm', [
        GEO_REPLY_WITH.DISTANCE
      ]),
      expectedReply
    );
  });

  testUtils.testAll('geoRadiusByMemberWith', async client => {
    const [, reply] = await Promise.all([
      client.geoAdd('key', {
        member: 'member',
        longitude: 1,
        latitude: 2
      }),
      client.geoRadiusByMemberWith('key', 'member', 1, 'm', [
        GEO_REPLY_WITH.HASH,
        GEO_REPLY_WITH.DISTANCE,
        GEO_REPLY_WITH.COORDINATES
      ])
    ]);

    assert.equal(reply.length, 1);
    assert.equal(reply[0].member, 'member');
    assert.equal(typeof reply[0].distance, 'string');
    assert.equal(typeof reply[0].hash, 'number');
    assert.equal(typeof reply[0].coordinates!.longitude, 'string');
    assert.equal(typeof reply[0].coordinates!.latitude, 'string');
  }, {
    client: GLOBAL.SERVERS.OPEN,
    cluster: GLOBAL.CLUSTERS.OPEN
  });
});
