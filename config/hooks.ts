export const menus = [
  {
    title: '状态',
    children: [
      'useToggle',
      'useCookieState',
      'useLocalStorageState',
      'useSessionStorageState',
      'useScroll',
      'useQueryParams',
      'useStream',
      'useLatest',
    ],
  },
  {
    title: 'Effect',
    children: ['useDebounceFn', 'useThrottleFn', 'useMemoizedFn'],
  },
  {
    title: 'Scene',
    children: [
      'useModalFn',
      'useDownload',
      'useUrlAsFile',
      'useAudioPlay',
      'useMediaRecorder',
      'useStickyBox',
      'useWebSocket',
      'useCountDown',
    ],
  },
  {
    title: '生命周期',
    children: ['useUpdateEffect', 'useUnmount'],
  },
];
