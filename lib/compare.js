import transliterate from '@sindresorhus/transliterate';

export default function closeEnough() {
  const self = {};

  const my = {
    eliminate: /and|[.&'"]/g,
    spaces: /[/\-_,]/g,
    generics: new Set()
  };

  function generics(g) {
    g.forEach(generic => my.generics.add(generic));
    return self;
  }

  function synonims(a) {
    my.synonims ??= Object.create(null);
    Object.keys(a).forEach(prop => {
      my.synonims[prop] = a[prop];
    });
    return self;
  }

  function normalize(str = '') {
    let norm = transliterate(str ?? '')
      .toLowerCase()
      .replace(my.eliminate, '') // all charactes and phrases that we want to remove
      .replace(my.spaces, ' ') // all things that we want to treat as spaces
      .split(/\s+/) // split removing spaces boundary
      .filter(word => !my.generics.has(word));

    if (my.synonims) {
      norm = norm.map(word => (word in my.synonims ? my.synonims[word] : word));
    }

    return norm;
  }

  function compareArrays(a, b) {
    if (a.length > b.length) {
      return compareArrays(b, a);
    }
    const check = a.reduce((check, item) => {
      check[item] = 1;
      return check;
    }, Object.create(null));
    b.forEach(item => {
      check[item] = 0;
    });
    return (
      Object.keys(check).reduce((diffs, item) => {
        diffs += check[item];
        return diffs;
      }, 0) /
      (a.length + 1)
    );
  }

  function compareStrings(a, b) {
    if (a.length > b.length) {
      return compareStrings(b, a);
    }
    return a === b.slice(0, a.length);
  }

  function compare(a, b) {
    a = normalize(a || '');
    b = normalize(b || '');

    return compareStrings(a.join(''), b.join('')) || 0 === compareArrays(a, b);
  }

  function score(a, b) {
    a = normalize(a || '');
    b = normalize(b || '');

    if (compareStrings(a.join(''), b.join(''))) {
      return 0;
    }

    return compareArrays(a, b);
  }

  self.compare = compare;
  self.score = score;
  self.generics = generics;
  self.synonims = synonims;

  return self;
}
