# ChatsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createChatApiChatsPost**](ChatsApi.md#createchatapichatspost) | **POST** /api/chats | Create Chat |
| [**listChatsApiChatsGet**](ChatsApi.md#listchatsapichatsget) | **GET** /api/chats | List Chats |
| [**listMessagesApiChatsChatIdMessagesGet**](ChatsApi.md#listmessagesapichatschatidmessagesget) | **GET** /api/chats/{chat_id}/messages | List Messages |
| [**sendMessageApiChatsChatIdMessagesPost**](ChatsApi.md#sendmessageapichatschatidmessagespost) | **POST** /api/chats/{chat_id}/messages | Send Message |



## createChatApiChatsPost

> ChatRead createChatApiChatsPost(chatCreate)

Create Chat

### Example

```ts
import {
  Configuration,
  ChatsApi,
} from '';
import type { CreateChatApiChatsPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: HTTPBearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ChatsApi(config);

  const body = {
    // ChatCreate
    chatCreate: ...,
  } satisfies CreateChatApiChatsPostRequest;

  try {
    const data = await api.createChatApiChatsPost(body);
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
| **chatCreate** | [ChatCreate](ChatCreate.md) |  | |

### Return type

[**ChatRead**](ChatRead.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listChatsApiChatsGet

> Array&lt;ChatRead&gt; listChatsApiChatsGet()

List Chats

### Example

```ts
import {
  Configuration,
  ChatsApi,
} from '';
import type { ListChatsApiChatsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: HTTPBearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ChatsApi(config);

  try {
    const data = await api.listChatsApiChatsGet();
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

[**Array&lt;ChatRead&gt;**](ChatRead.md)

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


## listMessagesApiChatsChatIdMessagesGet

> Array&lt;MessageRead&gt; listMessagesApiChatsChatIdMessagesGet(chatId, limit, beforeId)

List Messages

### Example

```ts
import {
  Configuration,
  ChatsApi,
} from '';
import type { ListMessagesApiChatsChatIdMessagesGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: HTTPBearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ChatsApi(config);

  const body = {
    // number
    chatId: 56,
    // number (optional)
    limit: 56,
    // number (optional)
    beforeId: 56,
  } satisfies ListMessagesApiChatsChatIdMessagesGetRequest;

  try {
    const data = await api.listMessagesApiChatsChatIdMessagesGet(body);
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
| **chatId** | `number` |  | [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `50`] |
| **beforeId** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;MessageRead&gt;**](MessageRead.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sendMessageApiChatsChatIdMessagesPost

> MessageRead sendMessageApiChatsChatIdMessagesPost(chatId, sendMessageRequest)

Send Message

### Example

```ts
import {
  Configuration,
  ChatsApi,
} from '';
import type { SendMessageApiChatsChatIdMessagesPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: HTTPBearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ChatsApi(config);

  const body = {
    // number
    chatId: 56,
    // SendMessageRequest
    sendMessageRequest: ...,
  } satisfies SendMessageApiChatsChatIdMessagesPostRequest;

  try {
    const data = await api.sendMessageApiChatsChatIdMessagesPost(body);
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
| **chatId** | `number` |  | [Defaults to `undefined`] |
| **sendMessageRequest** | [SendMessageRequest](SendMessageRequest.md) |  | |

### Return type

[**MessageRead**](MessageRead.md)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

