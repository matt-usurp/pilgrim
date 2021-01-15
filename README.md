# Pilgrim

A type-safe platform handler/framework for AWS lambda with middleware support.

## Usage

> The package is in a non-1.0 release state.
> The public API and types might change or be moved within any minor version change.
> A change log will be provided where possible to allow more frictionless upgrade.

Currently usage can be seen in the various example files within `/examples`.
Remember that this package ensures type safety across your lambda middleware and handlers, so it is expected to have to write a good amount of type information.
Although there are a few cases where types are infered the focus of this library is around stand-alone and re-usable middlewares and handlers.

## Roadmap

* Make agnostic to provider, allowing support for Azure and GCP.
* Improve test cases to cover scenarios.
