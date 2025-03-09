import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeViewerProps {
  language: string;
  code: string;
}

const CodeViewer = ({ language, code }: CodeViewerProps) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={darcula}
      showLineNumbers
      customStyle={{
        background: "transparent",
        padding: "0",
        overflowY: "auto",
        maxHeight: "100%",
        scrollbarWidth: "thin",
        scrollbarColor: "#393A40 #1E1E1E",
      }}
      codeTagProps={{
        style: { backgroundColor: "transparent" },
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeViewer;
