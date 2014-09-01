var assert = require('assert');

var ce = require('..');


/* global describe, it */

describe('close-enough', function() {
  it('identical words are close enough', function() {
    assert(ce().compare('abc def', 'abc def'));
  });

  it('order of words does not matter', function() {
    assert(ce().compare('abc def', 'def abc'));
  });

  it('case does not matter', function() {
    assert(ce().compare('aBC def', 'Def abc'));
  });

  it('diacritical marks do not matter', function() {
    assert(ce().compare('ąBC def', 'DĘf abc'));
  });

  it('spaces do not matter', function() {
    assert(ce().compare('ąBC    def', 'DĘf abc'));
    assert(ce().compare('Les Battées', 'Les Battees'));
    assert(ce().compare('Hotel Première Classe', 'Hotel Premiere Classe'));
    assert(ce().compare('La Réserve au Pavillon de Château Raba', 'La Reserve au Pavillon de Chateau'));
  });

  it('separators do not matter', function() {
    assert(ce().compare('ąBC-def', 'DĘf abc'));

    assert(ce().compare('ab cd ef', 'abc def'));

    assert(ce().compare(
      'Holiday Inn Express Hotel & Suites Phoenix Downtown-Ballpark - Phoenix',
      'Holiday Inn Express Hotel & Suites Phoenix Downtown/Ball Park'
    ));
  });

  it('extra words are ignored', function() {
    assert(ce().compare('abc def', 'abc zzz def'));
  });

  it('different words are different', function() {
    assert(!ce().compare('abc def', 'abc xyz'));
  });


  it('generic words are filtered out', function() {
    assert(ce().generics(['def', 'xyz', 'ttt']).compare('abc def', 'abc xyz'));
  });

  it('undefined is treated as an empty string', function() {
    assert(ce().compare(null, undefined));
    assert(ce().compare(''));
    assert(ce().compare());
  });

  it ('apply synonims when comparing strings', function() {
    assert(!ce().synonims({
      'defzz': 'xyz',
      'def': 'aaa'
    }).compare('abc def', 'abc xyz'), 'still different with synonims');
    assert(ce().synonims({
      'def': 'xyz'
    }).compare('abc def', 'abc xyz'), 'the same with synonims');
  });
});

describe('score', function() {
  it('should count differences in strings', function() {
    var a = '10 Niederkirchnerstraße, Germany, Berlin',
      b = '10 Niederkirchnerstr., Germany, Berlin',
      c = '10 Niederkirchnerstrasse, Germany, Berlin',
      d = '10 Niederkirchner Strasse, Germany, Berlin, Europ';

    assert.equal(ce().score(a, b), 1/5);
    assert.equal(ce().score(a, c), 1/5);
    assert.equal(ce().score(a, d), 1/5);
    assert.equal(ce().score(b, d), 1/5);

  });

  it('should return 0 for strings we consider equal', function() {
    assert.equal(ce().score(), 0);
    assert.equal(ce().score('ab cd ef', 'abc def'), 0);
    assert.equal(ce().score('abc', 'abc'), 0);
    assert.equal(ce().score('ab cd ef', 'ab ef'), 0);
  });
});