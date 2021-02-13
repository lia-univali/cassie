export const callback = async (request, ...params) => {
    const [context, fn] = (() => {
        if (Array.isArray(request)) return [request[0], request[1]]
        return [request, request]
    })()

    return new Promise((resolve, reject) => {
        fn.apply(context, [...params, (success, error) => {
            if (error) reject(error)
            resolve(success)
        }])
    })
}