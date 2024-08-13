import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { compress, getLanguageByFileName, uncompress } from "./utils";
import { initFiles } from "./files";

export interface File {
  name: string;
  value: string;
  language: string;
}

export interface Files {
  [key: string]: File;
}
export type Theme = "light" | "dark";

export interface PlaygroundContext {
  files: Files;
  selectedFileName: string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setSelectedFileName: (fileName: string) => void;
  setFiles: (files: Files) => void;
  addFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  updateFileName: (oldFileName: string, newFileName: string) => void;
}

export const PlaygroundContext = createContext<PlaygroundContext>({
  selectedFileName: "App.tsx",
} as PlaygroundContext);

const getFilesFromUrl = () => {
  let files;
  try {
    files = JSON.parse(uncompress(window.location.hash.slice(1)));
  } catch (error) {
    //
  }
  return files;
};

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [files, setFiles] = useState<Files>(getFilesFromUrl() || initFiles);
  const [selectedFileName, setSelectedFileName] = useState("App.tsx");
  const [theme, setTheme] = useState<Theme>("light");

  const addFile = (name: string) => {
    files[name] = {
      name: name,
      value: "",
      language: getLanguageByFileName(name),
    };
    setFiles({ ...files });
  };

  const removeFile = (name: string) => {
    delete files[name];
    setFiles({ ...files });
  };

  const updateFileName = (oldFileName: string, newFileName: string) => {
    if (!files[oldFileName] || newFileName == undefined) return;
    const { [oldFileName]: value, ...rest } = files;
    const newFile: Files = {
      [newFileName]: {
        ...value,
        language: getLanguageByFileName(newFileName),
        name: newFileName,
      },
    };
    setFiles({ ...rest, ...newFile });
  };

  useEffect(() => {
    const hash = compress(JSON.stringify(files));
    window.location.hash = hash;
  }, [files]);

  return (
    <PlaygroundContext.Provider
      value={
        {
          files,
          setFiles,
          selectedFileName,
          setSelectedFileName,
          addFile,
          removeFile,
          updateFileName,
          theme,
          setTheme,
        } as PlaygroundContext
      }
    >
      {children}
    </PlaygroundContext.Provider>
  );
};
