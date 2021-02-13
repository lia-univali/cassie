const ee = window.ee // @TODO Move on to @google/earthengine

export { ee }

export const authenticateViaOauth = async (clientId, scopes = null, onImmediateFailure = () => { }) => {
    return await new Promise((resolve, reject) => {
        ee.data.authenticateViaOauth(
            clientId,
            success => resolve(success),
            error => reject(error),
            scopes,
            immediate => {
                try {
                    onImmediateFailure()
                    resolve()
                }
                catch (e) {
                    reject(e)
                }
            }
        )
    })
}

export const load = async (baseUrl = null, tileUrl = null) => {
    window.ee = ee
    return await new Promise((resolve, reject) => {
        ee.initialize(baseUrl, tileUrl, success => resolve(success), error => reject(error))
    })
}

export const initializeEEConnection = async (clientId = null, scopes = null, onImmediateFailure = () => { }) => {
    await authenticateViaOauth(clientId, scopes, onImmediateFailure)
    await load()
    return ee.data.getAuthToken()
}

export default ee;