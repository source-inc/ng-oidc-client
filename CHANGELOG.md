# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.5] - 2018-12-05
### Added
- Upgrade to Angular 7
### Fixex
- Removed log messages

## [1.0.4] - 2018-10-18
### Fixed
- Fix issue with AoT builds of importing project

## [1.0.3] - 2018-10-18
### Fixed
- Resolve dependencies for OidcService
- Fix Redirect Logout button in example app

## [1.0.2] - 2018-10-18
### Fixed
- Issue [#2](https://github.com/Fileless/ng-oidc-client/issues/2) to enable builds with `--prod` flag

## [1.0.1] - 2018-10-15
### Added
- New configuration `useCallbackFlag?:boolean` to indicate if Popup or Callback should be remembered in local storage

### Fixed
- Inextensibility error when passing arguments to signinPopup/signinRedirect

## [1.0.0] - 2018-10-12
### Added
- First release

[1.0.5]: https://github.com/fileless/ng-oidc-client/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/fileless/ng-oidc-client/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/fileless/ng-oidc-client/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/fileless/ng-oidc-client/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/fileless/ng-oidc-client/compare/v1.0.0...v1.0.1
