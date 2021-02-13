const duckify = (namespace, store, types, sep = '/') => (
    types.reduce((acc, cur) => ({ ...acc, [cur]: `${namespace}${sep}${store}${sep}${cur}` }), {})
)

export default duckify