import ChatBox from './components/ChatBox';
import PDFUpload from './components/PDFUpload';
import ChatUI from './pages/ChatUI';

function App() {
  return (
    <div className="App">
      <PDFUpload />
      <ChatBox />
      {/* <ChatUI /> */}
    </div>
  );
}

export default App;
