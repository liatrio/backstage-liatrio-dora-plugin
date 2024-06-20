import { useApi, identityApiRef } from '@backstage/core-plugin-api';

export const getRepoName = (e: any) => {
  if ('github.com/project-slug' in e.entity.metadata.annotations) {
    return e.entity.metadata.annotations['github.com/project-slug'].split('/')[1]
  } else {
    return ""
  }
}

export const genAuthHeaderValueLookup = () => {
  const identityApi = useApi(identityApiRef)

  return async() => {
    const obj = await identityApi.getCredentials()

    if(obj.token) {
      return `Bearer ${obj.token}`
    } else {
      return undefined
    }
  }
}