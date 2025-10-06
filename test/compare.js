import assert from 'node:assert';
import { describe, it } from 'node:test';
import ce from '../lib/compare.js';

describe('close-enough', () => {
  it('identical words are close enough', () => {
    assert(ce().compare('abc def', 'abc def'));
  });

  it('order of words does not matter', () => {
    assert(ce().compare('abc def', 'def abc'));
  });

  it('case does not matter', () => {
    assert(ce().compare('aBC def', 'Def abc'));
  });

  it('diacritical marks do not matter', () => {
    assert(ce().compare('ąBC def', 'DĘf abc'));
  });

  it('spaces do not matter', () => {
    assert(ce().compare('ąBC    def', 'DĘf abc'));
    assert(ce().compare('Les Battées', 'Les Battees'));
    assert(ce().compare('Hotel Première Classe', 'Hotel Premiere Classe'));
    assert(ce().compare('La Réserve au Pavillon de Château Raba', 'La Reserve au Pavillon de Chateau'));
  });

  it('separators do not matter', () => {
    assert(ce().compare('ąBC-def', 'DĘf abc'));

    assert(ce().compare('ab cd ef', 'abc def'));

    assert(
      ce().compare(
        'Holiday Inn Express Hotel & Suites Phoenix Downtown-Ballpark - Phoenix',
        'Holiday Inn Express Hotel & Suites Phoenix Downtown/Ball Park'
      )
    );
  });

  it('extra words are ignored', () => {
    assert(ce().compare('abc def', 'abc zzz def'));
  });

  it('different words are different', () => {
    assert(!ce().compare('abc def', 'abc xyz'));
  });

  it('generic words are filtered out', () => {
    assert(ce().generics(['def', 'xyz', 'ttt']).compare('abc def', 'abc xyz'));
  });

  it('undefined is treated as an empty string', () => {
    assert(ce().compare(null, undefined));
    assert(ce().compare(''));
    assert(ce().compare());
  });

  it('apply synonyms when comparing strings', () => {
    assert(
      !ce()
        .synonyms({
          defzz: 'xyz',
          def: 'aaa'
        })
        .compare('abc def', 'abc xyz'),
      'still different with synonyms'
    );
    assert(
      ce()
        .synonyms({
          def: 'xyz'
        })
        .compare('abc def', 'abc xyz'),
      'the same with synonyms'
    );
  });
});

describe('score', () => {
  it('should count differences in strings', () => {
    const a = '10 Niederkirchnerstraße, Germany, Berlin';
    const b = '10 Niederkirchnerstr., Germany, Berlin';
    const c = '10 Niederkirchnerstrasse, Germany, Berlin';
    const d = '10 Niederkirchner Strasse, Germany, Berlin, Europ';

    assert.equal(ce().score(a, b), 1 / 5);
    assert.equal(ce().score(a, c), 0);
    assert.equal(ce().score(a, d), 0);
    assert.equal(ce().score(b, d), 1 / 5);
  });

  it('should return 0 for strings we consider equal', () => {
    assert.equal(ce().score(), 0);
    assert.equal(ce().score('ab cd ef', 'abc def'), 0);
    assert.equal(ce().score('abc', 'abc'), 0);
    assert.equal(ce().score('ab cd ef', 'ab ef'), 0);
  });
});
