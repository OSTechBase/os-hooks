import { createRoot } from 'react-dom/client';
import MyModalForm from './MyModalForm';
import { ModalFormProps } from '@ant-design/pro-components';
import React, { SyntheticEvent } from 'react';
import type { ProFormColumnsType } from '@ant-design/pro-components';

interface configForm {
    children?: JSX.Element;
    onClose?: (e: SyntheticEvent<Element, Event>) => void;
    onFinish?: Function;
    columns?: ProFormColumnsType<any>;
}
export type ModalFormType = configForm & ModalFormProps
const openModalForm = (config: ModalFormType) => {
    const { onClose } = config
    const divBox = document.createElement('div');
    document.body.appendChild(divBox);
    const root = createRoot(divBox);

    const closeModal = (e: SyntheticEvent<Element, Event>) => {
        if (onClose) onClose(e)
        renderModal({ ...currentConfig, open: false, modalProps: { afterClose: destruction, ...currentConfig.modalProps } });
    };

    const destruction = () => {
        //不销毁
        if (!currentConfig.modalProps?.destroyOnHidden) {
            return
        }
        // 延迟销毁，确保React有机会更新DOM  
        setTimeout(() => {
            try {
                root.unmount();
                if (divBox.parentNode) {
                    divBox.parentNode.removeChild(divBox);
                }
            } catch (error) {
                console.error('销毁弹框报错:', error);
            }
        })
    };

    const renderModal = (params: ModalFormType & { closeModal: Function }) => {
        setTimeout(() => {
            root.render(<MyModalForm {...params} />);
        })
    };

    const currentConfig: ModalFormType & { closeModal: Function } = {
        open: true,
        modalProps: {
            destroyOnHidden: true,
            onCancel: closeModal,
        },
        closeModal,
        ...config,
    };

    renderModal(currentConfig);
};
export default openModalForm;
