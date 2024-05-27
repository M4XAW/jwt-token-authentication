import React from 'react'
import { useAuth } from '../../auth/AuthContext'
import './Profile.scss'

export default function Profile() {
    const { user } = useAuth()

    return (
        <div className="profile">
            <h1 className='textGradient'>Welcome back, {user.username}</h1>
        </div>
    )
}
