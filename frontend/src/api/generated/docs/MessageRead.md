
# MessageRead


## Properties

Name | Type
------------ | -------------
`id` | number
`chatId` | number
`senderId` | number
`text` | string
`createdAt` | Date

## Example

```typescript
import type { MessageRead } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "chatId": null,
  "senderId": null,
  "text": null,
  "createdAt": null,
} satisfies MessageRead

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MessageRead
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


