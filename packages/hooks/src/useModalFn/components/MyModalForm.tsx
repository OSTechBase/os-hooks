import React from 'react'
import { ModalForm } from '@ant-design/pro-components';
interface Props {
    closeModal: Function;
    children?: JSX.Element;
    onFinish?: Function;
}
const MyModal: React.FC<Props> = (props) => {
    const { closeModal, children, onFinish, ...rest } = props
    return (
        <ModalForm
            onFinish={async (values) => {
                const isOlose = onFinish ? await onFinish(values) : true
                if (isOlose) closeModal()
                return true;
            }}
            {...rest}
        >

            {children}
        </ModalForm>
    )
}

export default MyModal