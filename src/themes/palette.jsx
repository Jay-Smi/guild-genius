/**
 * Color intention that you want to used in your theme
 * @param {JsonObject} theme Theme customization object
 */

export default function themePalette(theme) {
    return {
        mode: theme?.customization?.navType,

        ...(theme?.customization?.navType === "light"
            ? {
                  primary: {
                      light: theme.colors?.primaryLight,
                      main: theme.colors?.primaryMain,
                      dark: theme.colors?.primaryDark,
                      200: theme.colors?.primary200,
                      800: theme.colors?.primary800,
                  },
                  secondary: {
                      light: theme.colors?.secondaryLight,
                      main: theme.colors?.secondaryMain,
                      dark: theme.colors?.secondaryDark,
                      200: theme.colors?.secondary200,
                      800: theme.colors?.secondary800,
                  },
                  background: {
                      paper: theme.paper,
                      default: theme.backgroundDefault,
                      dark1: theme.colors?.grey100,
                      dark2: theme.colors?.grey200,
                  },
                  text: {
                      primary: theme.darkTextPrimary,
                      secondary: theme.darkTextSecondary,
                      dark: theme.textDark,
                      hint: theme.colors?.grey100,
                  },
              }
            : {
                  primary: {
                      light: theme.colors?.darkPrimaryLight,
                      main: theme.colors?.darkPrimaryMain,
                      dark: theme.colors?.darkPrimaryDark,
                      200: theme.colors?.darkPrimary200,
                      800: theme.colors?.darkPrimary800,
                  },
                  secondary: {
                      light: theme.colors?.darkSecondaryLight,
                      main: theme.colors?.darkSecondaryMain,
                      dark: theme.colors?.darkSecondaryDark,
                      200: theme.colors?.darkSecondary200,
                      800: theme.colors?.darkSecondary800,
                  },
                  background: {
                      paper: theme.colors?.darkPaper,
                      default: theme.colors?.darkBackground,
                      dark1: theme.colors?.darkLevel1,
                      dark2: theme.colors?.darkLevel2,
                      dark3: theme.colors?.darkLevel3,
                  },
                  text: {
                      primary: theme.colors?.darkPrimary200,
                      secondary: theme.colors?.darkPrimaryLight,
                      dark: theme.colors?.darkTextPrimary,
                      hint: theme.colors?.darkTextSecondary,
                      title: theme.colors?.darkTextTitle,
                  },
              }),
        common: {
            black: theme.colors?.darkPaper,
        },

        error: {
            light: theme.colors?.errorLight,
            main: theme.colors?.errorMain,
            dark: theme.colors?.errorDark,
        },
        orange: {
            light: theme.colors?.orangeLight,
            main: theme.colors?.orangeMain,
            dark: theme.colors?.orangeDark,
        },
        warning: {
            light: theme.colors?.warningLight,
            main: theme.colors?.warningMain,
            dark: theme.colors?.warningDark,
        },
        success: {
            light: theme.colors?.successLight,
            200: theme.colors?.success200,
            main: theme.colors?.successMain,
            dark: theme.colors?.successDark,
        },
        grey: {
            50: theme.colors?.grey50,
            100: theme.colors?.grey100,
            500: theme.colors?.grey500,
            600: theme.colors?.grey600,
            700: theme.colors?.grey700,
            800: theme.colors?.grey800,
            900: theme.colors?.grey900,
        },

        dark: {
            light: theme.colors?.darkTextPrimary,
            main: theme.colors?.darkLevel1,
            dark: theme.colors?.darkLevel2,
            800: theme.colors?.darkBackground,
            900: theme.colors?.darkPaper,
        },

        wow: {
            druid: theme.colors?.wowDruid,
            hunter: theme.colors?.wowHunter,
            mage: theme.colors?.wowMage,
            paladin: theme.colors?.wowPaladin,
            priest: theme.colors?.wowPriest,
            rogue: theme.colors?.wowRogue,
            shaman: theme.colors?.wowShaman,
            warlock: theme.colors?.wowWarlock,
            warrior: theme.colors?.wowWarrior,
        },
    };
}
