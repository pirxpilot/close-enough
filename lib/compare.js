import transliterate from '@sindresorhus/transliterate';

export default function closeEnough() {
  const self = {
    compare,
    score,
    generics,
    synonyms,
    synonims: synonyms
  };

  const my = {
    eliminate: /and|[.&'"]/g,
    spaces: /[/\-_,]/g,
    generics: new Set(),
    synonyms: Object.create(null)
  };

  return self;

  function generics(g) {
    g.forEach(generic => my.generics.add(generic));
    return self;
  }

  function synonyms(a) {
    Object.entries(a).forEach(([k, v]) => {
      my.synonyms[k] = v;
    });
    return self;
  }

  function normalize(str = '') {
    let norm = transliterate(str ?? '')
      .toLowerCase()
      .replace(my.eliminate, '') // all characters and phrases that we want to remove
      .replace(my.spaces, ' ') // all things that we want to treat as spaces
      .split(/\s+/) // split removing spaces boundary
      .filter(word => !my.generics.has(word));

    if (my.synonyms) {
      norm = norm.map(word => (word in my.synonyms ? my.synonyms[word] : word));
    }

    return norm;
  }

  function compareArrays(a, b) {
    if (a.length > b.length) {
      return compareArrays(b, a);
    }
    const check = new Set(a).difference(new Set(b));
    return check.size / (a.length + 1);
  }

  function compareStrings(a, b) {
    if (a.length > b.length) {
      return compareStrings(b, a);
    }
    return a === b.slice(0, a.length);
  }

  function compare(a, b) {
    a = normalize(a);
    b = normalize(b);

    return compareStrings(a.join(''), b.join('')) || 0 === compareArrays(a, b);
  }

  function score(a, b) {
    a = normalize(a);
    b = normalize(b);

    if (compareStrings(a.join(''), b.join(''))) {
      return 0;
    }

    return compareArrays(a, b);
  }
}
