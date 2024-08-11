import styles from './index.module.scss'
import logoSvg from './icons/logo.svg'; // vite做的处理，引入 .svg 会返回它的路径

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img alt='logo' src={logoSvg}/>
        <span>React Playground</span>
      </div>
    </div>
  )
}
