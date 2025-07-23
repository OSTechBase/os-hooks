import React from 'react';
import { ModalForm, BetaSchemaForm } from '@ant-design/pro-components';
import type { ProFormColumnsType } from '@ant-design/pro-components';

interface Props<T> {
    closeModal: Function;
    children?: JSX.Element;
    onFinish?: (values: T) => Promise<boolean | void>;
    columns?: ProFormColumnsType<T>[]; // 是否传入 columns
    [key: string]: any;
}

const MyModalForm = <T extends Record<string, any>>(props: Props<T>) => {
    const { closeModal, children, onFinish, columns, ...rest } = props;

    const handleFinish = async (values: T) => {
        const shouldClose = onFinish ? await onFinish(values as T) : true;
        if (shouldClose) closeModal();
        return true;
    };
    if (columns && Array.isArray(columns)) {
        return (
            <BetaSchemaForm<T>
                columns={columns}
                layoutType='ModalForm'
                onFinish={handleFinish}
                {...rest}
            />
        );
    }

    return (
        <ModalForm<T>
            onFinish={handleFinish}
            {...rest}
        >
            {children}
        </ModalForm>
    );
};

export default MyModalForm;
