import { PropsWithChildren, createContext, useState } from "react";
import { getLanguageByFileName } from "./utils";
import { initFiles } from "./files";

export interface File {
  name: string;
  value: string;
  language: string;
}

export interface Files {
  [key: string]: File;
}

export interface PlaygroundContext {
  files: Files;
  selectedFileName: string;
  setSelectedFileName: (fileName: string) => void;
  setFiles: (files: Files) => void;
  addFile: (fileName: string) => void;
  removeFile: (fileName: string) => void;
  updateFileName: (oldFileName: string, newFileName: string) => void;
}

export const PlaygroundContext = createContext<PlaygroundContext>({
  selectedFileName: "App.tsx",
} as PlaygroundContext);

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [files, setFiles] = useState<Files>(initFiles);
  const [selectedFileName, setSelectedFileName] = useState("App.tsx");

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
        } as PlaygroundContext
      }
    >
      {children}
    </PlaygroundContext.Provider>
  );
};
