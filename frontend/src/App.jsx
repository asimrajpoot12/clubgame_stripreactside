import { BrowserRouter as Router, Routes, Route, Link,Navigate } from 'react-router-dom';
import CheckoutForm from './components/CheckoutForm/CheckoutForm'
// import './App.css'

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/CheckoutForm" />} />
      <Route path="/CheckoutForm/:email/:amount/:coins" element={<CheckoutForm />} />
    </Routes>
  </Router>
  )
}

export default App
