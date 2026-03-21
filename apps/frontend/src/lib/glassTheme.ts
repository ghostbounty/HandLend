import { useMemo } from 'react';
import { theme } from 'antd';
import type { ConfigProviderProps } from 'antd';
import { createStyles } from 'antd-style';
import clsx from 'clsx';

const useStyles = createStyles(({ css, token }) => {
  const glassBorder = {
    boxShadow: [
      `0 6px 16px rgba(0,0,0,0.4)`,
      `inset 0 0 5px 2px rgba(255,255,255,0.08)`,
      `inset 0 1px 0 rgba(255,255,255,0.15)`,
    ].join(','),
    border: `1px solid rgba(255,255,255,0.1)`,
  };

  const glassBox = {
    ...glassBorder,
    background: `rgba(15,23,42,0.5)`,
    backdropFilter: 'blur(12px)',
  };

  return {
    glassBorder: css(glassBorder),
    glassBox: css(glassBox),
    notBackdropFilter: css({ backdropFilter: 'none !important' }),
    app: css({ textShadow: '0 1px rgba(0,0,0,0.1)' }),
    cardRoot: css({
      ...glassBox,
      backgroundColor: 'rgba(15,23,42,0.55) !important',
    }),
    modalContent: css({
      ...glassBox,
      backdropFilter: 'none',
    }),
    buttonRoot: css(glassBorder),
    dropdownOverlay: css({
      ...glassBox,
      borderRadius: token.borderRadiusLG,
      '.ant-dropdown-menu': {
        background: 'transparent',
      },
    }),
  };
});

const useGlassTheme = () => {
  const { styles } = useStyles();

  return useMemo<ConfigProviderProps>(
    () => ({
      theme: {
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#2dd4bf',
          colorBgContainer: 'rgba(15,23,42,0.6)',
          colorBgElevated: 'rgba(15,23,42,0.85)',
          colorBgLayout: 'transparent',
          colorText: '#f1f5f9',
          colorTextSecondary: '#94a3b8',
          colorBorder: 'rgba(255,255,255,0.12)',
          borderRadius: 12,
          borderRadiusLG: 16,
          borderRadiusSM: 8,
          borderRadiusXS: 6,
          motionDurationSlow: '0.2s',
          motionDurationMid: '0.1s',
          motionDurationFast: '0.05s',
          fontFamily: '"Inter",-apple-system,BlinkMacSystemFont,sans-serif',
        },
      },
      card: {
        className: styles.cardRoot,
      },
      modal: {
        classNames: {
          content: styles.modalContent,
        },
      },
      button: {
        className: styles.buttonRoot,
      },
      alert: {
        className: clsx(styles.glassBox, styles.notBackdropFilter),
      },
      dropdown: {
        className: styles.dropdownOverlay,
      },
    }),
    [styles],
  );
};

export default useGlassTheme;
