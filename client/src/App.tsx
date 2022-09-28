import List from "./components/images/List";
import ImageUpload from "./components/ImageUpload";

function App() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <ImageUpload />
      <List />
    </div>
  );
}

export default App;
