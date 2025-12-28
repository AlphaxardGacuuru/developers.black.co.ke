'use client'

import { useApp } from '@/contexts/AppContext'
import { Children, cloneElement, isValidElement } from 'react'

export default function AppContextInjector({ children }) {
    const appContext = useApp()

    // Clone children and inject app context as props
    const childrenWithProps = Children.map(children, child => {
        if (isValidElement(child)) {
            return cloneElement(child, appContext)
        }
        return child
    })

    return <>{childrenWithProps}</>
}
