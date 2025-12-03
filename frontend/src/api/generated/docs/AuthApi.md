# AuthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**loginApiAuthLoginPost**](AuthApi.md#loginapiauthloginpost) | **POST** /api/auth/login | Login |
| [**refreshApiAuthRefreshPost**](AuthApi.md#refreshapiauthrefreshpost) | **POST** /api/auth/refresh | Refresh |
| [**registerApiAuthRegisterPost**](AuthApi.md#registerapiauthregisterpost) | **POST** /api/auth/register | Register |
| [**tokenTestApiAuthMeTokenTestGet**](AuthApi.md#tokentestapiauthmetokentestget) | **GET** /api/auth/me/token-test | Token Test |



## loginApiAuthLoginPost

> TokenPair loginApiAuthLoginPost(loginRequest)

Login

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { LoginApiAuthLoginPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // LoginRequest
    loginRequest: ...,
  } satisfies LoginApiAuthLoginPostRequest;

  try {
    const data = await api.loginApiAuthLoginPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | [LoginRequest](LoginRequest.md) |  | |

### Return type

[**TokenPair**](TokenPair.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## refreshApiAuthRefreshPost

> AccessToken refreshApiAuthRefreshPost(refreshRequest)

Refresh

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { RefreshApiAuthRefreshPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // RefreshRequest
    refreshRequest: ...,
  } satisfies RefreshApiAuthRefreshPostRequest;

  try {
    const data = await api.refreshApiAuthRefreshPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **refreshRequest** | [RefreshRequest](RefreshRequest.md) |  | |

### Return type

[**AccessToken**](AccessToken.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## registerApiAuthRegisterPost

> TokenPair registerApiAuthRegisterPost(userCreate)

Register

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { RegisterApiAuthRegisterPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // UserCreate
    userCreate: ...,
  } satisfies RegisterApiAuthRegisterPostRequest;

  try {
    const data = await api.registerApiAuthRegisterPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userCreate** | [UserCreate](UserCreate.md) |  | |

### Return type

[**TokenPair**](TokenPair.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## tokenTestApiAuthMeTokenTestGet

> AccessToken tokenTestApiAuthMeTokenTestGet()

Token Test

Debug-only endpoint to ensure auth dependency works.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { TokenTestApiAuthMeTokenTestGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: HTTPBearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthApi(config);

  try {
    const data = await api.tokenTestApiAuthMeTokenTestGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**AccessToken**](AccessToken.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

