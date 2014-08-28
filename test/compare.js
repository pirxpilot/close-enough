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

  it('spearators do not matter', function() {
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



});