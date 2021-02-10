export const loadScript = async (id, src, onLoad = () => { }, onError = () => { }, dom = document, tag = 'script') => {
    const element = dom.querySelector(`${tag}#${id}`)

    if (!element) {
        const ref = dom.getElementsByTagName(tag)[0]
        const script = dom.createElement(tag)

        script.id = id
        script.src = src
        script.onload = onLoad
        script.onerror = onError

        if (ref && ref.parentNode) {
            ref.parentNode.insertBefore(script, ref)
        } else {
            dom.body.appendChild(script)
        }
    } else {
        onLoad()
    }
}

export const removeScript = (id, dom = document, tag = 'script') => {
    const element = dom.querySelector(`${tag}#${id}`)

    if (element && element.parentNode) {
        element.parentNode.removeChild(element)
    }
}