export interface StickyState {
  isStickyTop: boolean;
  isStickyBottom: boolean;
}

export interface UseStickyBoxOptions {
  offsetTop?: number; // 吸顶偏移量
  offsetBottom?: number; // 吸底偏移量
}
