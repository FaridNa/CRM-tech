import { useState, useEffect } from "react";
import styles from './Equipment.module.scss';

const pages = {
  start: '/',
  equipmentView: 'Просмотр Оборудования',
}

const PageButton = ({ children, ...props }) => {
  return (
    <button className={styles.pageButton} {...props} >{children}</button>
  )
}

const Equipment = () => {
  const [page, setPage] = useState(pages.start);

  return (
    <div>
      <PageButton onClick={() => setPage(pages.equipmentView)}>{pages.equipmentView}</PageButton>

      {page === pages.equipmentView
        ? <div>Рюкзак Техника</div>
        : null}

    </div>
  )
}

export { Equipment };