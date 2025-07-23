import { useCallback } from 'react';
import openModal, { ModalType } from './components/openModal';
import openModalForm, { ModalFormType } from './components/openModalForm';

type UseModalType = 'dom' | 'form';
// 重载声明
function useModalFn(): (config: ModalType) => void;
function useModalFn(type: 'dom'): (config: ModalType) => void;
function useModalFn<T>(type: 'form'): (config: ModalFormType<T>) => void;

function useModalFn<T extends Record<string, any>>(type: UseModalType = 'dom') {
  const open = useCallback(
    (config: any) => {
      if (type === 'dom') {
        openModal(config as ModalType);
      } else {
        openModalForm<T>(config as ModalFormType<T>);
      }
    },
    [type],
  );

  return open;
}

export default useModalFn;
