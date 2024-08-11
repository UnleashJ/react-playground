import { useContext, useEffect, useState } from "react";
import { compile } from "./compiler";
import { PlaygroundContext } from "../../PlaygroundContext";
import iframeRaw from "./iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "../../files";
import { Message } from "../Message";

interface MessageData {
  data: {
    type: string;
    message: string;
  };
}

export default function Preview() {
  const getIframeUrl = () => {
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>`
      );
    return URL.createObjectURL(new Blob([res], { type: "text/html" }));
  };
  const { files } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = useState("");
  const [iframeUrl, setIframeUrl] = useState(getIframeUrl());
  const [error, setError] = useState("");
  useEffect(() => {
    window.addEventListener("message", hadnleMessage);
    return () => {
      window.removeEventListener("message", hadnleMessage);
    };
  }, []);

  const hadnleMessage = (msg: MessageData) => {
    const { type, message } = msg.data;
    if (type === "ERROR") {
      setError(message);
    }
  };

  // 文件变化 重新编译
  useEffect(() => {
    const result = compile(files);
    setCompiledCode(result);
  }, [files]);

  // import-map.json文件变化，修改iframe文件内容
  useEffect(() => {
    setIframeUrl(getIframeUrl());
  }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode]);

  return (
    <div style={{ height: "100%" }}>
      <iframe
        src={iframeUrl}
        style={{
          width: "100%",
          height: "100%",
          padding: 0,
          border: "none",
        }}
      />
      <Message type="error" content={error} />
    </div>
  );
}
