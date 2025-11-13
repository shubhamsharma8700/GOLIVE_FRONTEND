import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { AppRouter } from "./routes/AppRouter";

function App() {
  return (
    <Router>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </Router>
  );
}

export default App;
