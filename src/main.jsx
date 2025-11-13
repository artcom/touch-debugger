import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { App } from "./components/App"
import { GlobalStyles } from "./GlobalStyles"

main()

async function main() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
      <GlobalStyles />
      <App />
    </StrictMode>,
  )
}
