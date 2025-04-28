import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, { useState, useEffect } from "react";
import ActionAreaCard from "../components/ActionAreaCard";

interface GitHubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string | null;
}

const HomePage: React.FC = () => {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const owner = import.meta.env.VITE_OWNER as string;
      const repo = import.meta.env.VITE_GITHUB_REPO as string;
      const token = import.meta.env.VITE_TOKEN as string;

      if (!owner || !repo || !token) {
        setError("Missing VITE_OWNER, VITE_GITHUB_REPO or VITE_TOKEN");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${token}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || `GitHub API error: ${res.status}`);
        }
        const data: GitHubFile[] = await res.json();
        // only files, ignore directories
        setFiles(data.filter((f) => f.type === "file"));
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const isPDF = (name: string) => /\.(pdf)$/i.test(name);

  if (loading) return <p>Loading files…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 2,
        justifyContent: "center",
        marginX: "auto",
      }}
    >
      <Grid container spacing={2}>
        {files.map((file) => {
          if (isPDF(file.name) && file.download_url)
            return (
              <Grid size={{ xs: 6, md: 3 }}>
                <ActionAreaCard
                  title={file.name}
                  imageSrc={
                    "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                />
              </Grid>
            );
        })}
      </Grid>
    </Box>
  );
};

export default HomePage;
