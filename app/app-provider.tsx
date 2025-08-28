'use client'

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { UserProvider } from './user-provider'

interface ContextProps {
  sidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  sidebarExpanded: boolean
  setSidebarExpanded: Dispatch<SetStateAction<boolean>>
}

const AppContext = createContext<ContextProps>({
  sidebarOpen: false,
  setSidebarOpen: (): boolean => false,
  sidebarExpanded: false,
  setSidebarExpanded: (): boolean => false
})

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {  
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false)
  return (
    <AppContext.Provider value={{ sidebarOpen, setSidebarOpen, sidebarExpanded, setSidebarExpanded }}>
      <UserProvider>
        {children}
      </UserProvider>
    </AppContext.Provider>
  )
}

export const useAppProvider = () => useContext(AppContext)