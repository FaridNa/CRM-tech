import React, {useEffect, useState} from 'react';
import './SearchItems.css';


const SearchItems = ({value, type, func, focus}) => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        if (value.length >= 3) {
            fetch(`https://volga24bot.com/kartoteka/api/searchObjects.php?input=${value}`)
                .then(response => response.json())
                .then(commits => setItems(commits));
        }
    }, [value]);


    return (
        <>

                {items.length !== 0 ?
                    <ul className='search-items'>
                        {items.map(el => <li key={el[0]} onClick={() => {
                            func(el[0], el[1], el[2]);
                            focus();
                        }}>{type === 'num' ? `№ ${el[0]}` : null}{type === 'name' ? `${el[1]}` : null}{type === 'address' ? `${el[2]}` : null}
                        </li>)}</ul> : null}

        </>

    );
}



export default SearchItems;
