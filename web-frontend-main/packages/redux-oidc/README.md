# redux-oidc

# Introduction

This library is simplifed version of the oidc authorization flow heavly using redux for handling the auth state.

# Getting started

## Provider

Auth library exposes Provider:

```
<AuthProvider
        configuration={{
          authority: string, // authority url
          clientId: string,
          redirectUri: string, // redirect user once the external auth provider returns the success code
          scope: string,
          baseUrl: string, // base app url - mainly used for creating the API calls
          signOutRedirectUri:string // URL to redirect to after signing out
        }}
      >
	  </AuthProvider>
```


## Auth library flow

When user enter that app auth provider will take the following steps:

1. User is logging for the first time (doesn't have active session)
	1.1 User will be directed to the (external) login provider
	1.2 When authenticated it will be redirected back from the external auth provider to the app using `redirectUri` with added `code` as url paramether
	1.3 in `authCallbackComponents` (which is the component rendered for the `redirectUri`) `code` will be exctracted and `codeCallback` function will be called

	1.4 `codeCallback` is reponsable for getting an acceess, refresh and id token using the provided `code` from the redirect
		- When started `loading` state will be updated to true in the store
		- Success:
			Data from the codeCallback will be stored in local_storage
			`login` function would be called using the idToken from the response of the codeCallback fetch.
		- Failed:
			Request will be rejectedWithValue
			loading state will be changed to false

	1.5 `Login`	is responsable for login the user to the controller
		- Success:
			User state is changed to `authenticated`
			`loading` state is change to fale
		- Fail:
			User is signed off
			Request will be rejectedWithValue
			`loading` state is change to faled

		Only when login succes user will be marked as authenticated.

	1.6 `GetNewToken` is responsible for getting new access_token, refresh and idToken using the refresh token
		- Success:
			Data from the GetNewToken will be stored in local_storage
			`RefreshTokenLoading` will be updated to true
				RefreshLoading is different from loading because it's only for the refresh token and we want to make separation in UI updates.
				When general loading is happening UI should froze, when RefreshToken is loading ui should continue to work as usual
			`login` function would be called using the idToken from the response of the GetNewToken fetch.
		- Fail:
			User is signed off
			Request will be rejectedWithValue
			`RefreshTokenLoading` state is change to faled

2. If user is accessing the app and has active session
	- If access token is valid will let user to proceed with his flow
	- If access token is not valid it will try to get new token using the `GetNewToken`


3. Refresh token interval
	- When user is logeed in auth library will set an interval for getting new access token before the old one expires.
	- Interval is set up for 20% from (access_token expiration time - current time).
	- Note:
		- we have `logeedInTimestamp` flag in case user enters the app and session is already running. Interval will be counted
		less then his total ability. (session is already running for 2 min and token expiration time is 5 min -> calculation will be 20% of 3min).
		Then when first refresh when `login` happens we will update the login time, and use that to recalculate the interval.

4. Error handling

	- Auth library has `authError` action that can be used for dispatching errors
	- For now auth library is automaticly handling only:
		1. `AuthTypeError.SessionExpired` - when this happens auth will call `GetNewToken`
		2. `AuthTypeError.RefreshTokenFailed` - user will be signed off