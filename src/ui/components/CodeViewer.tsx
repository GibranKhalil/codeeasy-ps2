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
        <pre translate="no" style={{
          ...style, ...customStyle, scrollbarWidth: "thin",
          scrollbarColor: "#222326 #19191b", background: 'transparent'
        }} className="overflow-y-auto notranslate">
          {tokens.map((line, i) => (
            <div translate="no" key={i} {...getLineProps({ line })}>
              <span className="mr-4 select-none">{i + 1}</span>
              {line.map((token, key) => (
                <span translate="no" key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeViewer;
