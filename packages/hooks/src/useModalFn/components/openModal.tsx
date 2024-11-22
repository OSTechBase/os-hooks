import { createRoot } from 'react-dom/client';
import MyModal from './MyModal';
import { ModalProps } from 'antd/lib/modal/interface';
import { SyntheticEvent } from 'react';
import React from 'react';
interface config {
    onOk?: Function;
    onClose?: (e: SyntheticEvent<Element, Event>) => void;
    children?: React.ReactNode;
}
interface Props {
    onOk?: Function;
    onCancel: Function;
    closeModal: Function;
    afterClose?: Function;
    children?: React.ReactNode;
    open: boolean;
    confirmLoading?: boolean;
}
export type ModalType = config & ModalProps
//将弹框封装成静态方法
const openModal = (config: ModalType) => {
    const { onClose } = config
    const divBox = document.createElement('div');
    document.body.appendChild(divBox);
    const root = createRoot(divBox);

    const closeModal = (e: SyntheticEvent<Element, Event>) => {
        if (onClose) onClose(e)
        renderModal({ ...currentConfig, open: false, confirmLoading: false, afterClose: destruction });
    };

    const destruction = () => {
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

    const renderModal = (params: Props) => {
        setTimeout(() => {
            root.render(<MyModal {...params} />);
        })
    };

    const currentConfig: Props = {
        ...config,
        open: true,
        onCancel: closeModal,
        closeModal,
    };
    renderModal(currentConfig);
};
export default openModal;
