import openModal, { ModalType } from './components/openModal';
import openModalForm, { ModalFormType } from './components/openModalForm';
type useModalType = 'dom' | 'form';
const useModalFn = (
  type: useModalType = 'dom',
): ((config: ModalType) => void) | ((config: ModalFormType) => void) => {
  return type === 'dom' ? openModal : openModalForm;
};
export default useModalFn;
