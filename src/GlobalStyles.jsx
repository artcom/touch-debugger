import { createGlobalStyle } from "styled-components"

export const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: black;
        touch-action: none;
    }

    body {
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        background: black;
        font-family: sans-serif;
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        touch-action: none;
    }

    #root {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        border: 1px solid #111;
        color: white;
        position: relative;
        touch-action: none;
    }
`
