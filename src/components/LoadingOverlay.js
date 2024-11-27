// src/components/LoadingOverlay.js

import React from "react";
import styles from "./LoadingOverlay.module.css";

function LoadingOverlay() {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.spinner}></div>
    </div>
  );
}

export default LoadingOverlay;
