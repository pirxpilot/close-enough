module.exports = closeEnough;

var latinize = require('latinize');

function closeEnough() {
  var self = {}, my = {
    eliminate: /and|[.&'"]/g,
    spaces: /[\/\-_,]/g,
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
      .split(/\s+/)               // split removing spaces boundary
      .filter(function(word) {
        return !my.generics[word];
      });
  }


  function compareArrays(a, b) {
    if (a.length > b.length) {
      return compareArrays(b, a);
    }
    var check = a.reduce(function(check, item) {
      check[item] = 1;
      return check;
    }, Object.create(null));
    b.forEach(function(item) {
      check[item] = 0;
    });
    return 0 === Object.keys(check).reduce(function(diffs, item) {
      diffs += check[item];
      return diffs;
    }, 0);

  }

  function compare(a, b) {
    a = normalize(a || '');
    b = normalize(b || '');

    return compareArrays(a, b);
  }


  self.compare = compare;
  self.generics = generics;

  return self;
}


