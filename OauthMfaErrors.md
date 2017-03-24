invalid_request

> The request is missing a required parameter, includes an unsupported
> parameter value (other than challenge type), repeats a parameter, includes
> multiple credentials, utilizes more than one mechanism for authenticating the
> client, or is otherwise malformed.

* `Binding code is required` -- Change this to the next one.

* `binding_code is required`
  * Cause: When the out-of-band multifactor authentication challenge sends a
    code to the end-user (via SMS), the user should be prompted for that code.
  * Fix: When the request to `/mfa/challenge` includes `"binding_method":
    "prompt"` in its response, prompt the user for the sent code and include
    that as `binding_code` in the `/oauth/token` request.

* `mfa_token not issued to this client`
  * Cause: The `mfa_token` received in the initial `/oauth/token` request was
    issued to another client.
  * Fix: Make sure you use the same `client_id` in the multifactor requests as
    the one used in the initial `/oauth/token` request.

* `Mfa token must include txn` -- Change this to the next one (The client need
  only know that the thing sent in `mfa_token` parameter is not what we sent
  out.)

* `Malformed mfa_token`
  * Cause: The `mfa_token` sent is not correct.
  * Fix: Make sure to send back the exact `mfa_token` received in the original
    `/oauth/token` call.

* `Unsupported multifactor provider: "${payload.rap}"`
* `invalid audience specified for password grant exchange`


expired_token

> The provided MFA token is invalid, expired, or revoked.  The client will need
> to initiate a new authorization session.

* `Invalid sub` 403
* `Invalid challenge type` 403
* `Invalid session id`  403
* `${tokenName} is expired` 403
* `${tokenName} is invalid` 403


unsupported_challenge_type

> The challenge types supported by the client are not supported by the
> authorization server.

* `user is not enrolled with Google authenticator. Please enroll first.` 400
* `Unsupported challenge type: oob.` (for google)
* `User is not enrolled with ${exports.name}` 401
* `The user does not support ${pluralize(types, 'the requested challenge type',
  'any of the requested challenge types')} (${types.join(', ')}). Supported
  type: ${supportedType}.` 401
* `${pluralize(types, 'the requested challenge type', 'any of the requested
  challenge types')} (${types.join(', ')}). Currently there is no supported
  challenge available.` 401


invalid_grant

* `MFA Invalid binding code.`
* `MFA Authorization rejected.`
* `user is blocked`
