import React from 'react'

// @TODO unused component, has raw css
const Icon = ({ icon, className = '', ...rest }) => {
  const mergedClassName = `material-icons ${className}`

  return (
    <div className='icon-wrapper'>
      <i className={mergedClassName} {...rest}>
        {icon}
      </i>
    </div>
  )
}

export default Icon