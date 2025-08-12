import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "./components/ui/toaster"
import { Provider } from "react-redux"
import { BrowserRouter } from 'react-router-dom'
import store from "./store/store"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <Provider store={store}>
      <App />
      <Toaster />
  </Provider>
  </BrowserRouter>
 )
