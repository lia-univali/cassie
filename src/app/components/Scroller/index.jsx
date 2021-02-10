import React, { useEffect } from 'react'
import { useLocation } from 'react-router'

const Scroller = ({ children }) => {
    const location = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}

export default Scroller