import React from 'react';
import styles from './RepositoryViewer.module.css';

export interface Commit {
  hash: string;
  author: string;
  date: string;
  message: string;
  filesChanged: number;
}

interface RepositoryViewerProps {
  repoName: string;
  commits: Commit[];
}

export default function RepositoryViewer({ repoName, commits }: RepositoryViewerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>REPOSITORY: {repoName}</h3>
        <span className={styles.branch}>branch: main</span>
      </div>
      <div className={styles.commitList}>
        {commits.map((commit) => (
          <div key={commit.hash} className={styles.commit}>
            <div className={styles.commitHeader}>
              <span className={styles.hash}>{commit.hash}</span>
              <span className={styles.date}>{commit.date}</span>
            </div>
            <div className={styles.message}>{commit.message}</div>
            <div className={styles.footer}>
              <span className={styles.author}>{commit.author}</span>
              <span className={styles.files}>{commit.filesChanged} files changed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
