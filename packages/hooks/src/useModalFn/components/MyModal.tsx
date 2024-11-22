import React, { useState } from 'react'
import { Modal } from 'antd';
interface Props {
    onOk?: Function;
    closeModal: Function;
    children?: React.ReactNode
    open: boolean;
}
const MyModal: React.FC<Props> = (props) => {
    const { onOk, closeModal, children, ...rest } = props
    const [loading, setLoading] = useState(false)

    return (
        <Modal confirmLoading={loading} {...rest} onOk={async () => {
            setLoading(true)
            // onOk(closeModal)
            const isOlose = onOk ? await onOk() : true
            setLoading(false)
            if (isOlose) closeModal()
        }}>
            {children}
        </Modal>
    )
}

export default MyModal