# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.2](https://github.com/matt-usurp/pilgrim/compare/v0.2.1...v0.2.2) (2021-01-23)


### Bug Fixes

* **lambda:** compile for node 10 compatibility ([17995c3](https://github.com/matt-usurp/pilgrim/commit/17995c33d4aae7f86b49d5184e3ee422743f8da9))

### [0.2.1](https://github.com/matt-usurp/pilgrim/compare/v0.2.0...v0.2.1) (2021-01-21)


### Features

* further improved api for aws lambda ([6907200](https://github.com/matt-usurp/pilgrim/commit/690720035422d27e883e3dc86d6fb67df2b32864))


### Bug Fixes

* add missing result definition to cognito events ([a36d6b3](https://github.com/matt-usurp/pilgrim/commit/a36d6b3a826990936405a8ffe15bdb19f9f6b122)) [@sarcastic-coder](https://github.com/sarcastic-coder)
* removed aws application class usage from library ([f0db8d9](https://github.com/matt-usurp/pilgrim/commit/f0db8d95029d46cc0e9a9f5281d3244313747b6c))

### Deprecations

* `AmazonWebServiceApplication` has been deprecated for the `aws()` instead.

## [0.2.0](https://github.com/matt-usurp/pilgrim/compare/v0.1.1...v0.2.0) (2021-01-20)


### Features

* public api cleanup for lambda types ([ef5ed67](https://github.com/matt-usurp/pilgrim/commit/ef5ed670fc354dd21eccf6351184f0884b75e5c6))
* handler with knowledge of inbound ([9e1277a](https://github.com/matt-usurp/pilgrim/commit/9e1277a3ae120c4abe07f480779f56d6bebbb3f5))

### Breaking Changes

Changes from [ef5ed67](https://github.com/matt-usurp/pilgrim/commit/ef5ed670fc354dd21eccf6351184f0884b75e5c6) mean the `Lambda` namespace has had some considerable changes. Here is a summary of the most important changes:

* `Lambda.CreateInbound` renamed `Lambda.Inbound`
* `Lambda.Middleware.EventAware` renamed `Lambda.Middleware`
* `Lambda.Middleware.EventAwareValidator` renamed `Lambda.Middleware.Validator`
* `Lambda.Middleware.EventlessValidator` renamed `Lambda.Middleware.Validator.Eventless`

### [0.1.1](https://github.com/matt-usurp/pilgrim/compare/v0.1.0...v0.1.1) (2021-01-20)


### Bug Fixes

* aws lambda types not working because of module syntax ([5014438](https://github.com/matt-usurp/pilgrim/commit/5014438833a03c9b0889d1c344e7181c884e76f8))
* compile for node only ([9fcb5b3](https://github.com/matt-usurp/pilgrim/commit/9fcb5b35a849d5ba0e69acf922df5cec15035c4b))

## 0.1.0 (2021-01-19)


### Features

* add event type maps for all sources defined in aws-lambda ([3fe6521](https://github.com/matt-usurp/pilgrim/commit/3fe6521e4f89ca9c93e433a4ff9faae7c9b2cbd4)) [@sarcastic-coder](https://github.com/sarcastic-coder)
* readme ([39cf8d6](https://github.com/matt-usurp/pilgrim/commit/39cf8d6325ae0182371b77208a1ace8061122d2e))
* update and document almost everything ([5daacaa](https://github.com/matt-usurp/pilgrim/commit/5daacaa73720af90660034f05d20aa89a4a90994))


### Bug Fixes

* readme example broken ([0f79c92](https://github.com/matt-usurp/pilgrim/commit/0f79c92fbbec3c5006675a606ef4c55691ef53f4))
