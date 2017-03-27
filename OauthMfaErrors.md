invalid_request
---------------

> The request is missing a required parameter, includes an unsupported
> parameter value (other than challenge type), repeats a parameter, includes
> multiple credentials, utilizes more than one mechanism for authenticating the
> client, or is otherwise malformed.

* `Binding code is required` -> `binding_code is required` below

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

* `Mfa token must include txn` -> `Malformed mfa_token`

* `Malformed mfa_token` -> `invalid_grant`?
  * Cause: The `mfa_token` sent is not correct.
  * Fix: Make sure to send back the exact `mfa_token` received in the original
    `/oauth/token` call.

* `Unsupported multifactor provider: "${payload.rap}"`
  * ....shouldn't this also be just `Malformed mfa_token`?  This can only
    happen if the client hasn't sent an `mfa_token` issued by us.

* `invalid audience specified for password grant exchange`


expired_token
-------------

> The provided MFA token is invalid, expired, or revoked.  The client will need
> to initiate a new authorization session.

* `${tokenName} is expired` 403
  * Cause: Too much time has passed since the `mfa_token` or `oob_code` was issued.
  * Fix: Restart the authentication to get a new `mfa_token` (and `oob_code`).

* `Invalid sub` 403 -> `server_error`
* `Invalid challenge type` 403 -> `server_error`
* `Invalid session id`  403 -> `server_error`

* `${tokenName} is invalid` 403  -> `invalid grant`/`Malformed mfa_token`


unsupported_challenge_type
--------------------------

> The challenge types supported by the client are not supported by the
> authorization server.

* `User is not enrolled with ${exports.name}` 401 -> ...same as below?

* `user is not enrolled with Google authenticator. Please enroll first.` 400
  * Cause: The user trying to authenticate hasn't enrolled any authneticator
    with Google authenticator.
  * Fix: Ask the user to enroll an authenticator in a normal login flow.

* `Unsupported challenge type: oob.` (for google) -> `server_error`

* `The user does not support ${pluralize(types, 'the requested challenge type',
  'any of the requested challenge types')} (${types.join(', ')}). Supported
  type: ${supportedType}.` 401
  * Cause: The client has asked for a challenge type that is not supported by
    the chosen multifactor authentication provider, is disabled by the tenant,
    or the user's enrolled authenticator.
  * Fix: Use one of the available challenge types, change multifactor
    authentication settings in the manage dashboard, or ask the user to use a
    recovery code (implementing the recovery code flow).

* `${pluralize(types, 'the requested challenge type', 'any of the requested
  challenge types')} (${types.join(', ')}). Currently there is no supported
  challenge available.` 401
  * Cause: The user has enrolled an authenticator that is currently not
    available, due to unavailable transports.
  * Fix: Ask the user to use a recovery code.


invalid_grant
-------------

* `MFA Invalid binding code.` -> `Invalid binding_code`
  * Cause: The given `binding_code` is incorrect.
  * Fix: Prompt the user for the sent binding code again, or restart the login flow.

* `MFA Authorization rejected.` (-> one of them should be `Invalid otp_code`.)
  * Cause: The user has rejected the out of band authorization request.
  * Fix: Offer the user to restart the login process.
