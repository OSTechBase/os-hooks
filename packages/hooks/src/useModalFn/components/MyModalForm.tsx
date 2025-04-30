import React from 'react';
import { ModalForm, BetaSchemaForm } from '@ant-design/pro-components';
import type { ProFormColumnsType } from '@ant-design/pro-components';

interface Props {
    closeModal: Function;
    children?: JSX.Element;
    onFinish?: Function;
    columns?: ProFormColumnsType<any>; // 是否传入 columns
    [key: string]: any;
}

const MyModalForm: React.FC<Props> = (props) => {
    const { closeModal, children, onFinish, columns, ...rest } = props;

    const handleFinish = async (values: any) => {
        const shouldClose = onFinish ? await onFinish(values) : true;
        if (shouldClose) closeModal();
        return true;
    };

    if (columns && Array.isArray(columns)) {
        return (
            <BetaSchemaForm
                columns={columns}
                layoutType='ModalForm'
                onFinish={handleFinish}
                {...rest}
            />
        );
    }

    return (
        <ModalForm
            onFinish={handleFinish}
            {...rest}
        >
            {children}
        </ModalForm>
    );
};

export default MyModalForm;
