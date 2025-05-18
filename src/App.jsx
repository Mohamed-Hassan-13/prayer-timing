import { Container } from "@mui/material";
import MainContent from "./Components/MainContent";
function App() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Container maxWidth="xl">
          <MainContent />
        </Container>
      </div>
    </>
  );
}

export default App;
