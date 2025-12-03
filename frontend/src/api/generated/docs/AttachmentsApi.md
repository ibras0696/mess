# AttachmentsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**linkAttachmentApiAttachmentsLinkPost**](AttachmentsApi.md#linkattachmentapiattachmentslinkpost) | **POST** /api/attachments/link | Link Attachment |
| [**presignUploadApiAttachmentsPresignPost**](AttachmentsApi.md#presignuploadapiattachmentspresignpost) | **POST** /api/attachments/presign | Presign Upload |



## linkAttachmentApiAttachmentsLinkPost

> linkAttachmentApiAttachmentsLinkPost(attachmentLinkRequest)

Link Attachment

### Example

```ts
import {
  Configuration,
  AttachmentsApi,
} from '';
import type { LinkAttachmentApiAttachmentsLinkPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: HTTPBearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AttachmentsApi(config);

  const body = {
    // AttachmentLinkRequest
    attachmentLinkRequest: ...,
  } satisfies LinkAttachmentApiAttachmentsLinkPostRequest;

  try {
    const data = await api.linkAttachmentApiAttachmentsLinkPost(body);
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
| **attachmentLinkRequest** | [AttachmentLinkRequest](AttachmentLinkRequest.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## presignUploadApiAttachmentsPresignPost

> PresignResponse presignUploadApiAttachmentsPresignPost(presignRequest)

Presign Upload

### Example

```ts
import {
  Configuration,
  AttachmentsApi,
} from '';
import type { PresignUploadApiAttachmentsPresignPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: HTTPBearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AttachmentsApi(config);

  const body = {
    // PresignRequest
    presignRequest: ...,
  } satisfies PresignUploadApiAttachmentsPresignPostRequest;

  try {
    const data = await api.presignUploadApiAttachmentsPresignPost(body);
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
| **presignRequest** | [PresignRequest](PresignRequest.md) |  | |

### Return type

[**PresignResponse**](PresignResponse.md)

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

