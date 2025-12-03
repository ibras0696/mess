
# AttachmentLinkRequest


## Properties

Name | Type
------------ | -------------
`messageId` | number
`objectKey` | string
`fileName` | string
`contentType` | string
`sizeBytes` | number
`url` | string

## Example

```typescript
import type { AttachmentLinkRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "messageId": null,
  "objectKey": null,
  "fileName": null,
  "contentType": null,
  "sizeBytes": null,
  "url": null,
} satisfies AttachmentLinkRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AttachmentLinkRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


