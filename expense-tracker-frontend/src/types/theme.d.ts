import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    default: string;
    paper: string;
    gradient: string;
  }

  interface Theme {
    custom?: {
      colors: {
        gradient: {
          start: string;
          end: string;
        }
      }
    }
  }

  interface ThemeOptions {
    custom?: {
      colors: {
        gradient: {
          start: string;
          end: string;
        }
      }
    }
  }
}