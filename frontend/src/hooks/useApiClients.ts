import { useMemo } from 'react'
import { AttachmentsApi, AuthApi, ChatsApi, Configuration, UsersApi } from '../api/generated'
import { appConfig } from '../config'
import { useAuthStore } from '../store/useAuthStore'

export const useApiClients = () => {
  const accessToken = useAuthStore((state) => state.accessToken)

  const configuration = useMemo(
    () =>
      new Configuration({
        basePath: appConfig.apiBaseUrl,
        accessToken: accessToken ? () => accessToken : undefined,
      }),
    [accessToken],
  )

  return useMemo(
    () => ({
      authApi: new AuthApi(configuration),
      usersApi: new UsersApi(configuration),
      chatsApi: new ChatsApi(configuration),
      attachmentsApi: new AttachmentsApi(configuration),
    }),
    [configuration],
  )
}
