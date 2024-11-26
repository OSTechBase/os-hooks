import { useEffect, useState } from 'react';
import getScrollParent from '../utils/getScrollParent';
import { UseStickyBoxOptions, StickyState } from './stickyBoxOptions';
const useStickyBox = ({
    offsetTop = 0,
    offsetBottom = 0,
}: UseStickyBoxOptions = {}): [React.Dispatch<React.SetStateAction<HTMLElement | null>>, StickyState] => {
    const [node, setNode] = useState<HTMLElement | null>(null);
    const [stickyState, setStickyState] = useState<StickyState>({
        isStickyTop: false,
        isStickyBottom: false,
    });
    useEffect(() => {
        if (!node) return;
        const scrollParent = getScrollParent(node);
        const isWindow = scrollParent === window;
        const handleScroll = () => {
            const containerRect = node.getBoundingClientRect();

            const parentRect = isWindow
                ? { top: 0, bottom: window.innerHeight }
                : (() => {
                    const rect = (scrollParent as HTMLElement).getBoundingClientRect();
                    const style = getComputedStyle(scrollParent as HTMLElement);

                    const borderTop = parseFloat(style.borderTopWidth) || 0;
                    const borderBottom = parseFloat(style.borderBottomWidth) || 0;
                    const paddingTop = parseFloat(style.paddingTop) || 0;
                    const paddingBottom = parseFloat(style.paddingBottom) || 0;

                    return {
                        top: rect.top + borderTop + paddingTop,
                        bottom: rect.bottom - borderBottom - paddingBottom,
                    };
                })();

            const isStickyTop = containerRect.top <= parentRect.top + offsetTop;
            const isStickyBottom = containerRect.bottom >= parentRect.bottom - offsetBottom;

            setStickyState({ isStickyTop, isStickyBottom });
        };

        // 设置初始样式
        if (node) {
            node.style.position = 'sticky';
            node.style.top = `${offsetTop}px`;
            if (offsetBottom) {
                node.style.bottom = `${offsetBottom}px`;
            }
        }

        const target = isWindow ? window : scrollParent as HTMLElement;

        // 监听滚动和窗口变化
        target.addEventListener('scroll', handleScroll);
        target.addEventListener('resize', handleScroll);

        // 初始化触发
        handleScroll();

        return () => {
            target.removeEventListener('scroll', handleScroll);
            target.removeEventListener('resize', handleScroll);
        };
    }, [node, offsetTop, offsetBottom]);
    return [setNode, stickyState];
};
export default useStickyBox