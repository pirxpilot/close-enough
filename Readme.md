[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# close-enough

String comparison allowing for arbitrary differences.

## Install

```sh
$ npm install --save close-enough
```

## Usage

```javascript
const closeEnough = require('close-enough');

// Create a comparator instance
const ce = closeEnough();

// Basic string comparison
ce.compare('Hello World', 'hello world'); // true - case insensitive
ce.compare('abc def', 'def abc'); // true - word order doesn't matter
ce.compare('café', 'cafe'); // true - diacritical marks are ignored

// Different strings
ce.compare('abc def', 'abc xyz'); // false

// Separators and spacing are normalized
ce.compare('hello-world', 'hello world'); // true
ce.compare('hello/world', 'hello_world'); // true
ce.compare('hello   world', 'hello world'); // true

// Extra words are ignored (shorter string must be subset of longer)
ce.compare('abc def', 'abc zzz def'); // true
ce.compare('abc def ghi', 'abc def'); // true

// Get similarity score (0 = identical, higher = more different)
ce.score('hello world', 'hello world'); // 0
ce.score('hello world', 'hello earth'); // 0.5
```

### Advanced Usage

#### Filtering Generic Words

Remove common words that should be ignored during comparison:

```javascript
const ce = closeEnough().generics(['hotel', 'inn', 'suites']);

ce.compare('Holiday Inn Hotel', 'Holiday Suites'); // true
```

#### Using Synonyms

Define words that should be treated as equivalent:

```javascript
const ce = closeEnough().synonims({
  'street': 'st',
  'avenue': 'ave',
  'road': 'rd'
});

ce.compare('Main Street', 'Main St'); // true
ce.compare('Park Avenue', 'Park Ave'); // true
```

#### Chaining Configuration

You can chain multiple configuration methods:

```javascript
const ce = closeEnough()
  .generics(['hotel', 'inn', 'resort'])
  .synonims({
    'street': 'st',
    'avenue': 'ave'
  });

ce.compare('Grand Hotel on Main Street', 'Grand Inn on Main St'); // true
```

### API

- `compare(a, b)` - Returns `true` if strings are considered close enough, `false` otherwise
- `score(a, b)` - Returns a numeric score indicating difference (0 = identical)
- `generics(array)` - Configure generic words to ignore during comparison
- `synonims(object)` - Configure word synonyms for comparison



## License

MIT © [Damian Krzeminski][https://github.com/pirxpilot]

[npm-image]: https://img.shields.io/npm/v/close-enough
[npm-url]: https://npmjs.org/package/close-enough

[build-url]: https://github.com/pirxpilot/close-enough/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/close-enough/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/close-enough
[deps-url]: https://libraries.io/npm/close-enough
