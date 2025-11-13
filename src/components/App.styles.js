import { styled } from "styled-components"

export const ROISelectionOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => !["selectionStart", "selectionEnd"].includes(prop),
})`
  position: fixed;
  left: ${({ selectionStart, selectionEnd }) =>
    selectionStart
      ? `${Math.min(selectionStart.x, selectionEnd?.x || selectionStart.x)}px`
      : "0px"};
  top: ${({ selectionStart, selectionEnd }) =>
    selectionStart
      ? `${Math.min(selectionStart.y, selectionEnd?.y || selectionStart.y)}px`
      : "0px"};
  width: ${({ selectionStart, selectionEnd }) =>
    selectionStart && selectionEnd ? `${Math.abs(selectionEnd.x - selectionStart.x)}px` : "100vw"};
  height: ${({ selectionStart, selectionEnd }) =>
    selectionStart && selectionEnd ? `${Math.abs(selectionEnd.y - selectionStart.y)}px` : "100vh"};
  border: ${({ selectionStart, selectionEnd }) =>
    selectionStart && selectionEnd
      ? "2px solid rgba(255, 255, 255, 0.8)"
      : "2px dashed rgba(255, 255, 255, 0.5)"};
  background-color: ${({ selectionStart, selectionEnd }) =>
    selectionStart && selectionEnd ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)"};
  pointer-events: none;
  z-index: 999;
  box-sizing: border-box;
  cursor: crosshair;
`

export const ROIIndicator = styled.div.withConfig({
  shouldForwardProp: (prop) => !["x", "y", "width", "height"].includes(prop),
})`
  position: fixed;
  left: ${(props) => `${props.x}px`};
  top: ${(props) => `${props.y}px`};
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  border: 2px dashed rgba(255, 255, 0, 0.8);
  background-color: rgba(255, 255, 0, 0.1);
  pointer-events: none;
  z-index: 998;
  box-sizing: border-box;
`
