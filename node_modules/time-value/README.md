[![NPM Version](https://badge.fury.io/js/time-value.svg)](https://badge.fury.io/js/time-value)
[![CI](https://github.com/justinlettau/time-value/workflows/CI/badge.svg)](https://github.com/justinlettau/time-value/actions)
[![codecov](https://codecov.io/gh/justinlettau/time-value/branch/master/graph/badge.svg)](https://codecov.io/gh/justinlettau/time-value)
[![Dev Dependency Status](https://david-dm.org/justinlettau/time-value/dev-status.svg)](https://david-dm.org/justinlettau/time-value?type=dev)

# Time Value

An immutable library for parsing and manipulating an amount of time.

`Time` represents an amount of time (2hrs), not a time of day (2pm). Thus, `Time` can be negative
(`-02:30:00`) and greater than 24 hours (`52:30:00`). It pairs nicely with
[MySQL's time](https://dev.mysql.com/doc/refman/8.0/en/time.html) data type.

# Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)

# Features

- 🎉 **Immutable** API.
- 💪 Written in **TypeScript**.
- 🚀 **Zero** dependencies.

# Installation

```bash
npm install time-value --save
```

# Usage

```ts
import { Time } from 'time-value';

const time1 = Time.parse('02:30:10');
// => 2 hrs, 30 mins, and 10 secs

const time2 = new Time(5, 8, 30);
// => 5 hrs, 8 mins, and 30 secs

const time3 = time1.add(time2);
// => 7 hrs, 38 mins, 40 secs

const time4 = Time.sum(['05:30:00', '03:45:15']);
// => 9 hrs, 15 mins, and 15 secs
```

# Development

```
npm install
npm run build
```
