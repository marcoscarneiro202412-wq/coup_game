import styles from './Modal.module.css'

function Modal({isOpen, onClose, children}) {
    if(!isOpen) return null;
    return (
        <div className={styles["modal-overlay"]} onClick={onClose}>
            <div className={styles["modal-content"]} onClick={e=>e.stopPropagation()}>
                <button onClick={onClose} className={styles["modal-close-btn"]}>&times;</button>
                {children}
            </div>
        </div>
    )
}

export default Modal
