import React from 'react'
import { useAuth } from '../../auth/AuthContext'
import './Profile.scss'

export default function Profile() {
    const { user } = useAuth()

    return (
        <div className="profile">
            <h1>Welcome back</h1>
        </div>
    )
}
