import React from 'react'
import {Link} from 'react-router-dom'

export default function Header() {
    return (
        <div className="header">
            <Link to="/" className="link">
                <h1>Gora Gora</h1>
            </Link>
        </div>
    )
}
