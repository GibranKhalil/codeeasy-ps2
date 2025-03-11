import { Highlight, themes } from "prism-react-renderer"

interface CodeViewerProps {
  language: string;
  code: string;
  customStyle?: React.CSSProperties;
}

const CodeViewer = ({ language, code, customStyle }: CodeViewerProps) => {
  return (
    <Highlight
      theme={themes.oneDark}
      code={code}
      language={language}
    >
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre style={{
          ...style, ...customStyle, scrollbarWidth: "thin",
          scrollbarColor: "#393A40 #1E1E1E", background: 'transparent'
        }} className="overflow-y-auto">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className="mr-4 select-none">{i + 1}</span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeViewer;
