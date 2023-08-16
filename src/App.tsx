import './App.css'
import { Provider } from 'react-redux'
import KanbanBoard from './components/KanbanBoard'
import store from './Redux/store'

function App() {
  return (
    <Provider store={store}>
      <KanbanBoard />
    </Provider>
  )
}

export default App
