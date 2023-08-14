import React, { createContext, useCallback, useState } from 'react'

export type IModal = {
  id: string
  children: React.ReactNode
  closeable?: boolean
  callbackAfterClose?: () => Promise<void> | void
}
type CloseOptions = { withoutCallback?: boolean }
const defaultValue: {
  modals: IModal[]
  open: (modal: IModal) => void
  close: (options?: CloseOptions) => Promise<void> | void
} = {
  modals: [],
  open: (_: IModal) => {},
  close: (_?: CloseOptions) => {},
}
export const ModalContext = createContext(defaultValue)
const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, setModals] = useState<IModal[]>([])
  const open = useCallback(
    ({ children, id, callbackAfterClose = undefined, closeable = true }: IModal) => {
      const cloneModal = [...modals]
      cloneModal.push({
        children,
        id,
        callbackAfterClose,
        closeable,
      })
      setModals(cloneModal)
    },
    [modals]
  )

  const close = useCallback(
    async (options?: CloseOptions) => {
      const cloneModals = [...modals]
      const modal = cloneModals.pop()
      if (modal) {
        if (!options?.withoutCallback) {
          modal.callbackAfterClose && (await modal.callbackAfterClose())
        }
        setModals(cloneModals)
      }
    },
    [modals]
  )

  return (
    <ModalContext.Provider
      value={{
        modals,
        close,
        open,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider
