export interface AllPDFFilesData {
  data?: DataEntity[] | null;
}
export interface DataEntity {
  Title: string;
  Author: string;
  Creator: string;
  Producer: string;
  "Creation Date": string;
  "Modification Date": string;
}
