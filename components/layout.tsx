import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '@/styles/Layout.module.css'
import Dropdown from '@/components/common/dropdown'
import { useUser } from '@/packages/auth'
import { supabaseClient } from '@/packages/auth'

type Nav = {
  label: string
  to: string
  accessBy?: string[]
}

const Layout = ({ children }: any) => {
  const router = useRouter()
  const { user }: any = useUser()

  const navs: Nav[] = [
    {
      to: '/',
      label: 'Home',
    },
    {
      to: '/accounting',
      label: 'Accounting',
    },
  ]

  return (
    <div className={styles['app-container']}>
      <header className={styles['app-header']}>
        <div className={styles['app-header-navigation']}>
          <div className={styles['tabs']}>
            <Link href="/">
              <a className={styles['logo']}>
                <span className={styles['logo-icon']}>
                  <Image src="/icons/almeria-logo.svg" width={50} height={50} alt="" />
                </span>
                <h1 className={styles['logo-title']}>
                  <span>
                    <span className="text-sm">Phake</span> <span className={`text-gray-100 font-medium`}>Apps</span>
                  </span>
                </h1>
              </a>
            </Link>
            {navs.map((item, index) =>
              !item.accessBy || (item.accessBy && item.accessBy.includes(user?.email)) ? (
                <Link key={`nav-index-${index}`} href={item.to}>
                  <a className={`${styles['tab-link']} ${router.pathname === item.to ? styles['tab-link--active'] : ''}`}>{item.label}</a>
                </Link>
              ) : (
                ''
              )
            )}
            <div className={styles['app-header-actions']}>
              {user ? (
                <>
                  <div className={styles['app-header-user']}>
                    <span className={styles['app-header-user-avatar']}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/icons/almeria-avatar.webp" alt="" />
                    </span>

                    <Dropdown
                      label={user.user_metadata.name || `${user.user_metadata.firstName} ${user.user_metadata.lastName}`}
                      items={[
                        {
                          label: 'Your profile',
                          to: '/auth/profile',
                        },
                        {
                          label: 'Sign out',
                          onClick: () => {
                            supabaseClient.auth.signOut()
                            router.push('/auth/signin')
                          },
                        },
                      ]}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className={styles['app-body']}>{children}</main>
    </div>
  )
}

export default Layout
