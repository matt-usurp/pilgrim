# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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

* add event type maps for all sources defined in aws-lambda ([3fe6521](https://github.com/matt-usurp/pilgrim/commit/3fe6521e4f89ca9c93e433a4ff9faae7c9b2cbd4))
* readme ([39cf8d6](https://github.com/matt-usurp/pilgrim/commit/39cf8d6325ae0182371b77208a1ace8061122d2e))
* update and document almost everything ([5daacaa](https://github.com/matt-usurp/pilgrim/commit/5daacaa73720af90660034f05d20aa89a4a90994))


### Bug Fixes

* readme example broken ([0f79c92](https://github.com/matt-usurp/pilgrim/commit/0f79c92fbbec3c5006675a606ef4c55691ef53f4))