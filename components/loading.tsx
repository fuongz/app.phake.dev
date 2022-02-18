import styles from "./../styles/Loading.module.css";

const Loading = (props: any) => {
  return (
    <div
      className={`${styles["app-loading"]} ${
        props.loading || styles["app-loading--hidden"]
      }`}
    >
      <div className={styles["sk-cube-grid"]}>
        <div className={styles["sk-cube"]}></div>
        <div className={styles["sk-cube"]}></div>
        <div className={styles["sk-cube"]}></div>
        <div className={styles["sk-cube"]}></div>
        <div className={styles["sk-cube"]}></div>
        <div className={styles["sk-cube"]}></div>
        <div className={styles["sk-cube"]}></div>
        <div className={styles["sk-cube"]}></div>
        <div className={styles["sk-cube"]}></div>
      </div>
    </div>
  );
};

export default Loading;
