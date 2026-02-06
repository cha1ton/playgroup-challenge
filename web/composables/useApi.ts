export const useApi = () => {
  const config = useRuntimeConfig();
  const base = process.server ? config.apiInternalBase : config.public.apiBase;

  const get = <T>(url: string, opts: any = {}) =>
    $fetch<T>(`${base}${url}`, opts);

  return { base, get };
};
