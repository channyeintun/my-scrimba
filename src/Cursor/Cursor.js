import cursor from './cursor.svg';
import styles from './Cursor.module.css';

export function Cursor({ ...rest }) {
      return <img className={styles.cursor} src={cursor}
                  alt="cursor" {...rest}/>
}