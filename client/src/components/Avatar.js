import React from "react"
import { useSelector } from "react-redux"

const Avatar = ({src ,size}) => {
    const { theme } = useSelector(state => state)

    return (
        <img src={src} alt="avatar" className={size}
            style={{ filter: `${theme ? 'inherit(1)' : 'inherit(0)'}` }} />


    )
}
export default Avatar