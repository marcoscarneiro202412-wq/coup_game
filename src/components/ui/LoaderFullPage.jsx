import { ThreeDots } from 'react-loader-spinner'
import styles from '../styles/LoaderFullPage.module.css'

function LoaderFullPage() {
    return (
        <div className={styles.loader}>
            <ThreeDots height="20%" width="20%" color='#fff' />
        </div>
    )
}

export default LoaderFullPage
