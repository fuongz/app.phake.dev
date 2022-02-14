import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../lib/userContext";
import styles from "../styles/Layout.module.css";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const { user, signOut } = useUser();

  const navs = [
    {
      to: "/",
      label: "Home",
    },
    {
      to: "/farm",
      label: "Farming",
    },
  ];

  return (
    <div className={styles["app-container"]}>
      <header className={styles["app-header"]}>
        <div className={styles["app-header-navigation"]}>
          <div className={styles["tabs"]}>
            <div className={styles["logo"]}>
              <span className={styles["logo-icon"]}>
                <Image
                  src="/icons/almeria-logo.svg"
                  width={50}
                  height={50}
                  alt=""
                />
              </span>
              <h1 className={styles["logo-title"]}>
                <span>
                  <span className={`text-gray-100 font-medium`}>Fin</span>{" "}
                  <span className="text-sm">Phake</span>
                </span>
              </h1>
            </div>
            {navs.map((item, index) => (
              <Link key={`nav-index-${index}`} href={item.to}>
                <a
                  className={`${styles["tab-link"]} ${
                    router.pathname === item.to
                      ? styles["tab-link--active"]
                      : ""
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
            <div className={styles["app-header-actions"]}>
              {user ? (
                <>
                  <button className={styles["app-header-user"]}>
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        signOut();
                      }}
                    >
                      {user.user_metadata.name ||
                        `${user.user_metadata.firstName} ${user.user_metadata.lastName}`}
                    </span>
                    <span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/icons/almeria-avatar.webp" alt="" />
                    </span>
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className={styles["app-body"]}>{children}</main>
    </div>
  );
};

export default Layout;
