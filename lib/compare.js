module.exports = closeEnough;

var latinize = require('./latinize');

function closeEnough() {
  var self = {}, my = {
    eliminate: /and|[.&'"]/g,
    spaces: /[\-_,]/g,
    generics: Object.create(null)
  };


  function generics(g) {
    g.forEach(function(generic) {
      my.generics[generic] = true;
    });
    return self;
  }

  function normalize(str) {
    return latinize(str)
      .toLowerCase()
      .replace(my.eliminate, '')  // all charactes and phrases that we want to remove
      .replace(my.spaces, ' ')    // all things that we want to treat as spaces
      .replace(/\s+/g, ' ')       // remove multiple spaces
      .trim()                     // remove leading and trailing space
      .split(/\b/)                // split on words boundary
      .filter(function(word) {
        return !my.generics[word];
      })
      .sort()
      .join('_');
  }


  function compare(a, b) {
    var t;

    a = normalize(a);
    b = normalize(b);

    console.log(a, b);

    if (a.length > b.length) {
      t = a;
      a = b;
      b = t;
    }

    return a === b.slice(0, a.length);
  }


  self.compare = compare;
  self.generics = generics;

  return self;
}


