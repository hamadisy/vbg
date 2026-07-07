export interface ScopeMetadata {
  // DI token of the repository (ICrudRepository<T>) the scope guard should resolve
  token: unknown;
  // route param name holding the resource id, e.g. 'id'
  paramName: string;
}
