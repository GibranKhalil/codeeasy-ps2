import { Highlight, themes } from "prism-react-renderer"

interface CodeViewerProps {
  language: string;
  code: string;
  customStyle?: React.CSSProperties;
  id?: string,
}

const CodeViewer = ({ language, code, customStyle, id }: CodeViewerProps) => {
  return (
    <Highlight
      theme={themes.oneDark}
      code={code}
      language={language}
    >
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style} className="overflow-y-auto">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span>{i + 1}</span>
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
