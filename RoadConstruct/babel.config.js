module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        rootPathPrefix: '~', // root 지시자를 ~ 로 설정
        rootPathSuffix: 'src', // src 폴더를 root 폴더로 설정
      },
    ],
  ],
};
